import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ChartEntity {
  @Field(() => Date, { nullable: false })
  date!: Date

  @Field(() => BigInt, { nullable: true, defaultValue: 0n })
  value!: bigint

  @Field(() => BigInt, { nullable: true, defaultValue: 0n })
  average!: bigint

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  count!: number

  constructor(props: Partial<ChartEntity>) {
    Object.assign(this, props);
}
}