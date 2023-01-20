import { Base, Interaction, UnwrappedRemark, unwrapRemarkV2 as unwrapRemark, UnwrapValue } from '@vikiival/minimark/v2'
import { SystemRemarkCall } from '../../types/calls'
import { Context, NFT } from '../utils/types'

export function getRemark<T extends keyof UnwrapValue = "NONE">(ctx: Context): UnwrappedRemark<UnwrapValue[T]> {
  const { remark } = new SystemRemarkCall(ctx).asV1020
  return unwrapRemark<T>(remark.toString())
}

export function getCreateBase(ctx: Context): UnwrappedRemark<Base> {
  return getRemark<Interaction.BASE>(ctx)
}

export function getCreateToken(ctx: Context): UnwrappedRemark<NFT<true>> {
  return getRemark<any>(ctx) as UnwrappedRemark<NFT<true>>
}