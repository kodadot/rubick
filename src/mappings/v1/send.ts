import { getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { plsBe } from '@kodadot1/metasquid/consolidator'
import { NFTEntity } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError, realAddress, validateInteraction } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'
import { calculateCollectionOwnerCountAndDistribution } from '../utils/helper'

const OPERATION = Action.SEND

export async function send(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction)
    interaction = value

    const nft = await getWith<NFTEntity>(context.store, NFTEntity, interaction.id, {
      collection: true,
    })
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, caller)
    plsBe(realAddress, interaction.value)
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = interaction.value
    nft.price = BigInt(0)
    nft.updatedAt = timestamp
    const { ownerCount, distribution } = await calculateCollectionOwnerCountAndDistribution(
      context.store,
      nft.collection.id,
      nft.currentOwner,
      originalOwner
    )
    nft.collection.ownerCount = ownerCount
    nft.collection.distribution = distribution

    await context.store.save(nft)
    success(OPERATION, `${nft.id} to ${interaction.value}`)
    await createEvent(
      nft,
      Action.SEND,
      { blockNumber, caller, timestamp, version },
      interaction.value || '',
      context.store,
      originalOwner
    )
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
