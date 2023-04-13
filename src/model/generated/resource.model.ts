import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Base} from "./base.model"
import {MetadataEntity} from "./metadataEntity.model"
import {Part} from "./part.model"
import {NFTEntity} from "./nftEntity.model"

@Entity_()
export class Resource {
    constructor(props?: Partial<Resource>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Base, {nullable: true})
    base!: Base | undefined | null

    @Column_("text", {nullable: true})
    src!: string | undefined | null

    @Index_()
    @ManyToOne_(() => MetadataEntity, {nullable: true})
    meta!: MetadataEntity | undefined | null

    @Column_("text", {nullable: true})
    metadata!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Part, {nullable: true})
    slot!: Part | undefined | null

    @Column_("text", {nullable: true})
    thumb!: string | undefined | null

    @Column_("text", {array: true, nullable: true})
    parts!: (string)[] | undefined | null

    @Column_("int4", {nullable: false})
    priority!: number

    @Column_("bool", {nullable: false})
    pending!: boolean

    @Index_()
    @ManyToOne_(() => NFTEntity, {nullable: true})
    nft!: NFTEntity
}
