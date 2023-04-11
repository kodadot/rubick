import { InteractionValue, UnwrappedRemark, unwrapRemark } from '@kodadot1/minimark/v1'
import { SystemRemarkCall } from '../../types/calls'
import { extractExtra } from './extract'
import { ensureInteraction } from './helper'
import { Collection, Context, InteractionExtra, NFT } from './types'

export function getRemarkString(ctx: Context): string {
  const { remark } = new SystemRemarkCall(ctx).asV1020
  return remark.toString()
}

export function getRemark<T = InteractionValue>(ctx: Context): UnwrappedRemark<T | InteractionValue> {
  const remark = getRemarkString(ctx)
  return unwrapRemark<T>(remark)
}

export function getCreateCollection(ctx: Context): UnwrappedRemark<Collection> {
  return getRemark<any>(ctx) as UnwrappedRemark<Collection>
}

export function getCreateToken(ctx: Context): UnwrappedRemark<NFT> {
  return getRemark<any>(ctx) as UnwrappedRemark<NFT>
}

export function getInteraction(ctx: Context): UnwrappedRemark<InteractionValue> {
  const { value, ...rest } = getRemark<InteractionValue>(ctx)
  return { ...rest, value: ensureInteraction(value) }
}

export function getInteractionWithExtra(ctx: Context): UnwrappedRemark<InteractionValue> & InteractionExtra {
  const { value, ...rest } = getRemark<InteractionValue>(ctx)
  const extra = extractExtra(ctx)
  return { ...rest, value: ensureInteraction(value), extra }
}
