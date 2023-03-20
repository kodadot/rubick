import { serializer } from '@kodadot1/metasquid'
import { logger } from '@kodadot1/metasquid/logger'
import { Action } from '../utils/types'

type ErrorCallback = (error: Error) => void;

export const logError = (e: Error | unknown, cb: ErrorCallback) => {
  if (e instanceof Error) {
    cb(e);
  }
}

export const success = (action: Action, message: string) => {
  logger.info(`[${action}] ${message}`)
}

export const error = (e: Error, action: Action, message: string) => {
  logError(e, (e) => logger.error(`[${action}] ${e.message} ${message}`))
}

export const debug = (action: Action, message: Record<any, any>, serialize?: boolean) => {
  logger.debug(`[${action}] ${JSON.stringify(message, serialize ?  serializer : undefined, 2)}`)
}

export default logger