import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "../marshal"
import {CollectionEntity} from "./collectionEntity.model"
import {Event} from "./event.model"
import {Emote} from "./emote.model"
import {MetadataEntity} from "./metadataEntity.model"

@Entity_()
export class NFTEntity {
  constructor(props?: Partial<NFTEntity>) {
    Object.assign(this, props)
  }

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: true})
  instance!: string | undefined | null

  @Column_("integer", {nullable: true})
  transferable!: number | undefined | null

  @Index_()
  @ManyToOne_(() => CollectionEntity, {nullable: false})
  collection!: CollectionEntity

  @Column_("text", {nullable: true})
  issuer!: string | undefined | null

  @Column_("text", {nullable: true})
  sn!: string | undefined | null

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  metadata!: string | undefined | null

  @Column_("text", {nullable: true})
  currentOwner!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  price!: bigint

  @Column_("bool", {nullable: false})
  burned!: boolean

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  blockNumber!: bigint | undefined | null

  @OneToMany_(() => Event, e => e.nft)
  events!: Event[]

  @OneToMany_(() => Emote, e => e.nft)
  emotes!: Emote[]

  @Index_()
  @ManyToOne_(() => MetadataEntity, {nullable: true})
  meta!: MetadataEntity | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("timestamp with time zone", {nullable: false})
  updatedAt!: Date
}
