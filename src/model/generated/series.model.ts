import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Series {
  constructor(props?: Partial<Series>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  unique!: number

  @Column_("integer", {nullable: false})
  uniqueCollectors!: number

  @Index_()
  @Column_("integer", {nullable: false})
  sold!: number

  @Column_("integer", {nullable: false})
  total!: number

  @Column_("numeric", {nullable: true})
  averagePrice!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  floorPrice!: bigint | undefined | null

  @Column_("integer", {nullable: true})
  buys!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  volume!: bigint | undefined | null

  @Index_()
  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: true})
  metadata!: string | undefined | null

  @Column_("text", {nullable: true})
  image!: string | undefined | null
}
