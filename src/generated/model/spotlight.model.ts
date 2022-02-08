import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, Index} from "typeorm"
import * as marshal from "../marshal"

@Entity_()
export class Spotlight {
  constructor(props?: Partial<Spotlight>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("integer", {nullable: false})
  collections!: number

  @Index_()
  @Column_("integer", {nullable: false})
  unique_collectors!: number

  @Index_()
  @Column_("integer", {nullable: false})
  unique!: number

  @Index_()
  @Column_("integer", {nullable: false})
  sold!: number

  @Index_()
  @Column_("integer", {nullable: false})
  total!: number

  @Index_()
  @Column_("text", {nullable: true})
  average!: string | undefined | null

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  volume!: bigint | undefined | null
}
