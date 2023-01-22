import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Resadd } from '@vikiival/minimark/v2'

import { NFTEntity } from '../../model'
import { handleMetadata } from '../shared'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getAddRes } from './getters'

const OPERATION = Action.RESADD

export async function addResource(context: Context) {
  let interaction: Optional<Resadd> = null

  try {
    const getter = getAddRes
    const { value: interaction, caller, timestamp, blockNumber, version } = unwrap(context, getter);
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe(real, nft)
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.updatedAt = timestamp

    if (interaction.value.metadata) {
      const metadata = await handleMetadata(interaction.value.metadata, '', context.store)
      logger.log(`[${OPERATION}] ${nft.id} metadata ${metadata?.id}`)
    }

    // TODO: add logic for accepting resource

    logger.success(`[${OPERATION}] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, OPERATION, { blockNumber, caller, timestamp, version }, `${interaction.value.id}`, context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[${OPERATION}] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}
