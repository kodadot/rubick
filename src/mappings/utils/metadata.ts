import Axios from 'axios'
import { ensure } from './helper'
import logger from './logger'
import { SanitizerFunc, SomethingWithMeta } from './types'

export const BASE_URL = 'https://kodadot.mypinata.cloud/'

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

export const sanitizeIpfsUrl = (ipfsUrl: string): string => {

  const rr = /^ipfs:\/\/ipfs/
  if (rr.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', BASE_URL)
  }

  const r = /^ipfs:\/\//
  if (r.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', `${BASE_URL}ipfs/`)
  }

  return ipfsUrl
}

export const fetchMetadata = async <T>(
  rmrk: SomethingWithMeta,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl
): Promise<T> => {
  try {
    if (!rmrk.metadata) {
      return ensure<T>({})
    }

    const { status, data } = await api.get(sanitizer(rmrk.metadata))
    logger.watch('[IPFS]', status, rmrk.metadata)
    if (status < 400) {
      return data as T
    }
  } catch (e) {
    logger.warn('IPFS Err', e)
  }

  return ensure<T>({})
}

export const fetchMimeType = async (ipfsLink?: string, sanitizer: SanitizerFunc = sanitizeIpfsUrl): Promise<string | undefined> => {
  if (!ipfsLink) {
    return undefined
  }

  const assetUrl = sanitizer(ipfsLink)

  try {
    const { headers } = await api.head(assetUrl)
    return headers['content-type']
  } catch (e: any) {
    logger.warn(`[MIME TYPE] Unable to access type of ${assetUrl}\n\nReason ${e.message}`)
    return undefined
  }
}


export default api