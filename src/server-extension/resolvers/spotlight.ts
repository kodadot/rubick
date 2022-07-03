import { Arg, Query, Resolver, FieldResolver, Root } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { HistoryEntity } from "../model/event.model";
import { SpotlightEntity } from '../model/spotlight.model'
import { spotlightSoldHistory } from "../query/spotlight";
import {toSqlInParams} from "../utils";

enum OrderBy {
  sold = 'sold',
  total = 'total',
  volume = 'volume',
  unique = 'unique',
  average = 'average',
  collections = 'collections',
  unique_collectors = 'unique_collectors',
  score = 'score'
}

enum OrderDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

@Resolver(of => SpotlightEntity)
export class SpotlightResolver {
  constructor(private tx: () => Promise<EntityManager>) { }

  @Query(() => [SpotlightEntity])
  async spotlightTable(
      @Arg('limit', { nullable: true, defaultValue: null }) limit: number,
      @Arg('offset', { nullable: true, defaultValue: null }) offset: string,
      @Arg('orderBy', { nullable: true, defaultValue: 'total' }) orderBy: OrderBy,
      @Arg('orderDirection', { nullable: true, defaultValue: 'DESC' }) orderDirection: OrderDirection,
      @Arg('passionList', { nullable: true, defaultValue: null }) passionList: string
  ): Promise<SpotlightEntity[]> {
    let tmpPassionList: string[] = []
    try {
      tmpPassionList = JSON.parse(passionList)
      if (!Array.isArray(tmpPassionList)) {
        throw new Error("not array")
      }
      if (tmpPassionList.some(passion => typeof passion !== "string")) {
        throw new Error("not string array")
      }
    } catch {
      console.error("Invalid passionList")
    }
    const whereCondition = tmpPassionList && tmpPassionList.length > 0
        ? `AND ne.issuer in (${toSqlInParams(tmpPassionList)})`
        : ''
    const query = `SELECT
       issuer as id, COUNT(distinct collection_id) as collections,
       COUNT(distinct meta_id) as unique, AVG(price) as average,
       COUNT(*) as total, COUNT(distinct ne.current_owner) as unique_collectors,
       SUM(CASE WHEN ne.issuer <> ne.current_owner THEN 1 ELSE 0 END) as sold,
       COALESCE(SUM(e.meta::bigint), 0) as volume,
       SUM(CASE WHEN ne.issuer <> ne.current_owner THEN 1 ELSE 0 END) * COUNT(distinct meta_id) / COUNT(*) as score
      FROM nft_entity ne
      JOIN event e on e.nft_id = ne.id 
      WHERE 
        e.interaction = 'BUY'
        ${whereCondition}
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
