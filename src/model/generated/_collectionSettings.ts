import assert from 'assert'
import * as marshal from './marshal'

export class CollectionSettings {
  private _value!: string | undefined | null
  private _startBlock!: bigint | undefined | null
  private _endBlock!: bigint | undefined | null
  private _price!: bigint | undefined | null

  constructor(props?: Partial<Omit<CollectionSettings, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._value = json.value == null ? undefined : marshal.string.fromJSON(json.value)
      this._startBlock = json.startBlock == null ? undefined : marshal.bigint.fromJSON(json.startBlock)
      this._endBlock = json.endBlock == null ? undefined : marshal.bigint.fromJSON(json.endBlock)
      this._price = json.price == null ? undefined : marshal.bigint.fromJSON(json.price)
    }
  }

  get value(): string | undefined | null {
    return this._value
  }

  set value(value: string | undefined | null) {
    this._value = value
  }

  get startBlock(): bigint | undefined | null {
    return this._startBlock
  }

  set startBlock(value: bigint | undefined | null) {
    this._startBlock = value
  }

  get endBlock(): bigint | undefined | null {
    return this._endBlock
  }

  set endBlock(value: bigint | undefined | null) {
    this._endBlock = value
  }

  get price(): bigint | undefined | null {
    return this._price
  }

  set price(value: bigint | undefined | null) {
    this._price = value
  }

  toJSON(): object {
    return {
      value: this.value,
      startBlock: this.startBlock == null ? undefined : marshal.bigint.toJSON(this.startBlock),
      endBlock: this.endBlock == null ? undefined : marshal.bigint.toJSON(this.endBlock),
      price: this.price == null ? undefined : marshal.bigint.toJSON(this.price),
    }
  }
}
