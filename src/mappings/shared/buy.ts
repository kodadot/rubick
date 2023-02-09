import { ensure } from '@kodadot1/metasquid'
import { plsBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { CollectionEntity, NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isBuyLegalOrElseError, isInteractive, isPositiveOrElseError } from '../utils/consolidator'
import { getInteractionWithExtra } from '../utils/getters'
import logger, { logError } from '../utils/logger'
import { Context, Action, RmrkInteraction } from '../utils/types'
import { createEvent } from './event'

export async function buy(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, extra } = unwrap(context, getInteractionWithExtra);
    interaction = value
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    isInteractive(nft)
    isPositiveOrElseError(nft.price, true)
    isBuyLegalOrElseError(nft, extra || [])
    const originalPrice = nft.price
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = caller
    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    plsBe(real, nft.collection)
    const collection = await get<CollectionEntity>(context.store, CollectionEntity, nft.collection.toString())
    collection.updatedAt = timestamp

    logger.success(`[BUY] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await context.store.save(collection)
    await createEvent(nft, Action.BUY, { blockNumber, caller, timestamp }, String(originalPrice), context.store, originalOwner)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[BUY] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}