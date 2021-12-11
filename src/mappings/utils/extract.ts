import { Vec } from '@polkadot/types';
import { Call as TCall } from "@polkadot/types/interfaces";
import { Event as TEvent } from '@polkadot/types/interfaces';
import { ExtrinsicContext, SubstrateExtrinsic, SubstrateEvent } from '@subsquid/hydra-common'
const PREFIXES = ['0x726d726b', '0x524d524b']


 export type ExtraCall = {
  section: string;
  method: string;
  args: string[];
}

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

//  const isUtilityBatch = (call: SubstrateExtrinsic) =>
//   call.section === "utility" &&
//   (call.method === "batch" || call.method === "batchAll");

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

 const processBatch = (calls: TCall[], base: BaseCall): RemarkResult[] => {
  const extra: ExtraCall[] = []
  return calls
  .filter(call => {
    if (isSystemRemark(call)) {
      return true
    } else {
      extra.push({ section: call.section, method: call.method, args: call.args.toString().split(',') })
      return false
    }
  })
  .map(call => ({ value: call.args.toString(), ...base, extra }))
}

type RemarkOrBatch = string | Vec<TCall>;

 export function extractRemark(processed: RemarkOrBatch, extrinsic: ExtrinsicContext): RemarkResult[] {
  if (typeof processed === 'string' && startsWithRemark(processed)) {
    return [toRemarkResult(processed, toBaseCall(extrinsic))]
  }

  if (Array.isArray(processed)) {
    if (hasBatchFailed(extrinsic.event)) {
      return [];
    }

    return processBatch(processed, toBaseCall(extrinsic));
  }

  return [];
}
