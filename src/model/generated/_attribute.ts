import assert from "assert"
import * as marshal from "./marshal"

export class Attribute {
    private _display!: string | undefined | null
    private _trait!: string | undefined | null
    private _value!: string

    constructor(props?: Partial<Omit<Attribute, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._display = json.display == null ? undefined : marshal.string.fromJSON(json.display)
            this._trait = json.trait == null ? undefined : marshal.string.fromJSON(json.trait)
            this._value = marshal.string.fromJSON(json.value)
        }
    }

    get display(): string | undefined | null {
        return this._display
    }

    set display(value: string | undefined | null) {
        this._display = value
    }

    get trait(): string | undefined | null {
        return this._trait
    }

    set trait(value: string | undefined | null) {
        this._trait = value
    }

    get value(): string {
        assert(this._value != null, 'uninitialized access')
        return this._value
    }

    set value(value: string) {
        this._value = value
    }

    toJSON(): object {
        return {
            display: this.display,
            trait: this.trait,
            value: this.value,
        }
    }
}
