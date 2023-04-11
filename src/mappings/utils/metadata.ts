import { ensure } from '@kodadot1/metasquid'
import { TokenMetadata } from '@kodadot1/metasquid/types'
import { $obtain } from '@kodadot1/minipfs'
import { MetadataEntity } from '../../model'
import { EntityWithId } from './entity'
import logger from './logger'
import { attributeFrom } from './types'
export const BASE_URL = 'https://image.w.kodadot.xyz/'

export const fetchMetadata = async <T>(metadata: string): Promise<T> => {
  try {
    if (!metadata) {
      return ensure<T>({})
    }
    return await $obtain<T>(metadata, ['rmrk', 'infura_kodadot1'], true)
  } catch (e) {
    logger.error(`[MINIPFS] ${e}}`)
  }

  return ensure<T>({})
}

export const fetchAllMetadata = async <T extends TokenMetadata>(
  metadata: string[]
): Promise<(Partial<MetadataEntity> & EntityWithId)[]> => {
  const res = await Promise.allSettled(metadata.map((meta) => fetchMetadata<T>(meta)))
  const fulfilled = res
    .map((result, index) => ({ ...result, id: metadata[index] }))
    .filter((r) => r.status === 'fulfilled') as (PromiseFulfilledResult<T> & EntityWithId)[]
  return fulfilled.map(({ value, id }) => makeCompatibleMetadata(id, value))
}

export const makeCompatibleMetadata = (
  id: string,
  metadata: TokenMetadata
): Partial<MetadataEntity> & EntityWithId => ({
  id,
  description: metadata.description || '',
  image: metadata.image || metadata.thumbnailUri || metadata.mediaUri,
  animationUrl: metadata.animation_url || metadata.mediaUri,
  attributes: metadata.attributes?.map(attributeFrom) || [],
  name: metadata.name,
  type: metadata.type || '',
})
