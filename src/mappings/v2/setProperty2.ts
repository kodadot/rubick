import { Optional } from '@kodadot1/metasquid/types'
import { SetProperty, toPropertyId } from '@kodadot1/minimark/v2'

import { burned, plsNotBe } from '@kodadot1/metasquid/consolidator'
import { getWith } from '@kodadot1/metasquid/entity'
import { Property } from '../../model'
import { createEvent } from '../shared'
import { unwrap } from '../utils'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getSetProperty } from './getters'

const OPERATION = Action.SETPROPERTY

export async function setProperty(context: Context) {
  let interaction: Optional<SetProperty> = null

  try {
    const getter = getSetProperty
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getter)
    interaction = value

    const id = toPropertyId(interaction.id, interaction.name, interaction.value)

    const property = await getWith<Property>(context.store, Property, id, { nft: true })
    plsNotBe(burned, property.nft)

    if (property.mutable === false || interaction.name === 'royaltyInfo') {
      throw new Error(`Property ${interaction.name} is not mutable`)
    }

    property.value = interaction.value

    logger.info(`[${OPERATION}] < ${interaction.name}, ${interaction.value} > for ${interaction.id} from ${caller}`)
    await context.store.save(property)
    await createEvent(
      property.nft,
      OPERATION,
      { blockNumber, caller, timestamp, version },
      `${interaction.name}::${interaction.value}`,
      context.store
    )
  } catch (e) {
    logError(e, (e) => logger.warn(`[${OPERATION}] ${e.message} ${JSON.stringify(interaction)}`))
  }
}
