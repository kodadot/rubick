import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Collector {
  constructor(props?: Partial<Collector>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("integer", {nullable: false})
  unique!: number

  @Column_("integer", {nullable: false})
  uniqueCollectors!: number

  @Column_("integer", {nullable: false})
  collections!: number

  @Column_("integer", {nullable: false})
  total!: number

  @Column_("numeric", {nullable: true})
  average!: number | undefined | null

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  volume!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  max!: bigint | undefined | null
}
