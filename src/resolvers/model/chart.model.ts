import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ChartEntity {
  @Field(() => Date, { nullable: false })
  date!: Date

  @Field(() => Number, { nullable: false })
  value!: number

  constructor(props: Partial<ChartEntity>) {
    Object.assign(this, props);
}
}