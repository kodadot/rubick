import * as ss58 from '@subsquid/ss58'
import { decodeHex } from '@subsquid/substrate-processor'
import { nanoid } from 'nanoid'
import { ArchiveCallWithOptionalValue, RmrkEvent, RmrkInteraction } from './types'
export { isEmpty } from '@kodadot1/minimark'

export const trim = (text?: string) => (text || '').trim()

export const trimAll = (text?: string) => (text || '').replace(/\s/g, "")

export const emoteId = ({ id, value: metadata }: RmrkInteraction, caller: string) => `${id}-${metadata}-${caller}`

export const eventId = (id: string, event: RmrkEvent) => `${id}-${event}${nanoid()}`

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

export function metadataOf({ metadata }: { metadata: string }): string {
  return metadata ?? '';
}
