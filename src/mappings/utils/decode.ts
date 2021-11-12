import { RemarkResult } from './extract';
import NFTUtils from './NftUtils';
import { RMRK, RmrkEvent } from './types';

export function resolve(remark: RemarkResult) {
  try {
    const event: RmrkEvent = NFTUtils.getAction(remark.value)
    switch (event) {
      case RmrkEvent.MINT:
         function mint(remark: RemarkResult) {}
      case RmrkEvent.MINTNFT:
         function mintNFT(remark: RemarkResult) {}
      case RmrkEvent.SEND:
         function send(remark: RemarkResult) {}
      case RmrkEvent.BUY:
         function buy(remark: RemarkResult ) {}
      case RmrkEvent.CONSUME:
         function consume(remark: RemarkResult ) {}
      case RmrkEvent.LIST:
         function list(remark: RemarkResult ) {}
      case RmrkEvent.CHANGEISSUER:
         function changeIssuer(remark: RemarkResult ) {}
      case RmrkEvent.EMOTE:
         function appreciate(remark: RemarkResult ) {}
      default:
        throw new EvalError(`Unable to evaluate following string, ${remark.value}`)
    }
  } catch (e) {
    throw e
  }
}