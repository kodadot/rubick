import {
  CollectionEntity,
  Emote,
  MetadataEntity as Metadata,
  NFTEntity,
  Event,
  Interaction,
} from '../model/generated'

import { extractRemark, Records, RemarkResult, unwrap } from './utils'
import {
  attributeFrom,
  Collection,
  eventFrom,
  getNftId,
  TokenMetadata,
  NFT,
  Optional,
  RmrkEvent,
  RmrkInteraction,
  collectionEventFrom,
  Store,
  BaseCall
} from './utils/types'
import NFTUtils, { hexToString } from './utils/NftUtils'
import { isBuyLegalOrElseError, isOwnerOrElseError, isPositiveOrElseError, validateInteraction, plsBe, real, isInteractive, plsNotBe, burned, withMeta } from './utils/consolidator'
import { emoteId, ensure, ensureInteraction, isEmpty, eventId } from './utils/helper'
import { SystemRemarkCall  } from '../types/calls'
import { Context } from './utils/types'
import logger, { logError } from './utils/logger'
import { create, get } from './utils/entity'
import { fetchMetadata } from './utils/metadata'
import {updateCache} from './utils/cache'
import md5 from 'md5'
import { getCreateCollection, getCreateToken, getInteraction } from './utils/getters'
import { unwrapRemark } from '@kodadot1/minimark'


export async function handleRemark(context: Context): Promise<void> {
  const { remark } = new SystemRemarkCall(context).asV1020
  // const records = extractRemark(remark.toString(), context)
  await mainFrame(remark.toString(), context)
}

// export async function handleBatch(context: Context): Promise<void> {
//   const records = extractRemark(context.extrinsic, context)
//   await mainFrame(records, context)
// }

// export async function handleBatchAll(context: Context): Promise<void> {
//   const records = extractRemark(context.extrinsic, context)
//   await mainFrame(records, context)
// }

async function mainFrame(remark: string, context: Context): Promise<void> {
    const base = unwrap(context, (_: Context) => ({ value: remark }))
    try {
      const { interaction: event } = unwrapRemark<RmrkInteraction>(remark.toString())
      logger.pending(`[${base.blockNumber}] Event ${event} `)

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
        `[MALFORMED] Block ${base.blockNumber},\nRMRK ${hexToString(base.value)}\n${(e as Error).message}`
      )
    }
  }

async function mint(context: Context): Promise<void> {
  let collection: Optional<Collection> = null
  try {
    const { value, caller, timestamp, blockNumber, version  } = unwrap(context, getCreateCollection);
    collection = value
    logger.pending(`[COLECTTION++]: ${blockNumber}`);
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
    // final.events = []
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

    // await logFail(JSON.stringify(collection), e.message, RmrkEvent.MINT)
  }
}

async function mintNFT(
  context: Context
): Promise<void> {
  let nft: Optional<NFT> = null
  try {
    const { value, caller, timestamp, blockNumber, version  } = unwrap(context, getCreateToken);
    nft = value
    plsBe(real, nft.collection)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(context.store, CollectionEntity, nft.collection)
    )
    plsBe(real, collection)
    isOwnerOrElseError(collection, caller)
    const final = create<NFTEntity>(NFTEntity, collection.id, {})
    const id = getNftId(nft, blockNumber)
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
    // final.events = [eventFrom(RmrkEvent.MINTNFT, remark, '')]

    const metadata = await handleMetadata(final.metadata, final.name, context.store)
    final.meta = metadata

    logger.success(`[MINT] ${final.id}`)
    await context.store.save(final)
    await createEvent(final, RmrkEvent.MINTNFT, { blockNumber, caller, timestamp }, '', context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.error(`[MINT] ${e.message}, ${JSON.stringify(nft)}`)
    )
    // await logFail(JSON.stringify(nft), e.message, RmrkEvent.MINTNFT)
  }
}

async function send(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version  } = unwrap(context, getInteraction);
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
    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.SEND)
  }
}

async function buy(remark: RemarkResult, { store }: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    interaction = ensureInteraction(
      NFTUtils.unwrap(remark.value) as RmrkInteraction
    )
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(store, NFTEntity, interaction.id)
    )
    isInteractive(nft)
    isPositiveOrElseError(nft.price, true)
    isBuyLegalOrElseError(nft, remark.extra || [])
    const originalPrice = nft.price
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = remark.caller
    nft.price = BigInt(0)
    nft.updatedAt = remark.timestamp

    logger.success(`[BUY] ${nft.id} from ${remark.caller}`)
    await store.save(nft)
    await createEvent(nft, RmrkEvent.BUY, remark, String(originalPrice), store, originalOwner)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[BUY] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function consume(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction);
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

    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.CONSUME)
  }
}

async function list(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction);
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

    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.LIST)
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
    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.CHANGEISSUER)
  }
}

async function emote(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction);
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
    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.EMOTE)
  }

  // exists
  // not burned
  // transferable
  // has meta
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

