import { ensure } from '@kodadot1/metasquid'
import { getOrFail as get, findByRawQuery } from '@kodadot1/metasquid/entity'
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
import { rootOwnerQuery } from '../../server-extension/query/nft'

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

    const rootNFT = ensure<NFTEntity>(await findByRawQuery(context.store, NFTEntity, rootOwnerQuery, [interaction.id]).then((res) => res.at(0)))
    plsBe(real, rootNFT)
    isOwnerOrElseError(rootNFT, caller)

    const isRecipientNFT = !isDummyAddress(recipient)

    nft.currentOwner = recipient
    nft.price = BigInt(0)
    nft.updatedAt = timestamp


    if (isRecipientNFT) {
      const parent = await get<NFTEntity>(context.store, NFTEntity, recipient)
      const isCallerTheOwner = parent.currentOwner === caller
      const rootRecipientNFT = ensure<NFTEntity>(await findByRawQuery(context.store, NFTEntity, rootOwnerQuery, [recipient]).then((res) => res.at(0)))
      plsBe(real, rootRecipientNFT)

      nft.currentOwner = rootRecipientNFT.currentOwner
      // nft.pending = !isCallerTheOwner;
      nft.parent = parent
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