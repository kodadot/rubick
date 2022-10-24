import { plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { create, get } from '@kodadot1/metasquid/entity'
import { BaseCall, Optional, Store } from '@kodadot1/metasquid/types'

import { CollectionEntity, Interaction, NFTEntity, Event } from '../../model'
import { unwrap } from '../utils/extract'
import { getCreateCollection } from '../utils/getters'
import { eventId } from '../utils/helper'
import logger, { logError } from '../utils/logger'
import { Collection, Context, eventFrom } from '../utils/types'
import { handleMetadata } from './metadata'


export async function createCollection(context: Context): Promise<void> {
  let collection: Optional<Collection> = undefined
  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getCreateCollection);
    collection = value
    plsBe<string>(real, collection.id)
    const entity = await get<CollectionEntity>(
      context.store,
      CollectionEntity,
      collection.id
    )
    plsNotBe<CollectionEntity>(real, entity as CollectionEntity)

    const final = create<CollectionEntity>(CollectionEntity, collection.id, {})

    final.name = collection.name.trim()
    final.max = Number(collection.max) || 0
    final.issuer = caller
    final.currentOwner = caller
    final.symbol = collection.symbol.trim()
    final.blockNumber = BigInt(blockNumber)
    final.metadata = collection.metadata
    final.createdAt = timestamp
    final.version = version

    if (final.metadata) {
      const metadata = await handleMetadata(final.metadata, final.name, context.store)
      final.meta = metadata
    }

    logger.success(`[COLLECTION] ${final.id}`)
    await context.store.save(final)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[COLLECTION] ${e.message}, ${JSON.stringify(collection)}`)
    )
  }
}


export async function createEvent(final: NFTEntity, interaction: Interaction, call: BaseCall, meta: string, store: Store, currentOwner?: string) {
  try {
    const newEventId = eventId(final.id, interaction)
    const event = create<Event>(Event, newEventId, eventFrom(interaction, call, meta, currentOwner))
    event.nft = final
    await store.save(event)
  } catch (e) {
    logError(e, (e) => logger.warn(`[[${interaction}]]: ${final.id} Reason: ${e.message}`))
  }
  
}

