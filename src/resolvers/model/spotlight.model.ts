import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SpotlightEntity {
    @Field(() => String, { nullable: false })
    id!: string

    @Field(() => Number, { nullable: false })
    collections!: number

    @Field(() => Number, { nullable: false })
    unique!: number

    @Field(() => Number, { nullable: false })
    average!: number

    @Field(() => Number, { nullable: false })
    sold!: number

    @Field(() => Number, { nullable: false })
    total!: number

    constructor(props: Partial<SpotlightEntity>) {
        Object.assign(this, props);
    }
}