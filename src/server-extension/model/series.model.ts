import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SeriesEntity {
    @Field(() => String, { nullable: false })
    id!: string

    @Field(() => String, { nullable: false })
    issuer!: string

    @Field(() => Number, { nullable: false })
    unique!: number

    @Field(() => Number, { nullable: false, name: 'uniqueCollectors' })
    unique_collectors!: number

    @Field(() => Number, { nullable: false })
    sold!: number

    @Field(() => Number, { nullable: false })
    total!: number

    @Field(() => BigInt, { nullable: true, defaultValue: 0n, name: 'averagePrice' })
    average_price!: bigint

    @Field(() => BigInt, { nullable: true, defaultValue: 0n, name: 'floorPrice' })
    floor_price!: bigint

    @Field(() => BigInt, { nullable: true, defaultValue: 0n, name: 'highestSale' })
    highest_sale!: bigint

    @Field(() => Number, { nullable: true, defaultValue: 0 })
    buys!: number

    // @Field(() => Number, { nullable: true, defaultValue: 0 })
    // rank!: number

    @Field(() => BigInt, { nullable: true, defaultValue: 0n })
    volume!: bigint

    @Field(() => String, { nullable: false })
    name!: string

    @Field(() => String, { nullable: true })
    metadata!: string

    @Field(() => String, { nullable: true })
    image!: string

    constructor(props: Partial<SeriesEntity>) {
        Object.assign(this, props);
    }
}

//         dailyVolume: { $sum: '$dailyVolume' },
//         weeklyVolume: { $sum: '$weeklyVolume' },
//         monthlyVolume: { $sum: '$monthlyVolume' },
//         dailyrangeVolume: { $sum: '$dailyrangeVolume' },
//         weeklyrangeVolume: { $sum: '$weeklyrangeVolume' },
//         monthlyrangeVolume: { $sum: '$monthlyrangeVolume' },