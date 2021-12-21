import { BatchArg, RmrkInteraction } from './types'
import { CollectionEntity, NFTEntity } from '../../generated/model'
// import { decodeAddress } from '@polkadot/util-crypto'
type Entity = CollectionEntity | NFTEntity

export function exists<T>(entity: T | undefined): boolean {
  return !!entity
}

export function isBurned(nft: NFTEntity) {
  return nft.burned ?? false
}

export function isTransferable(nft: NFTEntity) {
  return !!nft.transferable
}

export function hasMeta(nft: RmrkInteraction): nft is RmrkInteraction  {
  return !!nft.metadata
}

export function isOwner(entity: Entity, caller: string) {
  return entity.currentOwner === caller
}

export function isIssuer(entity: Entity, caller: string) {
  return entity.issuer === caller
}


export function isOwnerOrElseError(entity: Entity, caller: string) {
  if (!isOwner(entity, caller)) {
    throw new ReferenceError(`[CONSOLIDATE Bad Owner] Entity: ${entity.issuer} Caller: ${caller}`)
  }
}

export function canOrElseError<T>(callback: (arg: T) => boolean, entity: T, negation?: boolean) {
  if (negation ? !callback(entity) : callback(entity)) {
    throw new ReferenceError(`[CONSOLIDATE canOrElseError] Callback${negation ? ' not' : ''} ${callback.name}`)
  }
}

export function validateInteraction(nft: NFTEntity, interaction: RmrkInteraction) {
  try {
    canOrElseError<RmrkInteraction>(hasMeta, interaction, true)
    canOrElseError<NFTEntity>(exists, nft, true)
    canOrElseError<NFTEntity>(isBurned, nft)
    canOrElseError<NFTEntity>(isTransferable, nft, true)
  } catch (e) {
    throw e
  }
}

export function isPositiveOrElseError(entity: bigint | number, excludeZero?: boolean): void {
  if (entity < Number(excludeZero)) {
    throw new ReferenceError(`[CONSOLIDATE isPositiveOrElseError] Entity: ${entity}`)
  }
}

export const isBalanceTransfer = ({ callIndex }: BatchArg): boolean => callIndex === '0x0400'
const canBuy = (nft: NFTEntity) => (call: BatchArg) => isBalanceTransfer(call) && isOwner(nft, call.args.dest.id) && BigInt(call.args.value) >= BigInt(nft.price ?? 0)

export function isBuyLegalOrElseError(entity: NFTEntity, extraCalls: BatchArg[]) {
  const result = extraCalls.some(canBuy(entity))
  if (!result) {
    throw new ReferenceError(`[CONSOLIDATE ILLEGAL BUY] Entity: ${entity.id} CALLS: ${JSON.stringify(extraCalls)}`)
  }
}

// TODO: Does not work :)
// export function isAccountValidOrElseError(caller: string) {
//   try {
//     decodeAddress(caller)
//   } catch (e) {
//     throw new ReferenceError(`[CONSOLIDATE Invalid account] ${caller}`)
//   }
// }
