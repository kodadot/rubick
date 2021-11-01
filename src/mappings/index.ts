import { DatabaseManager, EventContext, StoreContext } from '@subsquid/hydra-common'
import { Account, HistoricalBalance } from '../generated/model'
import { Balances } from '../types'


export async function balancesTransfer({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> {

  const [from, to, value] = new Balances.TransferEvent(event).params
  const tip = extrinsic?.tip || 0n

  const fromAcc = await getOrCreate(store, Account, from.toHex())
  fromAcc.wallet = from.toHuman()
  fromAcc.balance = fromAcc.balance || 0n
  fromAcc.balance -= value.toBigInt()
  fromAcc.balance -= tip
  await store.save(fromAcc)

  const toAcc = await getOrCreate(store, Account, to.toHex())
  toAcc.wallet = to.toHuman()
  toAcc.balance = toAcc.balance || 0n
  toAcc.balance += value.toBigInt()
  await store.save(toAcc)

  const hbFrom = new HistoricalBalance()
  hbFrom.account = fromAcc;
  hbFrom.balance = fromAcc.balance;
  hbFrom.timestamp = new Date(block.timestamp)
  await store.save(hbFrom)

  const hbTo = new HistoricalBalance()
  hbTo.account = toAcc;
  hbTo.balance = toAcc.balance;
  hbTo.timestamp = new Date(block.timestamp)
  await store.save(hbTo)
}


async function getOrCreate<T extends {id: string}>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> {

  let e = await store.get(entityConstructor, {
    where: { id },
  })

  if (e == null) {
    e = new entityConstructor()
    e.id = id
  }

  return e
}


type EntityConstructor<T> = {
  new (...args: any[]): T
}
