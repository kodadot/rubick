import { isRemarkVersion, VersionedRemark } from '@kodadot1/minimark/shared'
import logger from './utils/logger'
import { Context } from './utils/types'

import { getRemarkString } from './utils/getters'
import { mainFrame as mainFrameV1 } from './v1'
import { mainFrame as mainFrameV2 } from './v2'
import { updateCache, updateMetadataCache } from './utils/cache'

export async function handleRemark(context: Context): Promise<void> {
  const value = getRemarkString(context)
  const version = isRemarkVersion(value)

  if (version) {
    await versionRouter(value, context, version)
  }
}

export async function versionRouter(value: string, context: Context, version: VersionedRemark): Promise<void> {
  // logger.debug(`[${event}]::${version}`)

  if (version === '2.0.0') {
    await mainFrameV2(value, context)
  }

  // TODO: Enable when v1 is ready
  // await mainFrameV1(value, context)

  // TODO: use data from the base or something
  // const date = new Date(context.block.timestamp)
  // await updateCache(new Date(), context.store)
  await updateMetadataCache(new Date(), context.store)
}
