import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import logger, { logError } from '../utils/logger'
import { Context, RmrkEvent, RmrkInteraction } from '../utils/types'
import { createEvent } from './create'


export async function burn(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber } = unwrap(context, getInteraction);
    interaction = value
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe<NFTEntity>(real, nft)
    plsNotBe<NFTEntity>(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.price = BigInt(0)
    nft.burned = true
    nft.updatedAt = timestamp

    logger.success(`[CONSUME] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, RmrkEvent.CONSUME, { blockNumber, caller, timestamp }, '', context.store)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CONSUME] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}