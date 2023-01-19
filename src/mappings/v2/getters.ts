import { InteractionValue, UnwrappedRemark, unwrapRemark } from '@vikiival/minimark/v1'
import { SystemRemarkCall } from '../../types/calls'
import { Base, Context } from '../utils/types'

export function getRemark<T = InteractionValue>(ctx: Context): UnwrappedRemark<T | InteractionValue> {
  const { remark } = new SystemRemarkCall(ctx).asV1020
  return unwrapRemark<T>(remark.toString())
}

export function getCreateBase(ctx: Context): UnwrappedRemark<Base> {
  return getRemark<Base>(ctx) as UnwrappedRemark<Base>
}

