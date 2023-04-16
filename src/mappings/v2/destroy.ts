import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { BasicInteraction } from '@kodadot1/minimark/v2'
import { CollectionEntity } from '../../model'
import { unwrap } from '../utils'
import { isIssuerOrElseError } from '../utils/consolidator'
import { error, success } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getInteraction } from './getters'

const OPERATION = Action.DESTROY

export async function destroy(context: Context) {
  let interaction: Optional<BasicInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction)
    interaction = value
    const collection = await get<CollectionEntity>(context.store, CollectionEntity, interaction.id)

    isIssuerOrElseError(collection, caller)

    if (collection.supply > 0) {
      throw new Error(`Cannot change issuer of collection with supply ${collection.supply}`)
    }

    collection.burned = true

    await context.store.save(collection)
    success(OPERATION, `${collection.id} from ${caller}`)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
