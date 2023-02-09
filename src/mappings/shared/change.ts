import { ensure } from '@kodadot1/metasquid'
import { plsBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { CollectionEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError, withMeta } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import logger, { logError } from '../utils/logger'
import { Context, RmrkInteraction } from '../utils/types'

// TODO: can also change BASE in V2 (not implemented yet)
export async function changeIssuer(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction);
    interaction = value
    plsBe(withMeta, interaction)
    const collection = await get<CollectionEntity>(context.store, CollectionEntity, interaction.id)
    plsBe<CollectionEntity>(real, collection)
    isOwnerOrElseError(collection, caller)
    collection.currentOwner = interaction.value

    logger.success(`[CHANGEISSUER] ${collection.id} from ${caller}`)
    await context.store.save(collection)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CHANGEISSUER] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}