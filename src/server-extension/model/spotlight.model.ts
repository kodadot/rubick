import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SpotlightEntity {
    @Field(() => String, { nullable: false })
    id!: string

    @Field(() => Number, { nullable: false })
    collections!: number

    @Field(() => Number, { nullable: false })
    unique!: number

    @Field(() => BigInt, { nullable: true, defaultValue: 0n })
    average!: bigint

    @Field(() => Number, { nullable: false })
    sold!: number

    @Field(() => Number, { nullable: false, name: 'uniqueCollectors' })
    unique_collectors!: number

    @Field(() => BigInt, { nullable: true, defaultValue: 0n })
    volume!: bigint

    @Field(() => Number, { nullable: false })
    total!: number

    constructor(props: Partial<SpotlightEntity>) {
        Object.assign(this, props);
    }
}