import { ensure } from '@kodadot1/metasquid'
import { get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError, validateInteraction } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import logger, { logError } from '../utils/logger'
import { Context, Action, RmrkInteraction } from '../utils/types'
import { createEvent } from '../shared/event'
import { isDummyAddress } from '../utils/helper'
import { plsBe, real } from '@kodadot1/metasquid/consolidator'

export async function send(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction);
    interaction = value

    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, caller)
    const originalOwner = nft.currentOwner ?? undefined

    nft.currentOwner = interaction.value
    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    const recipient = interaction.value || ''

    const isNFT = !isDummyAddress(recipient)

    if (isNFT) {
      const parent = ensure<NFTEntity>(
        await get<NFTEntity>(context.store, NFTEntity, recipient)
      )

      plsBe(real, parent)
      const isCallerTheOwner = parent.currentOwner === caller
      nft.currentOwner = isCallerTheOwner ? null : caller
        // nft.parent = parent
    }




    logger.success(`[SEND] ${nft.id} to ${interaction.value}`)
    await context.store.save(nft)
    await createEvent(nft, Action.SEND, { blockNumber, caller, timestamp, version }, interaction.value || '', context.store, originalOwner)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[SEND] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}