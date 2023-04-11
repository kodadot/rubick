import { plsBe, real } from '@kodadot1/metasquid/consolidator'
import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { CollectionEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError, withMeta } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'

const OPERATION = Action.LOCK

export async function lockCollection(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction)
    interaction = value
    plsBe(withMeta, interaction)
    const collection = await get<CollectionEntity>(context.store, CollectionEntity, interaction.id)
    plsBe<CollectionEntity>(real, collection)
    isOwnerOrElseError(collection, caller)
    collection.max = Number(collection.nftCount)

    success(OPERATION, `${collection.id} from ${caller}`)
    await context.store.save(collection)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
