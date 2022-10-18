import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AccountEntity} from "./accountEntity.model"
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

  @Index_()
  @ManyToOne_(() => AccountEntity, {nullable: true})
  caller!: AccountEntity | undefined | null

  @Index_()
  @ManyToOne_(() => AccountEntity, {nullable: true})
  currentOwner!: AccountEntity | undefined | null

  @Column_("varchar", {length: 12, nullable: false})
  interaction!: Interaction

  @Column_("text", {nullable: false})
  meta!: string

  @Index_()
  @ManyToOne_(() => NFTEntity, {nullable: true})
  nft!: NFTEntity
}
