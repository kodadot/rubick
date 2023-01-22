import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Equip } from '@vikiival/minimark/v2'

import { NFTEntity } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getEquip } from './getters'

const OPERATION = Action.EQUIP

export async function equip(context: Context) {
  let interaction: Optional<Equip> = null

  try {
    const { value: equip, caller, timestamp, blockNumber, version } = unwrap(context, getEquip);
    interaction = equip
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe(real, nft)
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.updatedAt = timestamp

    // TODO: add logic for EQUIPing resource

    logger.success(`[EQUIP] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, Action.EQUIP, { blockNumber, caller, timestamp, version }, `${interaction.id}::${interaction.baseslot}`, context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[EQUIP] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}
