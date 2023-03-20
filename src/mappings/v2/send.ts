import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError, validateInteraction } from '../utils/consolidator'
import { findRootItemById } from '../utils/entity'
import { getInteraction } from '../utils/getters'
import { isDummyAddress } from '../utils/helper'
import logger, { logError } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'

export async function send(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getInteraction);
    interaction = value

    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    validateInteraction(nft, interaction)
    isOwnerOrElseError(nft, caller)
    const originalOwner = nft.currentOwner ?? undefined
    const recipient = interaction.value || ''

    const isRecipientNFT = !isDummyAddress(recipient)

    nft.price = BigInt(0)
    nft.updatedAt = timestamp


    if (isRecipientNFT) {
      const parent = await get<NFTEntity>(context.store, NFTEntity, recipient)
      const isCallerTheOwner = parent.currentOwner === caller
      const rootRecipientNFT = await findRootItemById(context.store, recipient)

      nft.currentOwner = rootRecipientNFT.currentOwner
      nft.pending = !isCallerTheOwner;
      nft.parent = parent
    } else {
      nft.parent = null
      nft.currentOwner = recipient
      nft.pending = false
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


// current owner on nested should indicate the owner of the root NFT