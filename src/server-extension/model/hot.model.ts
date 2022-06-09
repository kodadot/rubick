import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HotNFTEntity {
    @Field(() => String, { nullable: false })
    timestamp!: string

    @Field(() => String, { nullable: true, defaultValue: 0n })
    meta!: string

    @Field(() => String, { nullable: false, name: "collectionName" })
    collection_name!: string

    @Field(() => String, { nullable: false, name: "collectionId" })
    collection_id!: string

    constructor(props: Partial<HotNFTEntity>) {
        Object.assign(this, props);
    }
}