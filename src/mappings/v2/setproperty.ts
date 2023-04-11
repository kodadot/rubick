import { Optional } from '@kodadot1/metasquid/types'
import { SetProperty } from '@kodadot1/minimark/v2'

import { unwrap } from '../utils'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getSetProperty } from './getters'

const OPERATION = Action.SETPROPERTY

export async function setProperty(context: Context) {
  let interaction: Optional<SetProperty> = null

  try {
    const getter = getSetProperty
    const {
      value: interaction,
      caller,
      timestamp,
      blockNumber,
      version,
    } = unwrap(context, getter)

    // logger.success(`[${OPERATION}] NEW PRIORITY ${interaction.value} for ${nft.id} from ${caller}`)

    // TODO: add logic for accepting resource

    logger.info(
      `[${OPERATION}] < ${interaction.name}, ${interaction.value} > for ${interaction.id} from ${caller}`
    )
    // await context.store.save(nft)
    // await createEvent(nft, OPERATION, { blockNumber, caller, timestamp, version }, `${interaction.value.at(0)}`, context.store)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[${OPERATION}] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}
