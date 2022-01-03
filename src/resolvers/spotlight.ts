import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../generated/model'
import { SpotlightEntity } from './model/spotlight.model'

@Resolver()
export class SpotlightResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  // TODO: calculate score sold * (unique / total)
  @Query(() => [SpotlightEntity])
  async spotlightTable(
    @Arg('limit', { nullable: true }) limit: number,
    @Arg('offset', { nullable: true }) offset: string,
  ): Promise<SpotlightEntity[]> {
    const manager = await this.tx()
    const result: SpotlightEntity[] = await manager.getRepository(NFTEntity)
      .query(`
      SELECT
       issuer as id, COUNT(distinct collection_id) as collections, 
       COUNT(distinct meta_id) as unique, AVG(price) as average, 
       COUNT(*) as total, COUNT(distinct current_owner) as sold, 
       COALESCE(SUM(e.meta::bigint), 0) as volume 
       FROM nft_entity ne
       JOIN event e on e.nft_id = ne.id WHERE e.interaction = 'BUY'
       GROUP BY issuer 
       ORDER BY total DESC
       LIMIT $1 OFFSET $2;
    `, [limit, offset])

    return result
  }
}
