import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {NFTEntity} from "./nftEntity.model"

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

    @Column_("text", {nullable: false})
    caller!: string

    @Column_("text", {nullable: false})
    value!: string

    @Column_("text", {nullable: false})
    version!: string
}
