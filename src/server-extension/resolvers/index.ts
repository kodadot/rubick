import {Field, ObjectType, Query, Resolver} from "type-graphql"
import type {EntityManager} from "typeorm"
import { CountResolver } from './count'
import { SeriesResolver } from './series'
import { SpotlightResolver } from './spotlight'
import { CollectionChartResolver } from './collectionChart'

@ObjectType()
export class Hello {
  @Field(() => String, { nullable: false })
  greeting!: string

  constructor(greeting: string) {
    this.greeting = greeting
  }
}


@Resolver()
export class HelloResolver {
  constructor(
    private tx: () => Promise<EntityManager>
  ) {}

  @Query(() => Hello)
  async hello(): Promise<Hello> {
      return new Hello(`Hey, this is you custom API extension`)
  }
}

export {
  CollectionChartResolver,
  CountResolver,
  SeriesResolver,
  SpotlightResolver,
}
