import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CollectorEntity {
    @Field(() => String, { nullable: false })
    id!: string

    @Field(() => String, { nullable: false })
    name!: string
    
    @Field(() => Number, { nullable: false, name: 'uniqueCollectors' })
    unique_collectors!: number
    
    @Field(() => Number, { nullable: false })
    collections!: number

    @Field(() => Number, { nullable: false })
    unique!: number

    @Field(() => BigInt, { nullable: true,  })
    average!: bigint

    @Field(() => BigInt, { nullable: true, defaultValue: 0n,   })
    volume!: bigint

    @Field(() => Number, { nullable: true, defaultValue: 0n,  })
    total!: number

    @Field(() => BigInt, { nullable: true, defaultValue: 0n,  })
    max!: bigint

    constructor(props: Partial<CollectorEntity>) {
        Object.assign(this, props);
    }
}
