import { Arg, Field, ObjectType, Query, Resolver, FieldResolver, Root } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { HistoryEntity } from "../model/event.model";
import { SpotlightEntity } from '../model/spotlight.model'
import { spotlightSoldHistory } from "../query/spotlight";

enum OrderBy {
  sold = 'sold',
  total = 'total',
  volume = 'volume',
  unique = 'unique',
  average = 'average',
  collections = 'collections',
  unique_collectors = 'unique_collectors',
}

enum OrderDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

@Resolver(of => SpotlightEntity)
export class SpotlightResolver {
  constructor(private tx: () => Promise<EntityManager>) { }

  // TODO: calculate score sold * (unique / total)
  @Query(() => [SpotlightEntity])
  async spotlightTable(
    @Arg('limit', { nullable: true, defaultValue: null }) limit: number,
    @Arg('offset', { nullable: true, defaultValue: null }) offset: string,
    @Arg('orderBy', { nullable: true, defaultValue: 'total' }) orderBy: OrderBy,
    @Arg('orderDirection', { nullable: true, defaultValue: 'DESC' }) orderDirection: OrderDirection
  ): Promise<SpotlightEntity[]> {
    const query = `SELECT
       issuer as id, COUNT(distinct collection_id) as collections,
       COUNT(distinct meta_id) as unique, AVG(price) as average,
       COUNT(*) as total, COUNT(distinct ne.current_owner) as unique_collectors,
       SUM(CASE WHEN ne.issuer <> ne.current_owner THEN 1 ELSE 0 END) as sold,
       COALESCE(SUM(e.meta::decimal), 0) as volume
      FROM nft_entity ne
      JOIN event e on e.nft_id = ne.id WHERE e.interaction = 'BUY'
      GROUP BY issuer
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT $1 OFFSET $2`
    const manager = await this.tx()
    const result: SpotlightEntity[] = await manager.getRepository(NFTEntity)
      .query(query, [limit, offset])

    return result
  }

  @FieldResolver(() => [HistoryEntity])
  async soldHistory(@Root() spotlight: SpotlightEntity) {

    const manager = await this.tx()
    return await manager
      .getRepository(NFTEntity)
      .query(spotlightSoldHistory, [spotlight.id])
  }
}
