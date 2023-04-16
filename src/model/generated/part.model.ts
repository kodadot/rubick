import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Base} from "./base.model"
import {MetadataEntity} from "./metadataEntity.model"
import {PartType} from "./_partType"

@Entity_()
export class Part {
    constructor(props?: Partial<Part>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    name!: string

    @Index_()
    @ManyToOne_(() => Base, {nullable: true})
    base!: Base

    @Column_("text", {array: true, nullable: true})
    equippable!: (string)[] | undefined | null

    @Column_("text", {nullable: true})
    metadata!: string | undefined | null

    @Index_()
    @ManyToOne_(() => MetadataEntity, {nullable: true})
    meta!: MetadataEntity | undefined | null

    @Column_("text", {nullable: true})
    src!: string | undefined | null

    @Column_("text", {nullable: true})
    thumb!: string | undefined | null

    @Column_("varchar", {length: 5, nullable: false})
    type!: PartType

    @Column_("int4", {nullable: true})
    z!: number | undefined | null
}
