import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Accept } from '@vikiival/minimark/v2'

import { NFTEntity, Resource } from '../../model'
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
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    

    switch (interaction.entity_type) {
      case 'NFT':
        const pendingNFT = await get<NFTEntity>(context.store, NFTEntity, interaction.entity_id)
        plsNotBe(burned, nft)
        pendingNFT.updatedAt = timestamp
        pendingNFT.pending = false
        await context.store.save(nft)
        break;
      case 'RES':
        const res = await get<Resource>(context.store, Resource, interaction.entity_id)
        res.pending = false
        await context.store.save(res)
        break;
      default:
        throw new Error(`Unknown entity type ${interaction.entity_type}`)
    }

    logger.success(`[${OPERATION}] ${interaction.entity_type}::${interaction.entity_id} in ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, Action.ACCEPT, { blockNumber, caller, timestamp, version }, `${interaction.entity_type}::${interaction.entity_id}`, context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[${OPERATION}] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}
