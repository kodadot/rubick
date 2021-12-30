import { nanoid } from 'nanoid'
import { RmrkEvent, RmrkInteraction } from './types'

export const trim = (text?: string) => (text || '').trim()

export const trimAll = (text?: string) => (text || '').replace(/\s/g, "")

export const emoteId = ({ id, metadata }: RmrkInteraction, caller: string) => `${id}-${metadata}-${caller}`

export const eventId = (id: string, event: RmrkEvent) => `${id}-${event}${nanoid()}`

export const ensureInteraction = ({ id, metadata }: RmrkInteraction): RmrkInteraction  => ({ id: trim(id), metadata: trimAll(metadata) })

export function ensure<T>(value: any): T {
  return value as T
}

export function isEmpty(obj: Record<string, any>) {
  for (const _ in obj) { return false; }
  return true;
}