import { CollectionEntity, NFTEntity } from '../generated/model'

import { extractRemark, Records } from './utils'
import {
  Collection,
  eventFrom,
  getNftId,
  NFT,
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

export function handleRemark(context: Context): void {
  const remark = new System.RemarkCall(context.extrinsic).remark
  const records = extractRemark(remark.toString(), context)
  mainFrame(records)
}

export function handleBatch(context: Context): void {
  const batch = new Utility.BatchCall(context.extrinsic).calls
  const records = extractRemark(batch.toString(), context)
  mainFrame(records)
}

export function handleBatchAll(context: Context): void {
  const batch = new Utility.Batch_allCall(context.extrinsic).calls
  const records = extractRemark(batch, context)
  mainFrame(records)
}

async function mainFrame(records: Records): Promise<void> {
  for (const remark of records) {
    console.log(`Handling remark ${remark.value} ${remark.blockNumber}`)
    try {
      const decoded = hexToString(remark.value)
      const event: RmrkEvent = NFTUtils.getAction(decoded)

      switch (event) {
        case RmrkEvent.MINT:
          // await mint(remark)
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
