import { burned, plsNotBe } from '@kodadot1/metasquid/consolidator'
import { getOrCreate, getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Resadd } from '@kodadot1/minimark/v2'

import { NFTEntity, Resource } from '../../model'
import { handleMetadata } from '../shared'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isIssuerOrElseError } from '../utils/consolidator'
import logger, { error, success } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getAddRes } from './getters'

const OPERATION = Action.RESADD

export async function addResource(context: Context) {
  let interaction: Optional<Resadd> = null

  try {
    const getter = getAddRes
    const {
      value: interaction,
      caller,
      timestamp,
      blockNumber,
      version,
    } = unwrap(context, getter)
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    plsNotBe(burned, nft)
    isIssuerOrElseError(nft, caller)
    const isPending = nft.currentOwner !== caller
    nft.updatedAt = timestamp

    const final = await getOrCreate(
      context.store,
      Resource,
      interaction.value.id,
      { ...interaction.value }
    )

    if (interaction.value.metadata) {
      const metadata = await handleMetadata(
        interaction.value.metadata,
        '',
        context.store
      )
      logger.debug(`[${OPERATION}] ${nft.id} metadata ${metadata?.id}`)
      final.meta = metadata
    }

    final.pending = isPending
    final.nft = nft
    final.metadata = interaction.value.metadata
    final.src = interaction.value.src
    final.thumb = interaction.value.thumb
    final.priority = 0

    success(OPERATION, `${nft.id} from ${caller}`)
    await context.store.save(nft)
    await context.store.save(final)
    await createEvent(
      nft,
      OPERATION,
      { blockNumber, caller, timestamp, version },
      `${interaction.value.id}`,
      context.store
    )
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
