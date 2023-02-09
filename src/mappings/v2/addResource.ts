import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrCreate, getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Resadd } from '@vikiival/minimark/v2'

import { NFTEntity, Resource } from '../../model'
import { handleMetadata } from '../shared'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isIssuerOrElseError, isOwnerOrElseError } from '../utils/consolidator'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getAddRes } from './getters'

const OPERATION = Action.RESADD

export async function addResource(context: Context) {
  let interaction: Optional<Resadd> = null

  try {
    const getter = getAddRes
    const { value: interaction, caller, timestamp, blockNumber, version } = unwrap(context, getter);
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    plsNotBe(burned, nft)
    isIssuerOrElseError(nft, caller)
    const isPending = nft.currentOwner !== caller
    nft.updatedAt = timestamp

    const final = await getOrCreate(context.store, Resource, interaction.value.id, { ...interaction.value,  })

    if (interaction.value.metadata) {
      const metadata = await handleMetadata(interaction.value.metadata, '', context.store)
      logger.log(`[${OPERATION}] ${nft.id} metadata ${metadata?.id}`)
      final.meta = metadata
    }

    final.pending = isPending
    final.nft = nft
    final.metadata = interaction.value.metadata
    final.src = interaction.value.src
    final.thumb = interaction.value.thumb
    final.priority = 0

    logger.success(`[${OPERATION}] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await context.store.save(final)
    await createEvent(nft, OPERATION, { blockNumber, caller, timestamp, version }, `${interaction.value.id}`, context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[${OPERATION}] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}
