import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError, validateInteraction } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'
import { createEvent } from './event'

const OPERATION = Action.SEND

export async function send(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction)
    interaction = value

    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, caller)
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = interaction.value
    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    success(OPERATION, `${nft.id} to ${interaction.value}`)
    await context.store.save(nft)
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
