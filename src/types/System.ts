import {create} from './_registry'
import {Bytes} from '@polkadot/types'
import {SubstrateExtrinsic} from '@subsquid/hydra-common'

export namespace System {
  /**
   * Make some on-chain remark.
   * 
   * # <weight>
   * - `O(1)`
   * # </weight>
   */
  export class RemarkCall {
    private _extrinsic: SubstrateExtrinsic

    constructor(extrinsic: SubstrateExtrinsic) {
      this._extrinsic = extrinsic
    }

    get remark(): Bytes {
      return create('Bytes', this._extrinsic.args[0].value)
    }
  }
}
