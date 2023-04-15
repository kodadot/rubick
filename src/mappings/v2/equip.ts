import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get, getWhere, getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Equip, baseIdFromPartId } from '@kodadot1/minimark/v2'

import { NFTEntity, Part } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError, pending } from '../utils/consolidator'
import { findParentBaseResouce } from '../utils/entity'
import { error, success, warn } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getEquip } from './getters'

const OPERATION = Action.EQUIP

export async function equip(context: Context) {
  let interaction: Optional<Equip> = null

  try {
    const { value: equip, caller, timestamp, blockNumber, version } = unwrap(context, getEquip)
    interaction = equip
    const nft = await getWith<NFTEntity>(context.store, NFTEntity, interaction.id, {
      parent: true,
      equipped: true,
      collection: true,
    })
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    plsBe(real, nft.parent)
    plsNotBe(pending, nft)
    nft.updatedAt = timestamp

    if (interaction.baseslot === '') {
      const id = nft.equipped?.id
      nft.equipped = null
      await createEvent(nft, Action.UNEQUIP, { blockNumber, caller, timestamp, version }, `${id}`, context.store)

      await context.store.save(nft)
      return
    }

    if (nft.equipped?.id === interaction.baseslot) {
      warn(OPERATION, `Already equipped ${nft.id} in slot ${interaction.baseslot} from ${caller}`)
      return
    }

    const baseId = baseIdFromPartId(interaction.baseslot)

    const resource = await findParentBaseResouce(context.store, nft.parent?.id as string, baseId)
    plsNotBe(pending, resource)

    const part = await get<Part>(context.store, Part, interaction.baseslot)
    if (part.type !== 'slot') {
      throw new Error(`Part ${part.id} is not a slot`)
    }

    const isEqquipable = part.equippable?.some((e) => e === nft.collection?.id || e === '*')

    if (!isEqquipable) {
      throw new Error(`Part ${part.id} is not equippable by ${nft.collection?.id}`)
    }

    nft.equipped = part

    success(OPERATION, `${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(
      nft,
      OPERATION,
      { blockNumber, caller, timestamp, version },
      `${interaction.baseslot}`,
      context.store
    )
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
