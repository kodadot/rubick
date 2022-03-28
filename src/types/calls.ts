import assert from 'assert'
import {CallContext, Result, deprecateLatest} from './support'

export class SystemRemarkCall {
  constructor(private ctx: CallContext) {
    assert(this.ctx.extrinsic.name === 'system.remark')
  }

  /**
   *  Make some on-chain remark.
   */
  get isV1020(): boolean {
    return this.ctx._chain.getCallHash('system.remark') === 'f4e9b5b7572eeae92978087ece9b4f57cb5cab4f16baf5625bb9ec4a432bad63'
  }

  /**
   *  Make some on-chain remark.
   */
  get asV1020(): {remark: Uint8Array} {
    assert(this.isV1020)
    return this.ctx._chain.decodeCall(this.ctx.extrinsic)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1020
  }

  get asLatest(): {remark: Uint8Array} {
    deprecateLatest()
    return this.asV1020
  }
}
