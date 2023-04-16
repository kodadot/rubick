import { Interaction, unwrapRemarkV2 as unwrapRemark } from '@kodadot1/minimark/v2'

import { burn, list } from '../shared'
import { unwrap } from '../utils/extract'
import logger, { pending } from '../utils/logger'
import { Context } from '../utils/types'
import { acceptResource } from './accept'
import { addResource } from './addResource'
import { addTheme } from './addTheme'
import { base as createBase } from './base'
import { buy } from './buy'
import { changeIssuer } from './change'
import { createCollection } from './create'
import { destroy } from './destroy'
import { emote } from './emote'
import { equip } from './equip'
import { equippable } from './equippable'
import { lockCollection } from './lock'
import { mintItem } from './mint'
import { setProperty } from './propertySet'
import { send } from './send'
import { setPriority } from './setpriority'

export async function mainFrame(remark: string, context: Context): Promise<void> {
  const base = unwrap(context, (_: Context) => ({ value: remark }))
  try {
    const { interaction: event, version } = unwrapRemark(remark.toString())
    pending(event, `.:${version} ${base.blockNumber}:.`)

    switch (event) {
      case Interaction.CREATE:
        await createCollection(context)
        break
      case Interaction.MINT:
        await mintItem(context)
        break
      case Interaction.SEND:
        await send(context)
        break
      case Interaction.BUY:
        await buy(context)
        break
      case Interaction.BURN:
        await burn(context)
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
      // RMRK v2.0.0
      case Interaction.ACCEPT:
        await acceptResource(context)
        break
      case Interaction.BASE:
        await createBase(context)
        break
      case Interaction.SETPRIORITY:
        await setPriority(context)
        break
      case Interaction.RESADD:
        await addResource(context)
        break
      case Interaction.LOCK:
        await lockCollection(context)
        break
      case Interaction.THEMEADD:
        await addTheme(context)
        break
      case Interaction.EQUIP:
        await equip(context)
        break
      case Interaction.EQUIPPABLE:
        await equippable(context)
        break
      case Interaction.SETPROPERTY:
        await setProperty(context)
        break
      case Interaction.DESTROY:
        await destroy(context)
        break
      default:
        logger.fatal(`[SKIP] ${event}::${base.value}::${base.blockNumber}`)
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
