import { RmrkInteraction } from './types'

export const trim = (text?: string) => (text || '').trim()

export const trimAll = (text?: string) => (text || '').replace(/\s/g, "")

export const emoteId = ({ id, metadata }: RmrkInteraction, caller: string) => `${id}-${metadata}-${caller}`

export const ensureInteraction = ({ id, metadata }: RmrkInteraction): RmrkInteraction  => ({ id: trim(id), metadata: trimAll(metadata) })