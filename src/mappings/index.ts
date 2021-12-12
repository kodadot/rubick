import { CollectionEntity, NFTEntity } from '../generated/model'

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
import { emoteId, ensureInteraction } from './utils/helper'
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
          // await mintNFT(remark)
          break
        case RmrkEvent.SEND:
          // await send(remark)
          break
        case RmrkEvent.BUY:
          // await buy(remark)
          break
        case RmrkEvent.CONSUME:
          // await consume(remark)
          break
        case RmrkEvent.LIST:
          // await list(remark)
          break
        case RmrkEvent.CHANGEISSUER:
          // await changeIssuer(remark)
          break
        case RmrkEvent.EMOTE:
          // await emote(remark)
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
    const entity = await get<CollectionEntity>(store, CollectionEntity, collection.id)
    canOrElseError<CollectionEntity>(exists, entity as CollectionEntity)
    
    const final = create<CollectionEntity>(CollectionEntity, collection.id, {})
    
    final.name = collection.name.trim()
    final.max = Number(collection.max)
    final.issuer = remark.caller
    final.currentOwner = remark.caller
    final.symbol = collection.symbol.trim()
    final.blockNumber = BigInt(remark.blockNumber)
    final.metadata = collection.metadata
    final.events = [eventFrom(RmrkEvent.MINT, remark, '')]

    logger.info(`Processed [COLLECTION] ${final.id}`)
    // await store.save(final) 
    
  } catch (e) {
    logError(e, (e) => logger.error(`[COLLECTION] ${e.message}, ${JSON.stringify(collection)}`))
    
    // await logFail(JSON.stringify(collection), e.message, RmrkEvent.MINT)
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

type EntityConstructor<T> = {
  new (...args: any[]): T
}
