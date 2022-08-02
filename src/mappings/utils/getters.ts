import { BalancesTransferCall, SystemRemarkCall } from '../../types/calls'
import { Context, Transfer } from './types'
import { CallContext } from '../../types/support'
import { addressOf } from './helper'

export function getRemark(ctx: Context): any {
  const { remark } = new SystemRemarkCall(ctx).asV1020
  return remark.toString()
}

export function getBalancesTransfer(ctx: CallContext): Transfer {
  const transfer = new BalancesTransferCall(ctx)

  if (transfer.isV1020) {
    const { dest, value } = transfer.asV1020
    return { to: addressOf(dest), value }
  }

  if (transfer.isV1050) {
    const { dest, value } =  transfer.asV1050
    return { to: addressOf(dest), value }
  }

  if (transfer.isV2028) {
    const { dest, value } = transfer.asV2028
    return { to: addressOf(dest), value }
  }

  const { dest, value } = transfer.asV9111
  return { to: addressOf(dest), value }
}