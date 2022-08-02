import { nanoid } from 'nanoid'
import { RmrkEvent, RmrkInteraction } from './types'
import * as ss58 from '@subsquid/ss58';
import { Chain, } from '@subsquid/substrate-processor/lib/chain'
import { Call } from '../../types/support'
import { encode } from '@subsquid/ss58'
import { decodeHex } from '@subsquid/substrate-processor'

export const trim = (text?: string) => (text || '').trim()

export const trimAll = (text?: string) => (text || '').replace(/\s/g, "")

export const emoteId = ({ id, metadata }: RmrkInteraction, caller: string) => `${id}-${metadata}-${caller}`

export const eventId = (id: string, event: RmrkEvent) => `${id}-${event}${nanoid()}`

export const ensureInteraction = ({ id, metadata }: RmrkInteraction): RmrkInteraction  => ({ id: trim(id), metadata: trimAll(metadata) })

export function ensure<T>(value: any): T {
  return value as T
}

export function camelCase(str: string): string {
  return str.replace(/([_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('_', '')
  })
}

export function isEmpty(obj: Record<string, any>) {
  for (const _ in obj) { return false; }
  return true;
}

export function addressOf(value: any): string {
  return value
  // return ss58.codec('kusama').encode(value)
  // return encode(decodeHex(value))
}

export function metadataOf({ metadata }: { metadata: string }): string {
  return metadata ?? '';
}
