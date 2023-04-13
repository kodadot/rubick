import { Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'

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
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => Hello)
  async hello(): Promise<Hello> {
    return new Hello(`Hey, this is you custom API extension`)
  }
}

export { CollectionChartResolver } from './collectionChart'
export { CollectionEventResolver } from './collectionEvent'
export { PassionFeedResolver } from './passionFeed'
export { SalesFeedResolver } from './salesFeed'
export { HotDashboardResolver } from './hotDashboard'
export { CountResolver } from './count'
export { EmoteResolver } from './emote'
export { EventResolver } from './event'
export { SeriesResolver } from './series'
export { SpotlightResolver } from './spotlight'
