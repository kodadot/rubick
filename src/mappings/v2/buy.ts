import { getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isBuyLegalOrElseError, isInteractive, isMoreTransferable, isPositiveOrElseError } from '../utils/consolidator'
import { getInteractionWithExtra } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'
import { createEvent } from '../shared/event'
import { getBuy } from './getters'

const OPERATION = Action.BUY

export async function buy(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, extra } = unwrap(context, getBuy);
    interaction = value
    const nft = await getWith<NFTEntity>(context.store, NFTEntity, interaction.id, { collection: true })
    isInteractive(nft)
    isPositiveOrElseError(nft.price, true)
    isMoreTransferable(nft, blockNumber)
    isBuyLegalOrElseError(nft, extra || [])
    const originalPrice = nft.price
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = value.recipient || caller
    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    nft.collection.updatedAt = timestamp

    success(OPERATION, `${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, OPERATION, { blockNumber, caller, timestamp }, String(originalPrice), context.store, originalOwner)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}