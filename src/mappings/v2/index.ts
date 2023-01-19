import { unwrapRemarkV2 as unwrapRemark } from '@vikiival/minimark/v2'
import { createCollection } from '../shared/create'
import { unwrap } from '../utils/extract'
import logger from '../utils/logger'
import { Context, Action, RmrkInteraction } from '../utils/types'

export async function mainFrame(remark: string, context: Context): Promise<void> {
  const base = unwrap(context, (_: Context) => ({ value: remark }))
  try {
    const { interaction: event, version } = unwrapRemark<RmrkInteraction<true>>(remark.toString())
    logger.pending(`[${event === Action.CREATE ? 'COLLECTION' : event}]: ${base.blockNumber}`)

    switch (event) {
      case Action.CREATE: // should be CRATE
        await createCollection(context)
        break
      case Action.MINT:
        logger.info(`[MINT]::${base.blockNumber}`)
        // await mintNFT(context)
        break
      case Action.SEND:
        logger.info(`[SEND]::${base.blockNumber}`)
        // await send(context)
        break
      case Action.BUY:
        logger.info(`[BUY]::${base.blockNumber}`)
        // await buy(context)
        break
      case Action.BURN:
        logger.info(`[BURN]::${base.blockNumber}`)
        // await consume(context)
        break
      case Action.LIST:
        logger.info(`[LIST]::${base.blockNumber}`)
        // await list(context)
        break
      case Action.CHANGEISSUER:
        logger.info(`[CHANGEISSUER]::${base.blockNumber}`)
        // await changeIssuer(context)
        break
      case Action.EMOTE:
        logger.info(`[EMOTE]::${base.blockNumber}`)
        // await emote(context)
        break
      default:
        logger.start(
          `[SKIP] ${event}::${base.value}::${base.blockNumber}`
        )
    }
  } catch (e) {
    logger.warn(
      `[MALFORMED]
       [BLOCK] ${base.blockNumber}
       [ERROR] ${(e as Error).message}
       [RMRK] ${base.value}`
    )
  }
}