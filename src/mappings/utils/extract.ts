import { Call as TCall } from "@polkadot/types/interfaces";
import { EventRecord } from '@polkadot/types/interfaces';
import { ExtrinsicContext, SubstrateExtrinsic, EventInfo } from '@subsquid/hydra-common'
const PREFIXES = ['0x726d726b', '0x524d524b']
// import { encodeAddress } from "@polkadot/util-crypto";

export type ExtraCall = {
  section: string;
  method: string;
  args: string[];
}

export interface RemarkResult {
  value: string;
  caller: string;
  blockNumber: string;
  timestamp: Date;
  extra?: ExtraCall[];
}

export interface RemarkResultEntity extends RemarkResult {
  id: string;
}

export const isSystemRemark = (call: SubstrateExtrinsic | TCall, prefixes: string[] = PREFIXES): boolean =>
  call.section === "system" &&
  call.method === "remark" &&
  (prefixes.length < 1 ||
    prefixes.some((word) => call.args.toString().startsWith(word)));

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
        (event.method.toString() === "BatchInterrupted" ||
          event.method.toString() === "ExtrinsicFailed")
    );
  
    return Boolean(events.length);
  };

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


export const processBatch = (calls: TCall[], caller: string, blockNumber: string, timestamp: Date): RemarkResult[] => {
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
  .map(call => ({ value: call.args.toString(), caller, blockNumber, timestamp, extra }))
}
