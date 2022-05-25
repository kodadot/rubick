import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { LastEventEntity } from '../model/event.model'
import { lastListEventQuery } from '../query/event'


@Resolver()
export class EventResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [LastEventEntity])
  async lastListEvent(
    @Arg('limit', { nullable: true }) limit: number,
    @Arg('offset', { nullable: true }) offset: number,
  ): Promise<LastEventEntity[]> {
    const result: LastEventEntity[] = await this.genericEventQuery(lastListEventQuery(limit, offset))
    return result
  }

  async genericEventQuery(query: string): Promise<LastEventEntity[]> {
    const manager = await this.tx()
    const repository = manager.getRepository(NFTEntity)

    const result: LastEventEntity[] = await repository.query(query)
    return result
  }
}
