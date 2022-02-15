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
    return this.ctx._chain.getCallHash('system.remark') === '92bf52de53c90869d52bdcfb2cda31af9f36f74a1f69a308609cbab49a94ec38'
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
