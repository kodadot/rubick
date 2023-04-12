import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Equippable, Interaction, resolveEquippable } from '@kodadot1/minimark/v2'

import { NFTEntity } from '../../model'
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
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    plsBe(real, nft)
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.updatedAt = timestamp

    const equipOption = resolveEquippable(interaction.value)

    // TODO: add logic for EQUIPing resource
    switch (equipOption.operation) {
      case '+':
        break;
      case '-':
        break;
      case '*':
        break;
    }
    
    success(OPERATION, `${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(
      nft,
      OPERATION,
      { blockNumber, caller, timestamp, version },
      `${interaction.id}::${interaction.slot}`,
      context.store
    )
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
