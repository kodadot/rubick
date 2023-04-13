import { plsBe, real } from '@kodadot1/metasquid/consolidator'
import { create, getOrFail as get } from '@kodadot1/metasquid/entity'
import { Mint, resolveRoyalty } from '@kodadot1/minimark/v2'
import md5 from 'md5'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'

import { CollectionEntity, NFTEntity } from '../../model/generated'
import { createEvent } from '../shared/event'
import { handleMetadata } from '../shared/metadata'
import { findRootItemById } from '../utils/entity'
import { isDummyAddress } from '../utils/helper'
import logger, { error, success } from '../utils/logger'
import { Action, Context, Optional, getNftId } from '../utils/types'
import { calculateCollectionOwnerCountAndDistribution } from '../utils/helper'
import { getCreateToken } from './getters'

const OPERATION = Action.MINT

export async function mintItem(context: Context): Promise<void> {
  let nft: Optional<Mint> = null
  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getCreateToken)
    const { value: nft, recipient: targetOwner } = value as Mint
    plsBe(real, nft.collection)
    const collection = await get<CollectionEntity>(context.store, CollectionEntity, nft.collection)
    isOwnerOrElseError(collection, caller)
    const id = getNftId(nft, blockNumber)
    // const entity = await get<NFTEntity>(context.store, NFTEntity, id) // TODO: check if exists
    // plsNotBe<NFTEntity>(real, entity as NFTEntity)
    const final = create<NFTEntity>(NFTEntity, id, {})
    final.id = id
    final.hash = md5(id)
    final.issuer = caller
    final.blockNumber = BigInt(blockNumber)
    final.name = nft.name
    final.instance = nft.symbol
    final.transferable = nft.transferable
    final.collection = collection
    final.sn = nft.sn
    final.metadata = nft.metadata
    final.price = BigInt(0)
    final.burned = false
    final.createdAt = timestamp
    final.updatedAt = timestamp
    final.emoteCount = 0
    final.version = version
    final.pending = false

    collection.updatedAt = timestamp
    collection.nftCount += 1
    collection.supply += 1
    const { ownerCount, distribution } = await calculateCollectionOwnerCountAndDistribution(
      context.store,
      collection.id,
      final.currentOwner
    )
    collection.ownerCount = ownerCount
    collection.distribution = distribution

    if (final.metadata) {
      const metadata = await handleMetadata(final.metadata, '', context.store)
      final.meta = metadata
      final.image = metadata?.image
      final.media = metadata?.animationUrl
      if (metadata?.name && !final.name) {
        final.name = metadata.name
      }
    }

    const royalty = resolveRoyalty(nft.properties)
    if (royalty) {
      final.royalty = royalty.percent
      final.recipient = royalty.receiver
    }

    const recipient = targetOwner || caller
    const isRecipientNFT = !isDummyAddress(recipient)

    if (isRecipientNFT) {
      const parent = await get<NFTEntity>(context.store, NFTEntity, recipient)
      const isCallerTheOwner = parent.currentOwner === caller
      const rootRecipientNFT = await findRootItemById(context.store, recipient)

      final.currentOwner = rootRecipientNFT.currentOwner
      final.pending = !isCallerTheOwner
      final.parent = parent
    } else {
      final.currentOwner = recipient
      final.parent = null
      final.pending = false
    }

    await context.store.save(final)
    await context.store.save(collection)
    success(OPERATION, `${final.id} from ${caller}`)
    await createEvent(final, Action.MINT, { blockNumber, caller, timestamp, version }, '', context.store)

    if (final.royalty) {
      await createEvent(
        final,
        Action.ROYALTY,
        { blockNumber, caller, timestamp, version },
        String(final.royalty || ''),
        context.store
      )
    }

    if (final.currentOwner !== caller) {
      await createEvent(
        final,
        Action.SEND,
        { blockNumber, caller, timestamp, version },
        final.currentOwner || '',
        context.store,
        caller
      )
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.trace(e)
    }
    error(e, OPERATION, JSON.stringify(nft))
  }
}
