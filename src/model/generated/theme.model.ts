import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Base} from "./base.model"

@Entity_()
export class Theme {
    constructor(props?: Partial<Theme>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    name!: string

    @Index_()
    @ManyToOne_(() => Base, {nullable: true})
    base!: Base

    @Column_("text", {nullable: true})
    themeColor1!: string | undefined | null

    @Column_("text", {nullable: true})
    themeColor2!: string | undefined | null

    @Column_("text", {nullable: true})
    themeColor3!: string | undefined | null

    @Column_("text", {nullable: true})
    themeColor4!: string | undefined | null
}
