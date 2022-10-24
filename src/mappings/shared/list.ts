import { ensure } from '@kodadot1/metasquid'
import { get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError, isPositiveOrElseError, validateInteraction } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import logger, { logError } from '../utils/logger'
import { Context, RmrkEvent, RmrkInteraction } from '../utils/types'
import { createEvent } from './event'

export async function list(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber } = unwrap(context, getInteraction);
    interaction = value
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, caller)
    const price = BigInt(interaction.value || '0')
    isPositiveOrElseError(price)
    nft.price = price
    nft.updatedAt = timestamp

    logger.success(`[LIST] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    const event = nft.price === 0n ? RmrkEvent.UNLIST : RmrkEvent.LIST
    await createEvent(nft, event, { blockNumber, caller, timestamp }, String(price), context.store)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[LIST] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}