import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class EmoteCountEntity {
    @Field(() => String, { nullable: false })
    id!: string

    @Field(() => Number, { nullable: false, name: 'value' })
    count!: number

    constructor(props: Partial<EmoteCountEntity>) {
        Object.assign(this, props);
    }
}