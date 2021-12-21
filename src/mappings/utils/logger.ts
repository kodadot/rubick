import singale from 'signale'

type ErrorCallback = (error: Error) => void;

export const logError = (e: Error | unknown, cb: ErrorCallback) => {
  if (e instanceof Error) {
    cb(e);
  }
}

export default singale