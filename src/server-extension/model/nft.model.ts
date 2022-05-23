import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FlippingNFT {
    @Field(() => String, { nullable: false, name: 'nftId' })
    nft_id!: string

    @Field(() => String, { nullable: false })
    author!: string

    @Field(() => Date, { nullable: false })
    date!: Date

    // @Field(() => String)
    // previous!: BigInt

    @Field(() => String, { nullable: false })
    current!: BigInt

    @Field(() => BigInt, { nullable: true, defaultValue: 0n, name: 'floorPrice' })
    floor_price!: bigint

    @Field(() => Number, { nullable: false })
    total!: number

    @Field(() => Number, { nullable: false, name: 'owners' })
    unique_collectors!: number

    @Field(() => BigInt, { name: 'emotes' })
    emote_count!: number

    constructor(props: Partial<FlippingNFT>) {
        Object.assign(this, props);
    }
}