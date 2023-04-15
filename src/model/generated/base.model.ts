import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {BaseType} from "./_baseType"
import {MetadataEntity} from "./metadataEntity.model"
import {Part} from "./part.model"
import {Theme} from "./theme.model"
import {BaseEvent} from "./_baseEvent"

@Entity_()
export class Base {
    constructor(props?: Partial<Base>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 5, nullable: false})
    type!: BaseType

    @Column_("text", {nullable: false})
    symbol!: string

    @Column_("text", {nullable: false})
    issuer!: string

    @Column_("text", {nullable: false})
    currentOwner!: string

    @Index_()
    @ManyToOne_(() => MetadataEntity, {nullable: true})
    meta!: MetadataEntity | undefined | null

    @Column_("text", {nullable: true})
    metadata!: string | undefined | null

    @OneToMany_(() => Part, e => e.base)
    parts!: Part[]

    @OneToMany_(() => Theme, e => e.base)
    themes!: Theme[]

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new BaseEvent(undefined, marshal.nonNull(val)))}, nullable: true})
    events!: (BaseEvent)[] | undefined | null
}
