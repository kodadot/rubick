import { unwrapRemarkV2 as unwrapRemark, Interaction } from '@vikiival/minimark/v2'
import { createCollection } from '../shared/create'
import { unwrap } from '../utils/extract'
import logger from '../utils/logger'
import { Context, Action, RmrkInteraction } from '../utils/types'

export async function mainFrame(remark: string, context: Context): Promise<void> {
  const base = unwrap(context, (_: Context) => ({ value: remark }))
  try {
    const { interaction: event, version } = unwrapRemark<RmrkInteraction<true>>(remark.toString())
    logger.pending(`[${event === Interaction.CREATE ? 'COLLECTION' : event}]: ${base.blockNumber}`)

    switch (event) {
      case Interaction.CREATE: // should be CRATE
        await createCollection(context)
        break
      case Interaction.MINT:
        logger.info(`[MINT]::${base.blockNumber}`)
        // await mintNFT(context)
        break
      case Interaction.SEND:
        logger.info(`[SEND]::${base.blockNumber}`)
        // await send(context)
        break
      case Interaction.BUY:
        logger.info(`[BUY]::${base.blockNumber}`)
        // await buy(context)
        break
      case Interaction.BURN:
        logger.info(`[BURN]::${base.blockNumber}`)
        // await consume(context)
        break
      case Interaction.LIST:
        logger.info(`[LIST]::${base.blockNumber}`)
        // await list(context)
        break
      case Interaction.CHANGEISSUER:
        logger.info(`[CHANGEISSUER]::${base.blockNumber}`)
        // await changeIssuer(context)
        break
      case Interaction.EMOTE:
        logger.info(`[EMOTE]::${base.blockNumber}`)
        // await emote(context)
        break
      // RMRK v2.0.0
      case Interaction.ACCEPT:
        logger.info(`[ACCEPT]::${base.blockNumber}`)
        break
      case Interaction.BASE:
        logger.info(`[BASE]::${base.blockNumber}`)
        break
      case Interaction.DESTROY:
        logger.info(`[DESTROY]::${base.blockNumber}`)
        break
      case Interaction.SETPRIORITY:
        logger.info(`[SETPRIORITY]::${base.blockNumber}`)
        break
      case Interaction.SETPROPERTY:
        logger.info(`[SETPROPERTY]::${base.blockNumber}`)
        break
      case Interaction.THEMEADD:
        logger.info(`[THEMEADD]::${base.blockNumber}`)
        break
      case Interaction.RESADD:
        logger.info(`[RESADD]::${base.blockNumber}`)
        break
      case Interaction.EQUIP:
        logger.info(`[EQUIP]::${base.blockNumber}`)
        break
      case Interaction.EQUIPPABLE:
        logger.info(`[EQUIPPABLE]::${base.blockNumber}`)
        break
      case Interaction.LOCK:
        logger.info(`[LOCK]::${base.blockNumber}`)
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