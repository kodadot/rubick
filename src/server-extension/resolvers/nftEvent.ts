import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Event as EventEntity, Interaction } from '../../model/generated'
import { TokenEventEntity } from '../model/event.model'
import { nftEventList } from '../query/event'
import { makeQuery } from '../utils'


@Resolver()
export class NFTEventResolver {
  constructor(private tx: () => Promise<EntityManager>) {}


  @Query(() => [TokenEventEntity])
  async nftEventListByType(
    @Arg('type', { nullable: false }) type: Interaction,
    @Arg('limit', { nullable: true, defaultValue: null }) limit: number,
  ): Promise<TokenEventEntity[]> {
    const result: TokenEventEntity[] = await makeQuery(this.tx, EventEntity, nftEventList, [type, limit])
    return result
  }
}
