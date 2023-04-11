import { burned, plsNotBe } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Equip } from '@kodadot1/minimark/v2'

import { NFTEntity } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import { error, success } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getEquip } from './getters'

const OPERATION = Action.EQUIP

export async function equip(context: Context) {
  let interaction: Optional<Equip> = null

  try {
    const { value: equip, caller, timestamp, blockNumber, version } = unwrap(context, getEquip)
    interaction = equip
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.updatedAt = timestamp

    // TODO: add logic for EQUIPing resource

    success(OPERATION, `${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(
      nft,
      OPERATION,
      { blockNumber, caller, timestamp, version },
      `${interaction.id}::${interaction.baseslot}`,
      context.store
    )
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
