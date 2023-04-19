import { getOrFail as get, getWith } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { Buy } from '@kodadot1/minimark/v2'
import { NFTEntity } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isBuyLegalOrElseError, isInteractive, isMoreTransferable, isPositiveOrElseError } from '../utils/consolidator'
import { findRootItemById } from '../utils/entity'
import { calculateCollectionOwnerCountAndDistribution, isDummyAddress } from '../utils/helper'
import { error, success } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getBuy } from './getters'
import { manageChildTransfer } from './children'

const OPERATION = Action.BUY

export async function buy(context: Context) {
  let interaction: Optional<Buy> = null

  try {
    const { value, caller, timestamp, blockNumber, extra, version } = unwrap(context, getBuy)
    interaction = value
    const nft = await getWith<NFTEntity>(context.store, NFTEntity, interaction.id, { collection: true })
    isInteractive(nft)
    isPositiveOrElseError(nft.price, true)
    isMoreTransferable(nft, blockNumber)
    isBuyLegalOrElseError(nft, extra || [])
    const originalPrice = nft.price
    const originalOwner = nft.currentOwner ?? undefined
    const recipient = interaction.recipient || caller

    const isRecipientNFT = !isDummyAddress(recipient)

    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    nft.collection.updatedAt = timestamp
    nft.collection.volume += originalPrice
    if (originalPrice > nft.collection.highestSale) {
      nft.collection.highestSale = originalPrice
    }

    if (isRecipientNFT) {
      const parent = await get<NFTEntity>(context.store, NFTEntity, recipient)
      const isCallerTheOwner = parent.currentOwner === caller
      const rootRecipientNFT = await findRootItemById(context.store, recipient)

      nft.currentOwner = rootRecipientNFT.currentOwner
      nft.pending = !isCallerTheOwner
      nft.parent = parent
    } else {
      nft.currentOwner = recipient
      nft.parent = null
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
    await context.store.save(nft.collection)
    success(OPERATION, `${nft.id} from ${caller}`)
    await createEvent(
      nft,
      OPERATION,
      { blockNumber, caller, timestamp, version },
      String(originalPrice),
      context.store,
      originalOwner
    )

    if (nft.currentOwner !== caller) {
      await createEvent(
        nft,
        Action.SEND,
        { blockNumber, caller, timestamp, version },
        nft.currentOwner || '',
        context.store,
        caller
      )
    }

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

    await manageChildTransfer(context, nft, originalOwner, { blockNumber, caller, timestamp, version },)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(interaction))
  }
}
