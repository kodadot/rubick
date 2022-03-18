import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Event } from '../../model/generated'
import { EventEntity } from '../model/event.model'
import { maxBuyEvent, totalBuyEvent } from '../query/event'


@Resolver()
export class CollectionEventResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [EventEntity])
  async collectionMaxBuyEventById(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<EventEntity[]> {
    const result: EventEntity[] = await this.genericEventQuery(maxBuyEvent, id)
    return result
  }

  @Query(() => [EventEntity])
  async collectionTotalBuyEventById(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<EventEntity[]> {
    const result: EventEntity[] = await this.genericEventQuery(totalBuyEvent, id)
    return result
  }

  async genericEventQuery(query: string, id: string): Promise<EventEntity[]> {
    const manager = await this.tx()
    const repository = manager.getRepository(Event)

    const result: EventEntity[] = await repository.query(query, [id])
    return result
  }
}
