import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HotNFTEntity {
    @Field(() => Date, { nullable: false })
    timestamp!: Date

    @Field(() => String, { nullable: true })
    meta!: string

    @Field(() => String, { nullable: false, name: "collectionName" })
    collection_name!: string

    @Field(() => String, { nullable: false, name: "collectionId" })
    collection_id!: string

    constructor(props: Partial<HotNFTEntity>) {
        Object.assign(this, props);
    }
}