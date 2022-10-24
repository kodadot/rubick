import {
  CollectionEntity,
  Emote, Event,
  Interaction, NFTEntity
} from '../../model/generated'

import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/dist/consolidator'
import { isRemark, unwrapRemark } from '@kodadot1/minimark'
import md5 from 'md5'
import { SystemRemarkCall } from '../../types/calls'
import { unwrap } from '../utils'
import { updateCache } from '../utils/cache'
import { isBuyLegalOrElseError, isInteractive, isOwnerOrElseError, isPositiveOrElseError, validateInteraction, withMeta } from '../utils/consolidator'

import { handleMetadata } from '../shared/metadata'
import { create, get } from '../utils/entity'
import { getCreateCollection, getCreateToken, getInteraction, getInteractionWithExtra } from '../utils/getters'
import { emoteId, ensure, eventId } from '../utils/helper'
import logger, { logError } from '../utils/logger'
import {
  BaseCall, Collection, Context, eventFrom,
  getNftId, NFT,
  Optional,
  RmrkEvent,
  RmrkInteraction, Store
} from '../utils/types'
import { createCollection, createEvent } from '../shared/create'


export async function handleRemark(context: Context): Promise<void> {
  const { remark } = new SystemRemarkCall(context).asV1020
  const value = remark.toString()

  if (isRemark(value)) {
    await mainFrame(remark.toString(), context)
  } else {
    logger.warn(`[NON RMRK VALUE] ${value}`)
  }
}

export async function mainFrame(remark: string, context: Context): Promise<void> {
    const base = unwrap(context, (_: Context) => ({ value: remark }))
    try {
      const { interaction: event, version } = unwrapRemark<RmrkInteraction>(remark.toString())
      logger.pending(`[${event === RmrkEvent.MINT ? 'COLLECTION' : event}]: ${base.blockNumber}`)

      if (version === '2.0.0') {
        logger.star(`[RMRK::2.0.0] is not supported, please help us to make it awesome ${remark}`)
        return;
      }

      switch (event) {
        case RmrkEvent.MINT:
          await createCollection(context)
          break
        case RmrkEvent.MINTNFT:
          await mintNFT(context)
          break
        case RmrkEvent.SEND:
          await send(context)
          break
        case RmrkEvent.BUY:
          await buy(context)
          break
        case RmrkEvent.CONSUME:
          await consume(context)
          break
        case RmrkEvent.LIST:
          await list(context)
          break
        case RmrkEvent.CHANGEISSUER:
          await changeIssuer(context)
          break
        case RmrkEvent.EMOTE:
          await emote(context)
          break
        default:
          logger.start(
            `[SKIP] ${event}::${base.value}::${base.blockNumber}`
          )
      }
      await updateCache(base.timestamp,context.store)
    } catch (e) {
      logger.warn(
        `[MALFORMED]
         [BLOCK] ${base.blockNumber}
         [ERROR] ${(e as Error).message}
         [RMRK] ${base.value}`
      )
    }
  }


async function mintNFT(
  context: Context
): Promise<void> {
  let nft: Optional<NFT> = null
  try {
    const { value, caller, timestamp, blockNumber } = unwrap(context, getCreateToken);
    nft = value
    plsBe(real, nft.collection)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(context.store, CollectionEntity, nft.collection)
    )
    plsBe(real, collection)
    isOwnerOrElseError(collection, caller)
    const id = getNftId(nft, blockNumber)
    // const entity = await get<NFTEntity>(context.store, NFTEntity, id) // TODO: check if exists
    // plsNotBe<NFTEntity>(real, entity as NFTEntity)
    const final = create<NFTEntity>(NFTEntity, id, {})
    final.id = id
    final.hash = md5(id)
    final.issuer = caller
    final.currentOwner = caller
    final.blockNumber = BigInt(blockNumber)
    final.name = nft.name
    final.instance = nft.instance
    final.transferable = nft.transferable
    final.collection = collection
    final.sn = nft.sn
    final.metadata = nft.metadata
    final.price = BigInt(0)
    final.burned = false
    final.createdAt = timestamp
    final.updatedAt = timestamp

    if (final.metadata) {
      const metadata = await handleMetadata(final.metadata, final.name, context.store)
      final.meta = metadata
    }

    logger.success(`[MINT] ${final.id}`)
    await context.store.save(final)
    await createEvent(final, RmrkEvent.MINTNFT, { blockNumber, caller, timestamp }, '', context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.error(`[MINT] ${e.message}, ${JSON.stringify(nft)}`)
    )
  }
}

async function send(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber } = unwrap(context, getInteraction);
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

    logger.success(`[SEND] ${nft.id} to ${interaction.value}`)
    await context.store.save(nft)
    await createEvent(nft, RmrkEvent.SEND, { blockNumber, caller, timestamp }, interaction.value || '', context.store, originalOwner)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[SEND] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function buy(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber, extra } = unwrap(context, getInteractionWithExtra);
    interaction = value

    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    isInteractive(nft)
    isPositiveOrElseError(nft.price, true)
    isBuyLegalOrElseError(nft, extra || [])
    const originalPrice = nft.price
    const originalOwner = nft.currentOwner ?? undefined
    nft.currentOwner = caller
    nft.price = BigInt(0)
    nft.updatedAt = timestamp

    logger.success(`[BUY] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, RmrkEvent.BUY, { blockNumber, caller, timestamp }, String(originalPrice), context.store, originalOwner)
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[BUY] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function consume(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller, timestamp, blockNumber } = unwrap(context, getInteraction);
    interaction = value
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe<NFTEntity>(real, nft)
    plsNotBe<NFTEntity>(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.price = BigInt(0)
    nft.burned = true
    nft.updatedAt = timestamp

    logger.success(`[CONSUME] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, RmrkEvent.CONSUME, { blockNumber, caller, timestamp }, '', context.store)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CONSUME] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function changeIssuer(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction);
    interaction = value
    plsBe(withMeta, interaction)
    const collection = ensure<CollectionEntity>(
      await get<CollectionEntity>(context.store, CollectionEntity, interaction.id)
    )
    plsBe<CollectionEntity>(real, collection)
    isOwnerOrElseError(collection, caller)
    collection.currentOwner = interaction.value

    logger.success(`[CHANGEISSUER] ${collection.id} from ${caller}`)
    await context.store.save(collection)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[CHANGEISSUER] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

async function emote(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction);
    interaction = value
    plsBe(withMeta, interaction)
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe<NFTEntity>(real, nft)
    plsNotBe<NFTEntity>(burned, nft)
    const id = emoteId(interaction, caller)
    let emote = await get<Emote>(context.store, Emote, interaction.id)

    if (emote) {
      await context.store.remove(emote)
      return
    }

    emote = create<Emote>(Emote, id, {
      id,
      caller,
      value: interaction.value,
    })

    emote.nft = nft

    logger.success(`[EMOTE] ${nft.id} from ${caller}`)
    await context.store.save(emote)
  } catch (e) {
    logError(e, (e) => logger.warn(`[EMOTE] ${e.message}`))
  }
}


