import { getWith, getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { NFTEntity } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isMoreTransferable, isOwnerOrElseError, validateInteraction } from '../utils/consolidator'
import { findRootItemById } from '../utils/entity'
import { getInteraction } from '../utils/getters'
import { calculateCollectionOwnerCountAndDistribution, isDummyAddress } from '../utils/helper'
import { error, success } from '../utils/logger'
import { Action, Context, RmrkInteraction } from '../utils/types'
import { manageChildTransfer } from './children'

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
    isMoreTransferable(nft, blockNumber)
    const originalOwner = nft.currentOwner ?? undefined
    const recipient = interaction.value || ''

    const isRecipientNFT = !isDummyAddress(recipient)

    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    // current owner on nested should indicate the owner of the root NFT
    if (isRecipientNFT) {
      const parent = await get<NFTEntity>(context.store, NFTEntity, recipient)
      const isCallerTheOwner = parent.currentOwner === caller
      const rootRecipientNFT = await findRootItemById(context.store, recipient)

      nft.currentOwner = rootRecipientNFT.currentOwner
      nft.pending = !isCallerTheOwner
      nft.parent = parent
    } else {
      nft.parent = null
      nft.currentOwner = recipient
      nft.pending = false
    }

    const { ownerCount, distribution } = await calculateCollectionOwnerCountAndDistribution(
      context.store,
      nft.collection.id,
      nft.currentOwner ?? undefined,
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
      nft.currentOwner || '',
      context.store,
      originalOwner
    )

    if (nft.parent !== null && nft.pending === false) {
      await createEvent(
        nft.parent,
        Action.ACCEPT,
        { blockNumber, caller, timestamp, version },
        `NFT::${interaction.id}`,
        context.store,
        originalOwner
      )
    }

    await manageChildTransfer(context, nft, originalOwner, { blockNumber, caller, timestamp, version })
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
