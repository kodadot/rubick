import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Event } from '../../model/generated'
import { EventEntity } from '../model/event.model'
import { buyEvent } from '../query/event'


@Resolver()
export class CollectionEventResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [EventEntity])
  async collectionBuyEventStatsById(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<EventEntity[]> {
    const result: EventEntity[] = await this.genericEventQuery(buyEvent, id)
    return result
  }

  async genericEventQuery(query: string, id: string): Promise<EventEntity[]> {
    const manager = await this.tx()
    const repository = manager.getRepository(Event)

    const result: EventEntity[] = await repository.query(query, [id])
    return result
  }
}
