import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "../marshal"
import {NFTEntity} from "./nFTEntity.model"
import {CollectionEvent} from "./collectionEvent"
import {MetadataEntity} from "./metadataEntity.model"

@Entity_()
export class CollectionEntity {
  constructor(props?: Partial<CollectionEntity>) {
    Object.assign(this, props)
  }

  @Column_("text", {nullable: true})
  version!: string | undefined | null

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("integer", {nullable: false})
  max!: number

  @Column_("text", {nullable: true})
  issuer!: string | undefined | null

  @Column_("text", {nullable: true})
  symbol!: string | undefined | null

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  metadata!: string | undefined | null

  @Column_("text", {nullable: true})
  currentOwner!: string | undefined | null

  @OneToMany_(() => NFTEntity, e => e.collection)
  nfts!: NFTEntity[]

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new CollectionEvent(undefined, marshal.nonNull(val)))}, nullable: true})
  events!: (CollectionEvent)[] | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  blockNumber!: bigint | undefined | null

  @Index_()
  @ManyToOne_(() => MetadataEntity, {nullable: true})
  meta!: MetadataEntity | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date
}
