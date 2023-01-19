
import { unwrapRemark } from '@vikiival/minimark/v1'
import { unwrap } from '../utils'
import { updateCache } from '../utils/cache'

import { burn as consume, buy, changeIssuer, createCollection, emote, list, send } from '../shared'
import logger from '../utils/logger'
import {
  Context,
  RmrkInteraction
} from '../utils/types'
import { mintNFT } from './mint'
import { Interaction } from '@vikiival/minimark/v1'


export async function mainFrame(remark: string, context: Context): Promise<void> {
    const base = unwrap(context, (_: Context) => ({ value: remark }))
    try {
      const { interaction: event, version } = unwrapRemark<RmrkInteraction>(remark.toString())
      logger.pending(`[${event === Interaction.MINT ? 'COLLECTION' : event}]: ${base.blockNumber}`)

      if (version === '2.0.0') {
        logger.star(`[RMRK::2.0.0] is not supported, please help us to make it awesome ${remark}`)
        return;
      }

      switch (event) {
        case Interaction.MINT:
          await createCollection(context)
          break
        case Interaction.MINTNFT:
          await mintNFT(context)
          break
        case Interaction.SEND:
          await send(context)
          break
        case Interaction.BUY:
          await buy(context)
          break
        case Interaction.CONSUME:
          await consume(context)
          break
        case Interaction.LIST:
          await list(context)
          break
        case Interaction.CHANGEISSUER:
          await changeIssuer(context)
          break
        case Interaction.EMOTE:
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



