import { getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Equippable, Interaction, resolveEquippable, toPartId } from '@kodadot1/minimark/v2'

import { Part } from '../../model'
import { unwrap } from '../utils'
import { isIssuerOrElseError } from '../utils/consolidator'
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
    isIssuerOrElseError(part.base, caller)

    const equipOption = resolveEquippable(interaction.value)

    if (!part.equippable) {
      part.equippable = []
    }

    if (part.type !== 'slot') {
      throw new Error(`Part ${part.id} is not a slot`)
    }

    switch (equipOption.operation) {
      case '+':
        const set = new Set([...part.equippable, ...equipOption.collections])
        part.equippable = [...set]
        break
      case '-':
        const toRemove = new Set(equipOption.collections)
        part.equippable = part.equippable.filter((e) => !toRemove.has(e))
        break
      case '*':
        part.equippable = equipOption.collections
        break
    }

    success(OPERATION, `${part.id} from ${caller}`)
    await context.store.save(part)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
