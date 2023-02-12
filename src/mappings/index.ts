import { unwrapRemark } from '@vikiival/minimark/v1'
import { isRemark, isRemarkVersion, VersionedRemark } from '@vikiival/minimark/shared'
import { SystemRemarkCall } from '../types/calls'
import logger from './utils/logger'
import { RmrkInteraction, Context } from './utils/types'

import { mainFrame as mainFrameV1 } from './v1'
import { mainFrame as mainFrameV2 } from './v2'
import { updateCache } from './utils/cache'

export async function handleRemark(context: Context): Promise<void> {
  const { remark } = new SystemRemarkCall(context).asV1020
  const value = remark.toString()
  const version = isRemarkVersion(value)

  if (version) {
    await versionRouter(value, context, version)
  } else {
    logger.warn(`[NON RMRK VALUE] ${value}`)
  }
}

export async function versionRouter(value: string, context: Context, version: VersionedRemark): Promise<void> {
  // logger.debug(`[${event}]::${version}`)

  if (version === '2.0.0') {
    await mainFrameV2(value, context)
  }

  // await mainFrameV1(value, context)
  // TODO: use data from the base or something
  // await updateCache(new Date(), context.store)
}


