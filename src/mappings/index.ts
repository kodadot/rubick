import {
  CollectionEntity,
  Emote,
  MetadataEntity as Metadata,
  NFTEntity,
  Event,
} from '../generated/model'

import { extractRemark, Records, RemarkResult } from './utils'
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
} from './utils/types'
import NFTUtils, { hexToString } from './utils/NftUtils'
import {
  canOrElseError,
  exists,
  hasMeta,
  isBurned,
  isBuyLegalOrElseError,
  isOwnerOrElseError,
  isPositiveOrElseError,
  isTransferable,
  validateInteraction,
} from './utils/consolidator'
import { emoteId, ensure, ensureInteraction, isEmpty, eventId } from './utils/helper'
import { System } from '../types'
import { Context } from './utils/types'
import logger, { logError } from './utils/logger'
import { create, get } from './utils/entity'
import { fetchMetadata } from './utils/metadata'
import { DatabaseManager } from '@subsquid/hydra-common'

export async function handleRemark(context: Context): Promise<void> {
  const remark = new System.RemarkCall(context.extrinsic).remark
  const records = extractRemark(remark.toString(), context)
  await mainFrame(records, context)
}

export async function handleBatch(context: Context): Promise<void> {
  const records = extractRemark(context.extrinsic, context)
  await mainFrame(records, context)
}

export async function handleBatchAll(context: Context): Promise<void> {
  const records = extractRemark(context.extrinsic, context)
  await mainFrame(records, context)
}

async function mainFrame(records: Records, context: Context): Promise<void> {
  for (const remark of records) {
    try {
      const decoded = hexToString(remark.value)
      const event: RmrkEvent = NFTUtils.getAction(decoded)
      logger.pending(`[${remark.blockNumber}] Event ${event} `)

      switch (event) {
        case RmrkEvent.MINT:
          await mint(remark, context)
          break
        case RmrkEvent.MINTNFT:
          await mintNFT(remark, context)
          break
        case RmrkEvent.SEND:
          await send(remark, context)
          break
        case RmrkEvent.BUY:
          await buy(remark, context)
          break
        case RmrkEvent.CONSUME:
          await consume(remark, context)
          break
        case RmrkEvent.LIST:
          await list(remark, context)
          break
        case RmrkEvent.CHANGEISSUER:
          await changeIssuer(remark, context)
          break
        case RmrkEvent.EMOTE:
          await emote(remark, context)
          break
        default:
          logger.error(
            `[SKIP] ${event}::${remark.value}::${remark.blockNumber}`
          )
      }
    } catch (e) {
      logger.warn(
        `[MALFORMED] ${remark.blockNumber}::${hexToString(remark.value)}`
      )
    }
  }
}

async function mint(remark: RemarkResult, { store }: Context): Promise<void> {
  let collection: Optional<Collection> = null
  try {
    collection = NFTUtils.unwrap(remark.value) as Collection
    canOrElseError<string>(exists, collection.id, true)
    const entity = await get<CollectionEntity>(
      store,
      CollectionEntity,
      collection.id
    )
    canOrElseError<CollectionEntity>(exists, entity as CollectionEntity)

    const final = create<CollectionEntity>(CollectionEntity, collection.id, {})

    final.name = collection.name.trim()
    final.max = Number(collection.max) || 0
    final.issuer = remark.caller
    final.currentOwner = remark.caller
    final.symbol = collection.symbol.trim()
    final.blockNumber = BigInt(remark.blockNumber)
    final.metadata = collection.metadata
    final.createdAt = remark.timestamp
    // final.events = []
    final.events = [collectionEventFrom(RmrkEvent.MINT, remark, '')]

    // logger.watch(`[MINT] ${final.events[0]}`)

    const metadata = await handleMetadata(final.metadata, final.name, store)
    final.meta = metadata

    logger.success(`[COLLECTION] ${final.id}`)
    await store.save(final)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[COLLECTION] ${e.message}, ${JSON.stringify(collection)}`)
    )

    // await logFail(JSON.stringify(collection), e.message, RmrkEvent.MINT)
  }
}

async function mintNFT(
  remark: RemarkResult,
  { store }: Context
): Promise<void> {
  let nft: Optional<NFT> = null
  try {
    nft = NFTUtils.unwrap(remark.value) as NFT
    canOrElseError<string>(exists, nft.collection, true)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(store, CollectionEntity, nft.collection)
    )
    canOrElseError<CollectionEntity>(exists, collection, true)
    isOwnerOrElseError(collection, remark.caller)
    const final = create<NFTEntity>(NFTEntity, collection.id, {})

    final.id = getNftId(nft, remark.blockNumber)
    final.issuer = remark.caller
    final.currentOwner = remark.caller
    final.blockNumber = BigInt(remark.blockNumber)
    final.name = nft.name
    final.instance = nft.instance
    final.transferable = nft.transferable
    final.collection = collection
    final.sn = nft.sn
    final.metadata = nft.metadata
    final.price = BigInt(0)
    final.burned = false
    final.createdAt = remark.timestamp
    final.updatedAt = remark.timestamp
    // final.events = [eventFrom(RmrkEvent.MINTNFT, remark, '')]

    const metadata = await handleMetadata(final.metadata, final.name, store)
    final.meta = metadata

    logger.success(`[MINT] ${final.id}`)
    await store.save(final)
    await createEvent(final, RmrkEvent.MINTNFT, remark, '', store)

  } catch (e) {
    logError(e, (e) =>
      logger.error(`[MINT] ${e.message}, ${JSON.stringify(nft)}`)
    )
    // await logFail(JSON.stringify(nft), e.message, RmrkEvent.MINTNFT)
  }
}

async function send(remark: RemarkResult, { store }: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    interaction = ensureInteraction(
      NFTUtils.unwrap(remark.value) as RmrkInteraction
    )

    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(store, NFTEntity, interaction.id)
    )
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, remark.caller)

    nft.currentOwner = interaction.metadata
    nft.price = BigInt(0)
    nft.updatedAt = remark.timestamp

    logger.success(`[SEND] ${nft.id} to ${interaction.metadata}`)
    await store.save(nft)
    await createEvent(nft, RmrkEvent.SEND, remark, interaction.metadata || '', store)
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
    canOrElseError<NFTEntity>(exists, nft, true)
    canOrElseError<NFTEntity>(isBurned, nft)
    canOrElseError<NFTEntity>(isTransferable, nft, true)
    isPositiveOrElseError(nft.price, true)
    isBuyLegalOrElseError(nft, remark.extra || [])
    const originalPrice = nft.price
    nft.currentOwner = remark.caller
    nft.price = BigInt(0)
    nft.updatedAt = remark.timestamp

    logger.success(`[BUY] ${nft.id} from ${remark.caller}`)
    await store.save(nft)
    await createEvent(nft, RmrkEvent.BUY, remark, String(originalPrice), store)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[BUY] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function consume(remark: RemarkResult, { store }: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    interaction = ensureInteraction(
      NFTUtils.unwrap(remark.value) as RmrkInteraction
    )
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(store, NFTEntity, interaction.id)
    )
    canOrElseError<NFTEntity>(exists, nft, true)
    canOrElseError<NFTEntity>(isBurned, nft)
    isOwnerOrElseError(nft, remark.caller)
    nft.price = BigInt(0)
    nft.burned = true
    nft.updatedAt = remark.timestamp

    logger.success(`[CONSUME] ${nft.id} from ${remark.caller}`)
    await store.save(nft)
    await createEvent(nft, RmrkEvent.CONSUME, remark, '', store)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CONSUME] ${e.message} ${JSON.stringify(interaction)}`)
    )

    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.CONSUME)
  }
}

async function list(remark: RemarkResult, { store }: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    interaction = ensureInteraction(
      NFTUtils.unwrap(remark.value) as RmrkInteraction
    )
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(store, NFTEntity, interaction.id)
    )
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, remark.caller)
    const price = BigInt(interaction.metadata || '0')
    isPositiveOrElseError(price)
    nft.price = price
    nft.updatedAt = remark.timestamp

    logger.success(`[LIST] ${nft.id} from ${remark.caller}`)
    await store.save(nft)
    await createEvent(nft, RmrkEvent.LIST, remark, String(price), store)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[LIST] ${e.message} ${JSON.stringify(interaction)}`)
    )

    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.LIST)
  }
}

async function changeIssuer(remark: RemarkResult, { store }: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    interaction = ensureInteraction(
      NFTUtils.unwrap(remark.value) as RmrkInteraction
    )
    canOrElseError<RmrkInteraction>(hasMeta, interaction, true)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(store, CollectionEntity, interaction.id)
    )
    canOrElseError<CollectionEntity>(exists, collection, true)
    isOwnerOrElseError(collection, remark.caller)
    collection.currentOwner = interaction.metadata
    collection.events?.push(
      collectionEventFrom(
        RmrkEvent.CHANGEISSUER,
        remark,
        ensure<string>(interaction.metadata)
      )
    )

    logger.success(`[CHANGEISSUER] ${collection.id} from ${remark.caller}`)
    await store.save(collection)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CHANGEISSUER] ${e.message} ${JSON.stringify(interaction)}`)
    )
    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.CHANGEISSUER)
  }
}

async function emote(remark: RemarkResult, { store }: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    interaction = ensureInteraction(
      NFTUtils.unwrap(remark.value) as RmrkInteraction
    )
    canOrElseError<RmrkInteraction>(hasMeta, interaction, true)
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(store, NFTEntity, interaction.id)
    )
    canOrElseError<NFTEntity>(exists, nft, true)
    canOrElseError<NFTEntity>(isBurned, nft)
    const id = emoteId(interaction, remark.caller)
    let emote = await get<Emote>(store, Emote, interaction.id)

    if (emote) {
      await store.remove(emote)
      return
    }

    emote = create<Emote>(Emote, id, {
      id,
      caller: remark.caller,
      value: interaction.metadata,
    })

    emote.nft = nft

    logger.success(`[EMOTE] ${nft.id} from ${remark.caller}`)
    await store.save(emote)
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
  store: DatabaseManager
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


async function createEvent(final: NFTEntity, interaction: RmrkEvent, remark: RemarkResult, meta: string, store: DatabaseManager) {
  try {
    const newEventId = eventId(final.id, interaction)
    const event = create<Event>(Event, newEventId, eventFrom(interaction, remark, meta))
    event.nft = final
    await store.save(event)
  } catch (e) {
    logError(e, (e) => logger.warn(`[[${interaction}]]: ${final.id} Reason: ${e.message}`))
  }
  
}
// export async function balancesTransfer({
//   store,
//   event,
//   block,
//   extrinsic,
// }: EventContext & StoreContext): void {

//   const [from, to, value] = new Balances.TransferEvent(event).params
//   const tip = extrinsic?.tip || 0n

//   const fromAcc = await getOrCreate(store, Account, from.toHex())
//   fromAcc.wallet = from.toHuman()
//   fromAcc.balance = fromAcc.balance || 0n
//   fromAcc.balance -= value.toBigInt()
//   fromAcc.balance -= tip
//   await store.save(fromAcc)

//   const toAcc = await getOrCreate(store, Account, to.toHex())
//   toAcc.wallet = to.toHuman()
//   toAcc.balance = toAcc.balance || 0n
//   toAcc.balance += value.toBigInt()
//   await store.save(toAcc)

//   const hbFrom = new HistoricalBalance()
//   hbFrom.account = fromAcc;
//   hbFrom.balance = fromAcc.balance;
//   hbFrom.timestamp = new Date(block.timestamp)
//   await store.save(hbFrom)

//   const hbTo = new HistoricalBalance()
//   hbTo.account = toAcc;
//   hbTo.balance = toAcc.balance;
//   hbTo.timestamp = new Date(block.timestamp)
//   await store.save(hbTo)
// }

// async function getOrCreate<T extends {id: string}>(
//   store: DatabaseManager,
//   entityConstructor: EntityConstructor<T>,
//   id: string
// ): Promise<T> {

//   let e = await store.get(entityConstructor, {
//     where: { id },
//   })

//   if (e == null) {
//     e = new entityConstructor()
//     e.id = id
//   }

//   return e
// }
