import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { unwrap } from '../utils'
import {
  isMoreTransferable,
  isOwnerOrElseError,
  isPositiveOrElseError,
  validateInteraction,
} from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'
import { createEvent } from './event'

const OPERATION = Action.BUY

export async function list(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction)
    interaction = value
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, caller)
    const price = BigInt(interaction.value || '0')
    if (version === '2.0.0' && price !== 0n) {
      isMoreTransferable(nft, blockNumber)
    }
    isPositiveOrElseError(price)
    nft.price = price
    nft.updatedAt = timestamp

    success(OPERATION, `${nft.id} from ${caller}`)
    await context.store.save(nft)
    const event = nft.price === 0n ? Action.UNLIST : Action.LIST
    await createEvent(nft, event, { blockNumber, caller, timestamp, version }, String(price), context.store)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
