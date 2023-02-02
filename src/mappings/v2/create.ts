import { plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { create, get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { CollectionEntity } from '../../model'
import { handleMetadata } from '../shared'
import { unwrap } from '../utils/extract'
import { getCreateCollection } from './getters'
import logger, { logError } from '../utils/logger'
import { Action, Collection, Context } from '../utils/types'

const OPERATION = Action.CREATE


export async function createCollection(context: Context): Promise<void> {
  let collection: Optional<Collection> = undefined
  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getCreateCollection);
    collection = value.value
    plsBe<string>(real, collection.id)
    const entity = await get<CollectionEntity>(
      context.store,
      CollectionEntity,
      collection.id
    )

    plsNotBe<CollectionEntity>(real, entity as CollectionEntity)

    const final = create<CollectionEntity>(CollectionEntity, collection.id, {})

    final.name = (collection.name || '').trim()
    final.max = Number(collection.max) || 0
    final.issuer = caller
    final.currentOwner = caller
    final.symbol = collection.symbol.trim()
    final.blockNumber = BigInt(blockNumber)
    final.metadata = collection.metadata
    final.createdAt = timestamp
    final.version = version
    final.updatedAt = timestamp
    final.nftCount = 0
    final.supply = 0

    // if (final.metadata) {
    //   const metadata = await handleMetadata(final.metadata, final.name, context.store)
    //   final.meta = metadata
    //   if (metadata?.name && !final.name) {
    //     final.name = metadata.name
    //   }
    // }
    logger.debug(`[${OPERATION}] ${final.id}`)
    await context.store.save(final).then(() => {
      logger.debug(`[${OPERATION}] ${final.id} saved`)
    })
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[${OPERATION}] ${e.message}, ${JSON.stringify(collection)}`)
    )
  }
}


