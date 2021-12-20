import { CollectionEntity, Emote, NFTEntity } from '../generated/model'

import { extractRemark, Records, RemarkResult } from './utils'
import {
  Collection,
  eventFrom,
  getNftId,
  NFT,
  Optional,
  RmrkEvent,
  RmrkInteraction,
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
import { randomBytes } from 'crypto'
import { emoteId, ensure, ensureInteraction } from './utils/helper'
import { System, Utility } from '../types'
import { Context } from './utils/types'
import logger, { logError } from './utils/logger'
import { create, get } from './utils/entity'

export function handleRemark(context: Context): void {
  const remark = new System.RemarkCall(context.extrinsic).remark
  const records = extractRemark(remark.toString(), context)
  mainFrame(records, context)
}

export function handleBatch(context: Context): void {
  const batch = new Utility.BatchCall(context.extrinsic).calls
  const records = extractRemark(batch.toString(), context)
  mainFrame(records, context)
}

export function handleBatchAll(context: Context): void {
  const batch = new Utility.Batch_allCall(context.extrinsic).calls
  const records = extractRemark(batch, context)
  mainFrame(records, context)
}

async function mainFrame(records: Records, context: Context): Promise<void> {
  for (const remark of records) {
    console.log(`Handling remark ${remark.value} ${remark.blockNumber}`)
    try {
      const decoded = hexToString(remark.value)
      const event: RmrkEvent = NFTUtils.getAction(decoded)
      console.log(`Handling event ${event}`)

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
          // await buy(remark, context, records)
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
        // logger.warn(`[SKIP] ${event}::${remark.value}::${remark.blockNumber}`)
        // throw new EvalError(`Unable to evaluate following string, ${event}::${remark.value}`)
      }
    } catch (e) {
      // logger.error(`[MALFORMED] ${remark.blockNumber}::${hexToString(remark.value)}`)
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
    final.events = [eventFrom(RmrkEvent.MINT, remark, '')]

    logger.info(`Processed [COLLECTION] ${final.id}`)
    // await store.save(final)
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
    final.events = [eventFrom(RmrkEvent.MINTNFT, remark, '')]

    logger.info(`SAVED [MINT] ${final.id}`)
    // await store.save(final)
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
    nft.events?.push(
      eventFrom(RmrkEvent.SEND, remark, interaction.metadata || '')
    )

    // await store.save(nft)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[SEND] ${e.message} ${JSON.stringify(interaction)}`)
    )
    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.SEND)
  }
}

async function consume(remark: RemarkResult,  { store }: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    interaction = ensureInteraction(NFTUtils.unwrap(remark.value) as RmrkInteraction)
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(store, NFTEntity, interaction.id)
    )
    canOrElseError<NFTEntity>(exists, nft, true)
    canOrElseError<NFTEntity>(isBurned, nft)
    isOwnerOrElseError(nft, remark.caller)
    nft.price = BigInt(0)
    nft.burned = true;
    nft.events?.push(eventFrom(RmrkEvent.CONSUME, remark, ''))
    // await store.save(nft)

  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CONSUME] ${e.message} ${JSON.stringify(interaction)}`)
    )

    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.CONSUME)
  }
}

async function list(remark: RemarkResult,  { store }: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    interaction = ensureInteraction(NFTUtils.unwrap(remark.value) as RmrkInteraction)
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(store, NFTEntity, interaction.id)
    )
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, remark.caller)
    const price = BigInt(interaction.metadata || '0')
    isPositiveOrElseError(price)
    nft.price = price
    nft.events?.push(eventFrom(RmrkEvent.LIST, remark, interaction.metadata || ''))
    // await store.save(nft)

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
    interaction = ensureInteraction(NFTUtils.unwrap(remark.value) as RmrkInteraction)
    canOrElseError<RmrkInteraction>(hasMeta, interaction, true)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(store, CollectionEntity, interaction.id)
    )
    canOrElseError<CollectionEntity>(exists, collection, true)
    isOwnerOrElseError(collection, remark.caller)
    collection.currentOwner = interaction.metadata
    collection.events?.push(eventFrom(RmrkEvent.CHANGEISSUER, remark, ensure<string>(interaction.metadata)))
    // await store.save(collection)
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
    interaction = ensureInteraction(NFTUtils.unwrap(remark.value) as RmrkInteraction)
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
      return;
    }
    
    // emote = create<Emote>(Emote, id, {
    //   id,
    //   nftId: interaction.id || '',
    //   caller: remark.caller,
    //   value: interaction.metadata
    // })


    // await store.save(emote)

  } catch (e) {
    logError(e, (e) =>
    logger.warn(`[EMOTE] ${e.message}`)
    )
    // await logFail(JSON.stringify(interaction), e.message, RmrkEvent.EMOTE)
  }

  // exists
  // not burned
  // transferable
  // has meta
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
