import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model'
import { ChildItemEntity } from '../model/child.model'
import { childItemsQuery } from '../query/nft'
import { makeQuery } from '../utils'



@Resolver()
export class ChildResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ChildItemEntity])
  async childListByNftId(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<ChildItemEntity[]> {
    const result: ChildItemEntity[] = await makeQuery(this.tx, NFTEntity, childItemsQuery, [id])
    return result
  }
}
