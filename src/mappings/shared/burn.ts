import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'
import { createEvent } from './event'

const OPERATION = Action.BURN

export async function burn(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction)
    interaction = value
    const nft = await getWith<NFTEntity>(context.store, NFTEntity, interaction.id, { collection: true })
    plsNotBe<NFTEntity>(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.price = BigInt(0)
    nft.burned = true
    nft.updatedAt = timestamp

    plsBe(real, nft.collection)

    nft.collection.updatedAt = timestamp
    nft.collection.supply -= 1

    success(OPERATION, `${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, OPERATION, { blockNumber, caller, timestamp, version }, '', context.store)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
