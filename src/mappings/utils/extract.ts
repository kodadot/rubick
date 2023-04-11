import { SubstrateCall, SubstrateExtrinsic } from '@subsquid/substrate-processor'
import { Call } from '../../types/support'
import { addressOf } from './helper'
import { ArchiveCall, BaseCall, BatchArg, CallWith, Context, Transfer, UnwrapFunc } from './types'
const PREFIXES = ['0x726d726b', '0x524d524b', 'rmrk', 'RMRK']

export interface RemarkResult extends BaseCall {
  value: string
  extra?: BatchArg[]
}

const startsWithRemark = (value: string, prefixes: string[] = PREFIXES): boolean =>
  // eslint-disable-next-line unicorn/explicit-length-check
  prefixes.length < 1 || prefixes.some((word) => value.startsWith(word))

const isSystemRemark = (call: ArchiveCall, prefixes: string[] = PREFIXES): boolean =>
  call.__kind === 'System' && call.value.__kind === 'remark' && startsWithRemark(call.value.remark, prefixes)

const isUtilityBatch = (call?: SubstrateCall) =>
  call && (call.name === 'Utility.batch_all' || call.name === 'Utility.batch')

const filterTransfers = ({ __kind, value }: ArchiveCall) => __kind === 'Balances' && value.__kind === 'transfer'

const filterRemarks = (call: ArchiveCall) => isSystemRemark(call)

const mapToSquidCall = (arg: ArchiveCall): Call => ({
  name: arg.__kind + '.transfer',
  args: arg.value,
})

const toBalanceTransfer = (call: Call): Transfer => {
  const { dest, value } = call.args
  return { to: addressOf(dest), value }
}

function toBaseCall(context: Context): BaseCall {
  const caller = addressOf(context.extrinsic.signature?.address)
  const blockNumber = context.block.height.toString()
  const timestamp = new Date(context.block.timestamp)

  return { caller, blockNumber, timestamp }
}

export function unwrap<T>(ctx: Context, unwrapFn: UnwrapFunc<T>): CallWith<T> {
  const baseCall = toBaseCall(ctx)
  const unwrapped = unwrapFn(ctx)
  return { ...baseCall, ...unwrapped }
}

function toRemarkResult(value: string, base: BaseCall): RemarkResult {
  return {
    value,
    ...base,
  }
}

type RemarkOrBatch = string | SubstrateExtrinsic

export function extractExtra(ctx: Context): Transfer[] {
  if (isUtilityBatch(ctx.call.parent)) {
    return ctx.call.parent?.args.calls.filter(filterTransfers).map(mapToSquidCall).map(toBalanceTransfer)
  }

  return []
}

export function extractRemark(processed: RemarkOrBatch, context: Context): RemarkResult[] {
  if (typeof processed === 'string') {
    return startsWithRemark(processed) ? [toRemarkResult(processed, toBaseCall(context))] : []
  }

  return []
}
