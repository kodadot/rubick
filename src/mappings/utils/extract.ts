import { Vec } from '@polkadot/types';
import { Call as TCall } from "@polkadot/types/interfaces";
import { EventRecord, Event } from '@polkadot/types/interfaces';
import { ExtrinsicContext, SubstrateExtrinsic, EventInfo, SubstrateEvent } from '@subsquid/hydra-common'
import { Context } from './types';
const PREFIXES = ['0x726d726b', '0x524d524b']
// import { encodeAddress } from "@polkadot/util-crypto";

export type ExtraCall = {
  section: string;
  method: string;
  args: string[];
}

export interface RemarkResult extends BaseCall {
  value: string;
  extra?: ExtraCall[];
}

export interface RemarkResultEntity extends RemarkResult {
  id: string;
}

export interface BaseCall {
  caller: string;
  blockNumber: string;
  timestamp: Date;
}

export const startsWithRemark = (value: string, prefixes: string[] = PREFIXES): boolean => (prefixes.length < 1 || prefixes.some((word) => value.startsWith(word)))

export const isSystemRemark = (call: SubstrateExtrinsic | TCall, prefixes: string[] = PREFIXES): boolean =>
  call.section === "system" &&
  call.method === "remark" &&
  startsWithRemark(call.args.toString(), prefixes)

export const isUtilityBatch = (call: SubstrateExtrinsic) =>
  call.section === "utility" &&
  (call.method === "batch" || call.method === "batchAll");

  export const isBatchInterrupted = (
    records: EventRecord[],
    extrinsicIndex?: number
  ): boolean => {
    const events = records.filter(
      ({ phase, event }) =>
        phase.isApplyExtrinsic &&
        // phase.asApplyExtrinsic.eq(extrinsicIndex) &&
        hasBatchFailed(event)
    );
  
    return Boolean(events.length);
  };

const hasBatchFailed = (event: SubstrateEvent | Event): boolean => {
  const { method } = event;
  return method.toString() === "BatchInterrupted" || method.toString() === "ExtrinsicFailed";
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

export function toBaseCall(extrinsic: ExtrinsicContext): BaseCall {
  const caller = extrinsic.extrinsic.signer.toString();
  const blockNumber = extrinsic.block.height.toString();
  const timestamp = new Date(extrinsic.block.timestamp);

  return { caller, blockNumber, timestamp };
}


export function toRemarkResult(value: string, base: BaseCall): RemarkResult {
  return {
    value,
    ...base
  };
}

export const getRemarksFrom = (extrinsic: ExtrinsicContext): RemarkResult[] => {
  if (!extrinsic.extrinsic.indexInBlock) {
    return []
  }

  const signer = extrinsic.extrinsic.signer.toString();
  const blockNumber = extrinsic.block.height.toString();
  const timestamp = new Date(extrinsic.block.timestamp);

  if (isSystemRemark(extrinsic.extrinsic)) {
    return [{
      value: extrinsic.extrinsic.args.toString(),
      caller: signer,
      blockNumber,
      timestamp
    }]
  }

  if (isUtilityBatch(extrinsic.extrinsic)) {
    // if (isBatchInterrupted(extrinsic.block.events)) {
    //   return [];
    // }

    console.log('is utility batch', JSON.stringify(extrinsic.extrinsic.args, null, 2))

    // return processBatch(extrinsic.extrinsic.args[0] as unknown as TCall[], signer, blockNumber, timestamp)
  }

  return [];
}


export const processBatch = (calls: TCall[], base: BaseCall): RemarkResult[] => {
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
