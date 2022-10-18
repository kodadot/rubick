import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {AccountEntity} from "./accountEntity.model"

@Entity_()
export class RemarkEntity {
  constructor(props?: Partial<RemarkEntity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  value!: string

  @Index_()
  @ManyToOne_(() => AccountEntity, {nullable: true})
  caller!: AccountEntity | undefined | null

  @Column_("text", {nullable: false})
  blockNumber!: string

  @Column_("text", {nullable: true})
  interaction!: string | undefined | null
}
