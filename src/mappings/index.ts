import {
  CollectionEntity,
  Emote, Event,
  Interaction, MetadataEntity as Metadata,
  NFTEntity
} from '../model/generated'

import { isRemark, unwrapRemark } from '@kodadot1/minimark'
import md5 from 'md5'
import { SystemRemarkCall } from '../types/calls'
import { unwrap } from './utils'
import { updateCache } from './utils/cache'
import { burned, isBuyLegalOrElseError, isInteractive, isOwnerOrElseError, isPositiveOrElseError, plsBe, plsNotBe, real, validateInteraction, withMeta } from './utils/consolidator'
import { create, get } from './utils/entity'
import { getCreateCollection, getCreateToken, getInteraction, getInteractionWithExtra } from './utils/getters'
import { emoteId, ensure, eventId, isEmpty } from './utils/helper'
import logger, { logError } from './utils/logger'
import { fetchMetadata } from './utils/metadata'
import {
  attributeFrom, BaseCall, Collection, Context, eventFrom,
  getNftId, NFT,
  Optional,
  RmrkEvent,
  RmrkInteraction, Store, TokenMetadata
} from './utils/types'


export async function handleRemark(context: Context): Promise<void> {
  const { remark } = new SystemRemarkCall(context).asV1020
  const value = remark.toString()

  if (isRemark(value)) {
    await mainFrame(remark.toString(), context)
  } else {
    logger.warn(`[NON RMRK VALUE] ${value}`)
  }
}

async function mainFrame(remark: string, context: Context): Promise<void> {
    const base = unwrap(context, (_: Context) => ({ value: remark }))
    try {
      const { interaction: event, version } = unwrapRemark<RmrkInteraction>(remark.toString())
      logger.pending(`[${event === RmrkEvent.MINT ? 'COLLECTION' : event}]: ${base.blockNumber}`)

      if (version === '2.0.0') {
        logger.star(`[RMRK::2.0.0] is not supported, please help us to make it awesome ${remark}`)
        return;
      }

      switch (event) {
        case RmrkEvent.MINT:
          await mint(context)
          break
        case RmrkEvent.MINTNFT:
          await mintNFT(context)
          break
        case RmrkEvent.SEND:
          await send(context)
          break
        case RmrkEvent.BUY:
          await buy(context)
          break
        case RmrkEvent.CONSUME:
          await consume(context)
          break
        case RmrkEvent.LIST:
          await list(context)
          break
        case RmrkEvent.CHANGEISSUER:
          await changeIssuer(context)
          break
        case RmrkEvent.EMOTE:
          await emote(context)
          break
        default:
          logger.start(
            `[SKIP] ${event}::${base.value}::${base.blockNumber}`
          )
      }
      await updateCache(base.timestamp,context.store)
    } catch (e) {
      logger.warn(
        `[MALFORMED]\n
         [BLOCK] ${base.blockNumber}\n
         [ERROR] ${(e as Error).message}\n
         [RMRK] ${base.value}`
      )
    }
  }

async function mint(context: Context): Promise<void> {
  let collection: Optional<Collection> = null
  try {
    const { value, caller, timestamp, blockNumber, version  } = unwrap(context, getCreateCollection);
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
    // final.events = [collectionEventFrom(RmrkEvent.MINT, remark, '')]

    // logger.watch(`[MINT] ${final.events[0]}`)

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

async function mintNFT(
  context: Context
): Promise<void> {
  let nft: Optional<NFT> = null
  try {
    const { value, caller, timestamp, blockNumber } = unwrap(context, getCreateToken);
    nft = value
    plsBe(real, nft.collection)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(context.store, CollectionEntity, nft.collection)
    )
    plsBe(real, collection)
    isOwnerOrElseError(collection, caller)
    const id = getNftId(nft, blockNumber)
    // const entity = await get<NFTEntity>(context.store, NFTEntity, id)
    // plsNotBe<NFTEntity>(real, entity as NFTEntity)
    const final = create<NFTEntity>(NFTEntity, id, {})
    final.id = id
    final.hash = md5(id)
    final.issuer = caller
    final.currentOwner = caller
    final.blockNumber = BigInt(blockNumber)
    final.name = nft.name
    final.instance = nft.instance
    final.transferable = nft.transferable
    final.collection = collection
    final.sn = nft.sn
    final.metadata = nft.metadata
    final.price = BigInt(0)
    final.burned = false
    final.createdAt = timestamp
    final.updatedAt = timestamp

    if (final.metadata) {
      const metadata = await handleMetadata(final.metadata, final.name, context.store)
      final.meta = metadata
    }

    logger.success(`[MINT] ${final.id}`)
    await context.store.save(final)
    await createEvent(final, RmrkEvent.MINTNFT, { blockNumber, caller, timestamp }, '', context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.error(`[MINT] ${e.message}, ${JSON.stringify(nft)}`)
    )
  }
}

async function send(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber } = unwrap(context, getInteraction);
    interaction = value

    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, caller)
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = interaction.value
    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    logger.success(`[SEND] ${nft.id} to ${interaction.value}`)
    await context.store.save(nft)
    await createEvent(nft, RmrkEvent.SEND, { blockNumber, caller, timestamp }, interaction.value || '', context.store, originalOwner)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[SEND] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function buy(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, extra } = unwrap(context, getInteractionWithExtra);
    interaction = value

    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    isInteractive(nft)
    isPositiveOrElseError(nft.price, true)
    isBuyLegalOrElseError(nft, extra || [])
    const originalPrice = nft.price
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = caller
    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    logger.success(`[BUY] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, RmrkEvent.BUY, { blockNumber, caller, timestamp }, String(originalPrice), context.store, originalOwner)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[BUY] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function consume(context: Context) {
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

async function list(context: Context) {
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

async function changeIssuer(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction);
    interaction = value
    plsBe(withMeta, interaction)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(context.store, CollectionEntity, interaction.id)
    )
    plsBe<CollectionEntity>(real, collection)
    isOwnerOrElseError(collection, caller)
    collection.currentOwner = interaction.value
    // collection.events?.push(
    //   collectionEventFrom(
    //     RmrkEvent.CHANGEISSUER,
    //     remark,
    //     ensure<string>(interaction.metadata)
    //   )
    // )

    logger.success(`[CHANGEISSUER] ${collection.id} from ${caller}`)
    await context.store.save(collection)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CHANGEISSUER] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function emote(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction);
    interaction = value
    plsBe(withMeta, interaction)
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe<NFTEntity>(real, nft)
    plsNotBe<NFTEntity>(burned, nft)
    const id = emoteId(interaction, caller)
    let emote = await get<Emote>(context.store, Emote, interaction.id)

    if (emote) {
      await context.store.remove(emote)
      return
    }

    emote = create<Emote>(Emote, id, {
      id,
      caller,
      value: interaction.value,
    })

    emote.nft = nft

    logger.success(`[EMOTE] ${nft.id} from ${caller}`)
    await context.store.save(emote)
  } catch (e) {
    logError(e, (e) => logger.warn(`[EMOTE] ${e.message}`))
  }
}

async function handleMetadata(
  id: string,
  name: string,
  store: Store
): Promise<Optional<Metadata>> {
  const meta = await get<Metadata>(store, Metadata, id)
  if (meta) {
    return meta
  }

  const metadata = await fetchMetadata<TokenMetadata>({ metadata: id })
  if (isEmpty(metadata)) {
    return null
  }

  const partial: Partial<Metadata> = {
    id,
    description: metadata.description || '',
    image: metadata.image,
    animationUrl: metadata.animation_url,
    attributes: metadata.attributes?.map(attributeFrom) || [],
    name: metadata.name || name,
  }

  const final = create<Metadata>(Metadata, id, partial)
  await store.save(final)
  return final
}


async function createEvent(final: NFTEntity, interaction: Interaction, call: BaseCall, meta: string, store: Store, currentOwner?: string) {
  try {
    const newEventId = eventId(final.id, interaction)
    const event = create<Event>(Event, newEventId, eventFrom(interaction, call, meta, currentOwner))
    event.nft = final
    await store.save(event)
  } catch (e) {
    logError(e, (e) => logger.warn(`[[${interaction}]]: ${final.id} Reason: ${e.message}`))
  }
  
}

