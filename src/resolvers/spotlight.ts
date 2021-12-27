import { Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../generated/model'
import { SpotlightEntity } from './model/spotlight.model'

@Resolver()
export class SpotlightResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [SpotlightEntity])
  async spotlightTable(): Promise<SpotlightEntity[]> {
    const manager = await this.tx()
    const result: SpotlightEntity[] = await manager.getRepository(NFTEntity)
      .query(`
      SELECT issuer as id, COUNT(distinct collection_id) as collections, COUNT(distinct meta_id) as unique, avg(price) as avgerage, COUNT(*) as total, COUNT(distinct current_owner) as sold from nft_entity GROUP BY issuer;
    `)

    return result
  }
}
