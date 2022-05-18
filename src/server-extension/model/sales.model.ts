import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SaleNftEntity {
    @Field(() => String, { nullable: false })
    id!: string

    @Field(() => String)
    name!: string

    @Field(() => String, { nullable: false })
    issuer!: string

    @Field(() => String, { nullable: false })
    buyer!: string

    @Field(() => String, { nullable: false, name: 'collectionId'})
    collection_id!: string

    @Field(() => String, { nullable: false, name: 'collectionName'})
    collection_name!: string

    @Field(() => BigInt, { nullable: false, name: 'salePrice' })
    sale_price!: bigint

    @Field(() => String, { nullable: false, name: 'blockNumber' })
    block_number!: string

    @Field(() => String, { nullable: false })
    timestamp!: string

    @Field(() => String, { nullable: true })
    image!: string

    constructor(props: Partial<SaleNftEntity>) {
        Object.assign(this, props);
    }
}