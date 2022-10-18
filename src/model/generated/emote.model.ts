import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {NFTEntity} from "./nftEntity.model"
import {AccountEntity} from "./accountEntity.model"

@Entity_()
export class Emote {
  constructor(props?: Partial<Emote>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => NFTEntity, {nullable: true})
  nft!: NFTEntity

  @Index_()
  @ManyToOne_(() => AccountEntity, {nullable: true})
  caller!: AccountEntity | undefined | null

  @Column_("text", {nullable: false})
  value!: string
}
