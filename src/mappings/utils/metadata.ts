
import { ensure } from '@kodadot1/metasquid'
import { $obtain } from '@kodadot1/minipfs';
import logger from './logger';


export const fetchMetadata = async <T>(metadata: string): Promise<T> => {
  try {
    if (!metadata) {
      return ensure<T>({});
    }
    return await $obtain<T>(metadata);
  } catch (e) {
    logger.warn('IPFS Err', e);
  }

  return ensure<T>({});
};