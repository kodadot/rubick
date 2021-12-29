import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../generated/model'
import { SeriesEntity } from './model/series.model'

@Resolver()
export class SeriesResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  // TODO: calculate score sold * (unique / total)
  @Query(() => [SeriesEntity])
  async seriesInsightTable(
    @Arg('limit', { nullable: true }) limit: number,
    @Arg('offset', { nullable: true }) offset: string,
  ): Promise<SeriesEntity[]> {
    const manager = await this.tx()
    const result: SeriesEntity[] = await manager.getRepository(NFTEntity)
      .query(`
      SELECT
       collection_id as id, COUNT(distinct meta_id) as unique,
       COUNT(distinct current_owner) as unique_collectors, COUNT(distinct current_owner) as sold,
       COUNT(*) as total, AVG(price) as average_price, MIN(price) as floor_price
       FROM nft_entity 
       GROUP BY collection_id 
       ORDER BY total DESC 
       LIMIT $1 OFFSET $2;
    `, [limit, offset])

    return result
  }
}
