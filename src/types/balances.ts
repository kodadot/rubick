import {create} from './_registry'
import {AccountId32} from '@polkadot/types/interfaces'
import {u128} from '@polkadot/types'
import {SubstrateEvent} from '@subsquid/hydra-common'

export namespace Balances {
  /**
   * Transfer succeeded.
   */
  export class TransferEvent {
    constructor(private event: SubstrateEvent) {}

    get params(): [AccountId32, AccountId32, u128] {
      return [create('AccountId32', this.event.params[0].value), create('AccountId32', this.event.params[1].value), create('u128', this.event.params[2].value)]
    }
  }

}
