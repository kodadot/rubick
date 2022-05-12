import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class EventEntity {
  @Field(() => Date, { nullable: false })
  date!: Date

  @Field(() => BigInt, { nullable: true, defaultValue: 0n })
  max!: bigint

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  count!: number

  constructor(props: Partial<EventEntity>) {
    Object.assign(this, props);
}
}

@ObjectType()
export class HistoryEntity {
  @Field(() => Date)
  date!: Date

  @Field(() => Number)
  count!: number
}

@ObjectType()
export class TokenEventEntity {
  @Field(() => String, { nullable: false })
  id!: string

  @Field(() => String, { nullable: true })
  name!: string
  
  @Field(() => Date, { nullable: false })
  date!: Date

  @Field(() => String, { nullable: true, defaultValue: '' })
  meta!: string

  @Field(() => String, { nullable: true, defaultValue: '' })
  image!: string
  
  @Field(() => String, { nullable: false })
  issuer!: string

  @Field(() => String,{ nullable: false })
  caller!: string
}