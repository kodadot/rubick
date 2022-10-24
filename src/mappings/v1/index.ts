
import { unwrapRemark } from '@kodadot1/minimark'
import { unwrap } from '../utils'
import { updateCache } from '../utils/cache'

import { burn as consume, buy, changeIssuer, createCollection, emote, list, send } from '../shared'
import logger from '../utils/logger'
import {
  Context, RmrkEvent,
  RmrkInteraction
} from '../utils/types'
import { mintNFT } from './mint'


export async function mainFrame(remark: string, context: Context): Promise<void> {
    const base = unwrap(context, (_: Context) => ({ value: remark }))
    try {
      const { interaction: event, version } = unwrapRemark<RmrkInteraction>(remark.toString())
      logger.pending(`[${event === RmrkEvent.MINT ? 'COLLECTION' : event}]: ${base.blockNumber}`)

      if (version === '2.0.0') {
        logger.star(`[RMRK::2.0.0] is not supported, please help us to make it awesome ${remark}`)
        return;
      }

      switch (event) {
        case RmrkEvent.MINT:
          await createCollection(context)
          break
        case RmrkEvent.MINTNFT:
          await mintNFT(context)
          break
        case RmrkEvent.SEND:
          await send(context)
          break
        case RmrkEvent.BUY:
          await buy(context)
          break
        case RmrkEvent.CONSUME:
          await consume(context)
          break
        case RmrkEvent.LIST:
          await list(context)
          break
        case RmrkEvent.CHANGEISSUER:
          await changeIssuer(context)
          break
        case RmrkEvent.EMOTE:
          await emote(context)
          break
        default:
          logger.start(
            `[SKIP] ${event}::${base.value}::${base.blockNumber}`
          )
      }
      await updateCache(base.timestamp,context.store)
    } catch (e) {
      logger.warn(
        `[MALFORMED]
         [BLOCK] ${base.blockNumber}
         [ERROR] ${(e as Error).message}
         [RMRK] ${base.value}`
      )
    }
  }



