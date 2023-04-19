import { logger } from '@kodadot1/metasquid/logger'
import { BaseCall } from '@kodadot1/metasquid/types'
import { NFTEntity } from '../../model'
import { createEvent } from '../shared'
import { findAllNestedChildrenByParentId } from '../utils/entity'
import { Action, Context } from '../utils/types'
import { error } from '../utils/logger'

export async function manageChildren(context: Context, call: BaseCall, nft: NFTEntity, originalOwner: string) {
  const children = await findAllNestedChildrenByParentId(context.store, nft.id)

  logger.debug(`Found ${children.length} children of ${nft.id}`)

  for (const child of children) {
    child.currentOwner = nft.currentOwner
    child.price = BigInt(0)
    try {
      await context.store.save(child)
    await createEvent(
      child,
      Action.SEND,
      call,
      child.currentOwner || '',
      context.store,
      originalOwner)
    } catch (e) {
      error(e, Action.SEND, `Failed to update child ${child.id} of ${nft.id}`)
    }
  }

  logger.debug(`Updated ${children.length} children of ${nft.id}`)
}

