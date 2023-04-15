import { getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { CollectionEntity, NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isBuyLegalOrElseError, isInteractive, isMoreTransferable, isPositiveOrElseError } from '../utils/consolidator'
import { getInteractionWithExtra } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'
import { createEvent } from '../shared/event'
import { calculateCollectionOwnerCountAndDistribution } from '../utils/helper'

const OPERATION = Action.BUY

export async function buy(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, extra, version } = unwrap(context, getInteractionWithExtra)
    interaction = value
    const nft = await getWith<NFTEntity>(context.store, NFTEntity, interaction.id, {
      collection: true,
    })
    isInteractive(nft)
    isPositiveOrElseError(nft.price, true)
    isBuyLegalOrElseError(nft, extra || [])
    const originalPrice = nft.price
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = caller
    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    nft.collection.updatedAt = timestamp
    nft.collection.volume += originalPrice
    if (originalPrice > nft.collection.highestSale) {
      nft.collection.highestSale = originalPrice
    }
    const { ownerCount, distribution } = await calculateCollectionOwnerCountAndDistribution(
      context.store,
      nft.collection.id,
      nft.currentOwner,
      originalOwner
    )
    nft.collection.ownerCount = ownerCount
    nft.collection.distribution = distribution

    await context.store.save(nft)
    success(OPERATION, `${nft.id} from ${caller}`)
    await createEvent(
      nft,
      OPERATION,
      { blockNumber, caller, timestamp },
      String(originalPrice),
      context.store,
      originalOwner
    )
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
