import { SubstrateCall, SubstrateExtrinsic } from '@subsquid/substrate-processor'
import { BalancesTransferCall } from '../../types/calls'
import { Call, CallContext, Chain } from '../../types/support'
import { addressOf } from './helper'
import { ArchiveCall, BaseCall, BatchArg, CallWith, Context, Transfer, UnwrapFunc } from './types'
const PREFIXES = ['0x726d726b', '0x524d524b', 'rmrk', 'RMRK']


 export type ExtraCall = BatchArg

 export interface RemarkResult extends BaseCall {
  value: string;
  extra?: ExtraCall[];
}


export type Records = RemarkResult[]

 const startsWithRemark = (value: string, prefixes: string[] = PREFIXES): boolean => (prefixes.length < 1 || prefixes.some((word) => value.startsWith(word)))

//  const isSystemRemark = (call: SubstrateExtrinsic | TCall, prefixes: string[] = PREFIXES): boolean =>
//   call.section === "system" &&
//   call.method === "remark" &&
//   startsWithRemark(call.args.toString(), prefixes)

const isUtilityBatch = (call?: SubstrateCall) => call && (call.name === 'Utility.batch_all' || call.name === 'Utility.batch')

const filterTransfers = ({ __kind }: ArchiveCall) => __kind === 'Balances'

const mapToSquidCall = (arg: ArchiveCall): Call => ({
  name: arg.__kind + '.transfer',
  args: arg.value
})

const mapToChainContext = (_chain: Chain) => (call: Call): CallContext => ({
  call,
  _chain
})

const toBalanceTransfer = (call: Call): Transfer => {
  const { dest, value } = call.args
  return { to: addressOf(dest), value }
}

const justArg = (batchArg: BatchArg): Record<string, any> => batchArg.args

const valueOfArg = (args: Record<string, any>): string => args.remark || args._remark

const hasBatchArgRemark = (args: Record<string, any>): boolean => {
  const call: string = valueOfArg(args)
  return Boolean(call) && startsWithRemark(call, PREFIXES)
}

// const hasBatchFailed = (event: SubstrateEvent | TEvent): boolean => {
//   const { method } = event;
//   return method.toString() === "BatchInterrupted" || method.toString() === "ExtrinsicFailed";
// }

 function toBaseCall(context: Context): BaseCall {
  const caller = addressOf(context.extrinsic.signature?.address)
  const blockNumber = context.block.height.toString();
  const timestamp = new Date(context.block.timestamp);

  return { caller, blockNumber, timestamp };
}

export function unwrap<T>(ctx: Context, unwrapFn: UnwrapFunc<T>): CallWith<T> {
  const baseCall = toBaseCall(ctx);
  const unwrapped = unwrapFn(ctx);
  return { ...baseCall, ...unwrapped };
}

 function toRemarkResult(value: string, base: BaseCall): RemarkResult {
  return {
    value,
    ...base
  };
}

 const processBatch = (calls: BatchArg[], base: BaseCall): RemarkResult[] => {
  const extra: ExtraCall[] = []
  return calls
  .map(justArg)
  .filter((call, index) => {
    if (hasBatchArgRemark(call)) {
      return true
    } else {
      extra.push({ ...calls[index] })
      return false
    }
  })
  .map(call => ({ value: valueOfArg(call), ...base, extra }))
}

type RemarkOrBatch = string | SubstrateExtrinsic;

export function extractExtra(ctx: Context): Transfer[] {
  if (isUtilityBatch(ctx.call.parent)) {
    return ctx.call.parent?.args.calls
    .filter(filterTransfers)
    .map(mapToSquidCall)
    .map(toBalanceTransfer)
  }

  return []
}

 export function extractRemark(processed: RemarkOrBatch, context: Context): RemarkResult[] {
  if (typeof processed === 'string') {
    if (startsWithRemark(processed)) {
      return [toRemarkResult(processed, toBaseCall(context))]
    } else {
      return []
    }
    
  }

  // if (isUtilityBatch(processed)) {
  //   if (hasBatchFailed(extrinsic.event)) {
  //     logger.warn('[BATCH] failed', extrinsic.block.height.toString())
  //     return [];
  //   }

  //   return processBatch(processed.args[0].value as BatchArg[], toBaseCall(extrinsic));
  // }

  return [];
}
