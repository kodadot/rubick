import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CountEntity {
  @Field(() => Number, { nullable: false })
  total!: number

  constructor(totalCount: number) {
    this.total = totalCount
  }
}