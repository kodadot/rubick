import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "../marshal"
import {NFTEntity} from "./nFTEntity.model"
import {Event} from "./event"

@Entity_()
export class CollectionEntity {
  constructor(props?: Partial<CollectionEntity>) {
    Object.assign(this, props)
  }

  @Column_("text", {nullable: true})
  version!: string | undefined | null

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("integer", {nullable: true})
  max!: number | undefined | null

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

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new Event(undefined, val))}, nullable: true})
  events!: (Event | undefined | null)[] | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  blockNumber!: bigint | undefined | null
}
