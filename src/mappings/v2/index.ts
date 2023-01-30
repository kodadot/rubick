import { unwrapRemarkV2 as unwrapRemark, Interaction } from '@vikiival/minimark/v2'
import { createCollection } from '../shared/create'
import { unwrap } from '../utils/extract'
import logger from '../utils/logger'
import { Context, Action, RmrkInteraction } from '../utils/types'
import { mintItem } from '../shared/mint'
import { send } from '../shared/send'

export async function mainFrame(remark: string, context: Context): Promise<void> {
  const base = unwrap(context, (_: Context) => ({ value: remark }))
  try {
    const { interaction: event } = unwrapRemark(remark.toString())
    logger.start(`[${event === Interaction.CREATE ? 'COLLECTION' : event}]: ${base.blockNumber}`)

    switch (event) {
      case Interaction.CREATE: // should be CRATE
        await createCollection(context)
        break
      case Interaction.MINT:
        logger.info(`[MINT]::${base.blockNumber}::${base.value}`)
        await mintItem(context)
        break
      case Interaction.SEND:
        logger.info(`[SEND]::${base.blockNumber}::${base.value}`)
        await send(context)
        break
      case Interaction.BUY:
        logger.info(`[BUY]::${base.blockNumber}::${base.value}`)
        // await buy(context)
        break
      case Interaction.BURN:
        logger.info(`[BURN]::${base.blockNumber}::${base.value}`)
        // await consume(context)
        break
      case Interaction.LIST:
        logger.info(`[LIST]::${base.blockNumber}::${base.value}`)
        // await list(context)
        break
      case Interaction.CHANGEISSUER:
        logger.info(`[CHANGEISSUER]::${base.blockNumber}::${base.value}`)
        // await changeIssuer(context)
        break
      case Interaction.EMOTE:
        logger.info(`[EMOTE]::${base.blockNumber}::${base.value}`)
        // await emote(context)
        break
      // RMRK v2.0.0
      case Interaction.ACCEPT:
        logger.info(`[ACCEPT]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.BASE:
        logger.info(`[BASE]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.DESTROY:
        logger.info(`[DESTROY]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.SETPRIORITY:
        logger.info(`[SETPRIORITY]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.SETPROPERTY:
        logger.info(`[SETPROPERTY]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.THEMEADD:
        logger.info(`[THEMEADD]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.RESADD:
        logger.info(`[RESADD]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.EQUIP:
        logger.info(`[EQUIP]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.EQUIPPABLE:
        logger.info(`[EQUIPPABLE]::${base.blockNumber}::${base.value}`)
        break
      case Interaction.LOCK:
        logger.info(`[LOCK]::${base.blockNumber}::${base.value}`)
        break
      default:
        logger.fatal(
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