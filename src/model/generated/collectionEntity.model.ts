import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {CollectionEvent} from "./_collectionEvent"
import {MetadataEntity} from "./metadataEntity.model"
import {NFTEntity} from "./nftEntity.model"

@Entity_()
export class CollectionEntity {
    constructor(props?: Partial<CollectionEntity>) {
        Object.assign(this, props)
    }

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    blockNumber!: bigint | undefined | null

    @Column_("bool", {nullable: false})
    burned!: boolean

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("text", {nullable: true})
    currentOwner!: string | undefined | null

    @Column_("int4", {nullable: false})
    distribution!: number

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new CollectionEvent(undefined, marshal.nonNull(val)))}, nullable: true})
    events!: (CollectionEvent)[] | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    floor!: bigint

    @Index_({unique: true})
    @Column_("text", {nullable: false})
    hash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    highestSale!: bigint

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    image!: string | undefined | null

    @Column_("text", {nullable: true})
    issuer!: string | undefined | null

    @Column_("bool", {nullable: false})
    lewd!: boolean

    @Column_("int4", {nullable: false})
    max!: number

    @Column_("text", {nullable: true})
    media!: string | undefined | null

    @Index_()
    @ManyToOne_(() => MetadataEntity, {nullable: true})
    meta!: MetadataEntity | undefined | null

    @Column_("text", {nullable: true})
    metadata!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Column_("int4", {nullable: false})
    nftCount!: number

    @OneToMany_(() => NFTEntity, e => e.collection)
    nfts!: NFTEntity[]

    @Column_("int4", {nullable: false})
    ownerCount!: number

    @Column_("int4", {nullable: false})
    supply!: number

    @Column_("text", {nullable: false})
    symbol!: string

    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date

    @Column_("text", {nullable: false})
    version!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    volume!: bigint
}
