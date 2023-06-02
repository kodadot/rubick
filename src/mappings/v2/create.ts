import { plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { create, get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import md5 from 'md5'
import { CollectionEntity } from '../../model'
import { handleMetadata, isLewd } from '../shared'
import { unwrap } from '../utils/extract'
import { error, success } from '../utils/logger'
import { Action, Collection, Context } from '../utils/types'
import { getCreateCollection } from './getters'

const OPERATION = Action.CREATE

export async function createCollection(context: Context): Promise<void> {
  let collection: Optional<Collection>
  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getCreateCollection)
    collection = value.value
    plsBe<string>(real, collection.id)
    const entity = await get<CollectionEntity>(context.store, CollectionEntity, collection.id)

    plsNotBe<CollectionEntity>(real, entity as CollectionEntity)

    const final = create<CollectionEntity>(CollectionEntity, collection.id, {})

    final.blockNumber = BigInt(blockNumber)
    final.createdAt = timestamp
    final.currentOwner = caller
    final.distribution = 0
    final.floor = BigInt(0)
    final.burned = false
    final.hash = md5(collection.id)
    final.highestSale = BigInt(0)
    final.issuer = caller
    final.lewd = false
    final.max = Number(collection.max) || 0
    final.metadata = collection.metadata
    final.name = (collection.name || '').trim()
    final.nftCount = 0
    final.ownerCount = 0
    final.supply = 0
    final.symbol = collection.symbol.trim()
    final.updatedAt = timestamp
    final.version = version
    final.volume = BigInt(0)

    if (final.metadata) {
      const metadata = await handleMetadata(final.metadata, final.name, context.store)
      final.meta = metadata
      final.image = metadata?.image
      final.media = metadata?.animationUrl
      final.lewd = metadata ? isLewd(metadata) : false
      if (metadata?.name && !final.name) {
        final.name = metadata.name
      }
    }

    await context.store.save(final).then(() => {
      success(OPERATION, final.id)
    })
  } catch (e) {
    error(e, OPERATION, JSON.stringify(collection))
  }
}
