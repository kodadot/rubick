import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class RemarkEntity {
  constructor(props?: Partial<RemarkEntity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  value!: string

  @Column_("text", {nullable: false})
  caller!: string

  @Column_("text", {nullable: false})
  blockNumber!: string

  @Column_("text", {nullable: true})
  interaction!: string | undefined | null
}
