import { ensure } from '@kodadot1/metasquid'
import { plsBe, real } from '@kodadot1/metasquid/consolidator'
import { get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { CollectionEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError, withMeta } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import logger, { logError } from '../utils/logger'
import { Context, RmrkInteraction } from '../utils/types'


export async function lockCollection(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction);
    interaction = value
    plsBe(withMeta, interaction)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(context.store, CollectionEntity, interaction.id)
    )
    plsBe<CollectionEntity>(real, collection)
    isOwnerOrElseError(collection, caller)
    // TODO: implement lock
    collection.max = Number(interaction.value)
    

    logger.success(`[CHANGEISSUER] ${collection.id} from ${caller}`)
    await context.store.save(collection)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CHANGEISSUER] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}