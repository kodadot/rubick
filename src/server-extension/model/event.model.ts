import { Field, ObjectType, Int } from 'type-graphql';

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