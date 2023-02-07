import * as ss58 from '@subsquid/ss58'
import { assertNotNull, decodeHex } from '@subsquid/substrate-processor'
import { trim, trimAll } from '@vikiival/minimark/utils'
import { nanoid } from 'nanoid'
import { Action, ArchiveCallWithOptionalValue, RmrkInteraction } from './types'

export { isEmpty, trim, trimAll } from '@vikiival/minimark/utils'
export { toBaseId as baseId } from '@vikiival/minimark/v2'

export const SS58_REGEX = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{47}$/


export const emoteId = ({ id, value: metadata }: RmrkInteraction, caller: string) => `${id}-${metadata}-${caller}`

export const eventId = (id: string, event: Action) => `${id}-${event}${nanoid()}`

export const ensureInteraction = ({ id, value: metadata }: RmrkInteraction): RmrkInteraction  => ({ id: trim(id), value: trimAll(metadata) })

export function ensure<T>(value: any): T {
  return value as T
}

export function camelCase(str: string): string {
  return str.replace(/([_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('_', '')
  })
}

export function onlyValue(call: ArchiveCallWithOptionalValue): any {
  return call?.value
}

//Uint8Array 
export function addressOf(address: ArchiveCallWithOptionalValue | string): string {
  const value = typeof address === 'string' ? address : onlyValue(address)
  return ss58.codec('kusama').encode(decodeHex(value))
}

export function isAddress(address: string): boolean {
  try {
    ss58.codec('kusama').decode(address)
    return true
  } catch (e) {
    return false
  }
}

export function isDummyAddress(address?: string): boolean {
  assertNotNull(address)
  return SS58_REGEX.test(address as string)
}

export function metadataOf({ metadata }: { metadata: string }): string {
  return metadata ?? '';
}
