import assert from "assert"
import * as marshal from "../marshal"

export class CollectionEvent {
  private _blockNumber!: bigint | undefined | null
  private _timestamp!: number | undefined | null
  private _caller!: string
  private _interaction!: string
  private _meta!: string

  constructor(props?: Partial<Omit<CollectionEvent, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._blockNumber = json.blockNumber == null ? undefined : marshal.bigint.fromJSON(json.blockNumber)
      this._timestamp = json.timestamp == null ? undefined : marshal.int.fromJSON(json.timestamp)
      this._caller = marshal.string.fromJSON(json.caller)
      this._interaction = marshal.string.fromJSON(json.interaction)
      this._meta = marshal.string.fromJSON(json.meta)
    }
  }

  get blockNumber(): bigint | undefined | null {
    return this._blockNumber
  }

  set blockNumber(value: bigint | undefined | null) {
    this._blockNumber = value
  }

  get timestamp(): number | undefined | null {
    return this._timestamp
  }

  set timestamp(value: number | undefined | null) {
    this._timestamp = value
  }

  get caller(): string {
    assert(this._caller != null, 'uninitialized access')
    return this._caller
  }

  set caller(value: string) {
    this._caller = value
  }

  get interaction(): string {
    assert(this._interaction != null, 'uninitialized access')
    return this._interaction
  }

  set interaction(value: string) {
    this._interaction = value
  }

  get meta(): string {
    assert(this._meta != null, 'uninitialized access')
    return this._meta
  }

  set meta(value: string) {
    this._meta = value
  }

  toJSON(): object {
    return {
      blockNumber: this.blockNumber == null ? undefined : marshal.bigint.toJSON(this.blockNumber),
      timestamp: this.timestamp,
      caller: this.caller,
      interaction: this.interaction,
      meta: this.meta,
    }
  }
}
