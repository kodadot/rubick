import * as ss58 from '@subsquid/ss58'
import { assertNotNull, decodeHex } from '@subsquid/substrate-processor'
import { trim, trimAll } from '@kodadot1/minimark/utils'
import { nanoid } from 'nanoid'
import { Action, ArchiveCallWithOptionalValue, RmrkInteraction, Store } from './types'

export { isEmpty, trim, trimAll } from '@kodadot1/minimark/utils'
export { toBaseId as baseId } from '@kodadot1/minimark/v2'

// Lenght is 47 or 48
export const SS58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{47}$/

export const emoteId = ({ id, value: metadata }: RmrkInteraction, caller: string) => `${id}-${metadata}-${caller}`

export const eventId = (id: string, event: Action) => `${id}-${event}${nanoid()}`

export const ensureInteraction = ({ id, value: metadata }: RmrkInteraction): RmrkInteraction => ({
  id: trim(id),
  value: trimAll(metadata),
})

export const collectionIdFrom = (nftId: string) => {
  const [_blockNumber, id, symbol] = nftId.split('-')
  return `${id}-${symbol}`
}

export function ensure<T>(value: any): T {
  return value as T
}

export function camelCase(str: string): string {
  return str.replace(/(_[a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('_', '')
  })
}

export function onlyValue(call: ArchiveCallWithOptionalValue): any {
  return call?.value
}

// Uint8Array
export function addressOf(address: ArchiveCallWithOptionalValue | string): string {
  const value = typeof address === 'string' ? address : onlyValue(address)
  return ss58.codec('kusama').encode(decodeHex(value))
}

export function isAddress(address: string): boolean {
  try {
    ss58.codec('kusama').decode(address)
    return true
  } catch {
    return false
  }
}

export function isDummyAddress(address?: string): boolean {
  assertNotNull(address)
  return SS58_REGEX.test(address as string)
}

// RMRK R&D team
export const isValidAddressPolkadotAddress = (address: string) => {
  return address && !address.includes('-')
}

export function metadataOf({ metadata }: { metadata: string }): string {
  return metadata ?? ''
}

export async function calculateCollectionOwnerCountAndDistribution(
  store: Store,
  collectionId: string,
  newOwner?: string,
  originalOwner?: string
): Promise<{ ownerCount: number; distribution: number }> {
  const safeCollectionId = collectionId.replace(/'/g, "''")
  let query: string = `
  SELECT COUNT(DISTINCT current_owner) AS distribution,
       COUNT(current_owner) AS owner_count
  ${
    newOwner &&
    `
  ,(SELECT max(CASE
                  WHEN current_owner = '${newOwner}' THEN 0
                  ELSE 1
              END)
   FROM nft_entity) AS adjustment
  `
  } 
  FROM nft_entity
  WHERE collection_id = '${safeCollectionId}'
  `

  if (originalOwner) {
    query += `AND current_owner != '${originalOwner}'`
  }

  const [result]: { owner_count: number; distribution: number; adjustment?: number }[] = await store.query(query)

  const adjustedResults = {
    ownerCount: result.owner_count - (result.adjustment ?? 0),
    distribution: result.distribution - (result.adjustment ?? 0),
  }

  return adjustedResults
}
