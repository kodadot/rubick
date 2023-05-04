import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ChildItemEntity {
    @Field(() => String, { nullable: false })
    id!: string

    @Field(() => String, { nullable: true, defaultValue: '' })
    name!: string

    @Field(() => String, { nullable: true, defaultValue: '' })
    image!: string

    @Field(() => String, { nullable: true, defaultValue: '' })
    media!: string

    @Field(() => Boolean, { nullable: false })
    pending!: boolean

    @Field(() => String, { nullable: true, defaultValue: '', name: 'resourceMetadata' })
    resource_metadata!: string

    @Field(() => String, { nullable: true, defaultValue: '', name: 'resourceSrc' })
    resource_src!: string

    @Field(() => String, { nullable: true, defaultValue: '', name: 'resourceThumb' })
    resource_thumb!: string

    @Field(() => String, { nullable: true })
    z!: string

    constructor(props: Partial<ChildItemEntity>) {
        Object.assign(this, props);
    }
}
