import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {CollectionEntity} from "./collectionEntity.model"
import {NFTEntity} from "./nftEntity.model"
import {Event} from "./event.model"
import {Emote} from "./emote.model"

@Entity_()
export class AccountEntity {
  constructor(props?: Partial<AccountEntity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  lastUpdateBlock!: number

  @OneToMany_(() => CollectionEntity, e => e.currentOwner)
  collections!: CollectionEntity[]

  @OneToMany_(() => NFTEntity, e => e.currentOwner)
  nfts!: NFTEntity[]

  @OneToMany_(() => Event, e => e.caller)
  events!: Event[]

  @OneToMany_(() => Emote, e => e.caller)
  emotes!: Emote[]

  @Column_("text", {nullable: true})
  avatar!: string | undefined | null

  @Column_("text", {nullable: true})
  handle!: string | undefined | null

  @Column_("text", {nullable: true})
  background!: string | undefined | null
}
