import { Interaction, unwrapRemark } from '@kodadot1/minimark/v1'
import { unwrap } from '../utils'

import { burn as consume, list } from '../shared'
import logger, { pending } from '../utils/logger'
import { Context, RmrkInteraction } from '../utils/types'
import { buy } from './buy'
import { changeIssuer } from './change'
import { createCollection } from './create'
import { emote } from './emote'
import { mintItem } from './mint'
import { send } from './send'

export async function mainFrame(remark: string, context: Context): Promise<void> {
  const base = unwrap(context, (_: Context) => ({ value: remark }))
  try {
    const { interaction: event, version } = unwrapRemark<RmrkInteraction>(remark.toString())
    pending(event, base.blockNumber)

    if (version === '2.0.0') {
      logger.error(`[RMRK::2.0.0] should be handled by different handler ${remark}`)
      return
    }

    switch (event) {
      case Interaction.MINT:
        await createCollection(context)
        break
      case Interaction.MINTNFT:
        await mintItem(context)
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
        logger.warn(`[SKIP] ${event}::${base.value}::${base.blockNumber}`)
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
