import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Accept } from '@vikiival/minimark/v2'

import { NFTEntity } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getAcceptResource } from './getters'

const OPERATION = Action.ACCEPT

export async function acceptResource(context: Context) {
  let interaction: Optional<Accept> = null

  try {
    const { value: interaction, caller, timestamp, blockNumber, version } = unwrap(context, getAcceptResource);
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe(real, nft)
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.updatedAt = timestamp

    // TODO: add logic for accepting resource

    logger.success(`[ACCEPT] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, Action.ACCEPT, { blockNumber, caller, timestamp, version }, `${interaction.entity_type}::${interaction.entity_id}`, context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[ACCEPT] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}
