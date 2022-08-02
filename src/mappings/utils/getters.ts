import { BalancesTransferCall, SystemRemarkCall } from '../../types/calls'
import { Context, Transfer } from './types'
import { CallContext } from '../../types/support'
import { addressOf, onlyValue } from './helper'
import { unwrapRemark, UnwrappedRemark, InteractionValue } from '@kodadot1/minimark'

export function getRemark<T = InteractionValue>(ctx: Context): UnwrappedRemark<T | InteractionValue> {
  const { remark } = new SystemRemarkCall(ctx).asV1020
  return unwrapRemark<T>(remark.toString())
}
// export function getBalancesTransfer(ctx: CallContext): Transfer {
//   const transfer = new BalancesTransferCall(ctx)

//   console.log(transfer.isV1020, transfer.isV1050, transfer.isV2028, transfer.isV9111)

//   if (transfer.isV1020) {
//     const { dest, value } = transfer.asV1020
//     return { to: onlyValue(dest), value }
//   }

//   if (transfer.isV1050) {
//     const { dest, value } =  transfer.asV1050
//     return { to: addressOf(dest), value }
//   }

//   if (transfer.isV2028) {
//     const { dest, value } = transfer.asV2028
//     return { to: onlyValue(dest), value }
//   }

//   const { dest, value } = transfer.asV9111
//   return { to: onlyValue(dest).toString('base64'), value }
// }