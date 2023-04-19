import { logger } from '@kodadot1/metasquid/logger'
import { NFTEntity } from '../../model'
import { createEvent } from '../shared'
import { findAllNestedChildrenByParentId } from '../utils/entity'
import { error } from '../utils/logger'
import { Action, BaseCall, Context } from '../utils/types'

export async function manageChildTransfer(context: Context, nft: NFTEntity, originalOwner: string | undefined, call: BaseCall) {
  const children = await findAllNestedChildrenByParentId(context.store, nft.id)

  logger.debug(`Found ${children.length} children of ${nft.id}`)

  for (const child of children) {
    child.currentOwner = nft.currentOwner
    child.price = BigInt(0)
    try {
      await context.store.save(child)
      await createEvent(child, Action.SEND, call, child.currentOwner || '', context.store, originalOwner)
    } catch (e) {
      error(e, Action.SEND, `Failed to update child ${child.id} of ${nft.id}`)
    }
  }

  logger.debug(`Updated ${children.length} children of ${nft.id}`)
}
