import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { CollectionEntity, NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import logger, { logError } from '../utils/logger'
import { Context, Action, RmrkInteraction } from '../utils/types'
import { createEvent } from './event'


export async function burn(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction);
    interaction = value
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    plsNotBe<NFTEntity>(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.price = BigInt(0)
    nft.burned = true
    nft.updatedAt = timestamp

    plsBe(real, nft.collection)
    const collection = await get<CollectionEntity>(context.store, CollectionEntity, nft.collection.toString())
    collection.updatedAt = timestamp
    collection.supply -= 1

    logger.success(`[CONSUME] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await context.store.save(collection)
    await createEvent(nft, Action.BURN, { blockNumber, caller, timestamp, version }, '', context.store)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CONSUME] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}