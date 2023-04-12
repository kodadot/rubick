import { plsBe } from '@kodadot1/metasquid/consolidator'
import { getWith, getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { ChangeIssuer } from '@kodadot1/minimark/v2'
import { Base, CollectionEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError, withMeta } from '../utils/consolidator'
import { error, success } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { calculateCollectionDistribution, calculateCollectionOwnerCount } from '../utils/helper'
import { getChangeIssuer } from './getters'

const OPERATION = Action.CHANGEISSUER

export async function changeIssuer(context: Context) {
  let interaction: Optional<ChangeIssuer> = null

  try {
    const { value, caller } = unwrap(context, getChangeIssuer)
    interaction = value
    plsBe(withMeta, interaction)

    const isBase = interaction.id.startsWith('base')
    const entity = isBase
      ? await get<Base>(context.store, Base, interaction.id)
      : await get<CollectionEntity>(context.store, CollectionEntity, interaction.id)
    isOwnerOrElseError(entity, caller)
    entity.currentOwner = interaction.newissuer

    if (entity instanceof CollectionEntity) {
      const collectionWithNfts = await getWith<CollectionEntity>(context.store, CollectionEntity, interaction.id, { nfts: true })

      entity.ownerCount = calculateCollectionOwnerCount(collectionWithNfts)
      entity.distribution = calculateCollectionDistribution(collectionWithNfts)
    }

    await context.store.save(entity)
    success(OPERATION, `${entity.id} from ${caller}`)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
