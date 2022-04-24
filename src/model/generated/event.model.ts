import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Interaction} from "./_interaction"
import {NFTEntity} from "./nftEntity.model"

@Entity_()
export class Event {
  constructor(props?: Partial<Event>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  blockNumber!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Column_("text", {nullable: false})
  caller!: string

  @Column_("text", {nullable: false})
  currentOwner!: string

  @Column_("varchar", {length: 12, nullable: false})
  interaction!: Interaction

  @Column_("text", {nullable: false})
  meta!: string

  @Index_()
  @ManyToOne_(() => NFTEntity, {nullable: false})
  nft!: NFTEntity
}
