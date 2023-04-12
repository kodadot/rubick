import { plsBe, real } from '@kodadot1/metasquid/consolidator'
import { getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { CollectionEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError, withMeta } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'
import { calculateCollectionOwnerCount, calculateCollectionDistribution } from '../utils/helper'

const OPERATION = Action.CHANGEISSUER

// TODO: can also change BASE in V2 (not implemented yet)
export async function changeIssuer(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction)
    interaction = value
    plsBe(withMeta, interaction)
    const collection = await getWith<CollectionEntity>(context.store, CollectionEntity, interaction.id, {
      nfts: true,
    })
    plsBe<CollectionEntity>(real, collection)
    isOwnerOrElseError(collection, caller)
    collection.currentOwner = interaction.value
    collection.ownerCount = calculateCollectionOwnerCount(collection)
    collection.distribution = calculateCollectionDistribution(collection)

    await context.store.save(collection)
    success(OPERATION, `${collection.id} from ${caller}`)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
