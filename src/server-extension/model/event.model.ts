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
  @Field(() => String)
  id!: string

  @Field(() => Date)
  date!: Date

  @Field(() => Number)
  count!: number
}

@ObjectType()
export class LastEventEntity {
  @Field(() => String, { nullable: false })
  id!: String

  @Field(() => String, { nullable: false })
  name!: String

  @Field(() => String, { nullable: false })
  issuer!: String

  @Field(() => String, { nullable: false })
  timestamp!: String

  @Field(() => String, { nullable: false })
  metadata!: String

  @Field(() => String, { nullable: false })
  value!: String

  @Field(() => String, { nullable: false, name: 'currentOwner'})
  current_owner!: String

  @Field(() => String, { nullable: true })
  image!: String

  constructor(props: Partial<LastEventEntity>) {
    Object.assign(this, props);
  }
}