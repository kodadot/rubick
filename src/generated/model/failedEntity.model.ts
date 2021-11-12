import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class FailedEntity {
  constructor(props?: Partial<FailedEntity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  value!: string

  @Column_("text", {nullable: false})
  reason!: string

  @Column_("text", {nullable: true})
  interaction!: string | undefined | null
}
