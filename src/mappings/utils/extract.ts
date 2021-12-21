import { Vec } from '@polkadot/types';
import { Call as TCall } from "@polkadot/types/interfaces";
import { Event as TEvent } from '@polkadot/types/interfaces';
import { ExtrinsicContext, SubstrateExtrinsic, SubstrateEvent } from '@subsquid/hydra-common'
import logger from './logger';
import { BatchArg } from './types';
const PREFIXES = ['0x726d726b', '0x524d524b']


 export type ExtraCall = BatchArg

 export interface RemarkResult extends BaseCall {
  value: string;
  extra?: ExtraCall[];
}

 interface BaseCall {
  caller: string;
  blockNumber: string;
  timestamp: Date;
}

export type Records = RemarkResult[]

 const startsWithRemark = (value: string, prefixes: string[] = PREFIXES): boolean => (prefixes.length < 1 || prefixes.some((word) => value.startsWith(word)))

 const isSystemRemark = (call: SubstrateExtrinsic | TCall, prefixes: string[] = PREFIXES): boolean =>
  call.section === "system" &&
  call.method === "remark" &&
  startsWithRemark(call.args.toString(), prefixes)

 const isUtilityBatch = (call: SubstrateExtrinsic) =>
  call.section === "utility" &&
  (call.method === "batch" || call.method === "batchAll");

const justArg = (batchArg: BatchArg): Record<string, any> => batchArg.args

const isSytemRemarkHex = ({ callIndex }: BatchArg): boolean => callIndex === '0x0001'

const valueOfArg = (args: Record<string, any>): string => args.remark || args._remark

const hasBatchArgRemark = (args: Record<string, any>): boolean => {
  const call: string = valueOfArg(args)
  return Boolean(call) && startsWithRemark(call, PREFIXES)
}

const hasBatchFailed = (event: SubstrateEvent | TEvent): boolean => {
  const { method } = event;
  return method.toString() === "BatchInterrupted" || method.toString() === "ExtrinsicFailed";
}

 function toBaseCall(extrinsic: ExtrinsicContext): BaseCall {
  const caller = extrinsic.extrinsic.signer.toString();
  const blockNumber = extrinsic.block.height.toString();
  const timestamp = new Date(extrinsic.block.timestamp);

  return { caller, blockNumber, timestamp };
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

 export function extractRemark(processed: RemarkOrBatch, extrinsic: ExtrinsicContext): RemarkResult[] {
  if (typeof processed === 'string') {
    if (startsWithRemark(processed)) {
      return [toRemarkResult(processed, toBaseCall(extrinsic))]
    } else {
      return []
    }
    
  }

  if (isUtilityBatch(processed)) {
    if (hasBatchFailed(extrinsic.event)) {
      logger.warn('[BATCH] failed', extrinsic.block.height.toString())
      return [];
    }

    return processBatch(processed.args[0].value as BatchArg[], toBaseCall(extrinsic));
  }

  return [];
}
