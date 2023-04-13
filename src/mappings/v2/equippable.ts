import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get, getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Equippable, Interaction, resolveEquippable, toPartId } from '@kodadot1/minimark/v2'

import { Base, NFTEntity, Part } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import { error, success } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getAs } from './getters'

const OPERATION = Action.EQUIPPABLE

export async function equippable(context: Context) {
  let interaction: Optional<Equippable> = null

  try {
    const getE = getAs<Interaction.EQUIPPABLE>()
    const { value: equip, caller, timestamp, blockNumber, version } = unwrap(context, getE)
    interaction = equip
    const id = toPartId(interaction.id, interaction.slot)
    const part = await getWith<Part>(context.store, Part, id, { base: true })
    isOwnerOrElseError(part.base, caller)
    // base.updatedAt = timestamp

    const equipOption = resolveEquippable(interaction.value)

    if (!part.equippable) {
      part.equippable = []
    }

    // TODO: add logic for EQUIPing resource
    switch (equipOption.operation) {
      case '+':
        part.equippable.push(equipOption.collection)
        break;
      case '-':
        part.equippable = part.equippable.filter((e) => e !== equipOption.collection)
        break;
      case '*':
        part.equippable = [equipOption.collection || '*']
        break;
    }
    
    success(OPERATION, `${part.id} from ${caller}`)
    await context.store.save(part)
    // await createEvent(
    //   nft,
    //   OPERATION,
    //   { blockNumber, caller, timestamp, version },
    //   `${interaction.id}::${interaction.slot}`,
    //   context.store
    // )
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
