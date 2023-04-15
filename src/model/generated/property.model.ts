import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {NFTEntity} from "./nftEntity.model"

@Entity_()
export class Property {
    constructor(props?: Partial<Property>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    key!: string

    @Column_("text", {nullable: false})
    value!: string

    @Column_("text", {nullable: false})
    type!: string

    @Column_("bool", {nullable: false})
    mutable!: boolean

    @Index_()
    @ManyToOne_(() => NFTEntity, {nullable: true})
    nft!: NFTEntity
}
