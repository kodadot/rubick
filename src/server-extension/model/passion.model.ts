import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PassionFeedEntity {
    @Field(() => String)
    id!: string

    constructor(props: Partial<PassionFeedEntity>) {
        Object.assign(this, props);
    }
}