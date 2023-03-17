import { Arg, Query, Resolver, FieldResolver, Root } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity, Interaction } from '../../model/generated'
import { SeriesEntity } from '../model/series.model'
import { HistoryEntity } from "../model/event.model";
import { collectionEventHistory } from "../query/event";
import { makeQuery, toSqlInParams } from "../utils";

enum OrderBy {
  volume = 'volume',
  unique = 'unique',
  unique_collectors = 'unique_collectors',
  sold = 'sold',
  total = 'total',
  average_price = 'average_price',
  floor_price = 'floor_price',
  highest_sale = 'highest_sale',
  buys = 'buys',
}

enum OrderDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

enum DateRange {
  DAY = '24 HOUR',
  WEEK = '7 DAY',
  TWO_WEEK = '14 DAY',
  MONTH = '30 DAY',
  QUARTER = '90 DAY',
  HALF_YEAR = '180 DAY',
  ALL_DAY = 'ALL DAY'
}

type CollectionIDs = string[]
@Resolver(of => SeriesEntity)
export class SeriesResolver {
  constructor(private tx: () => Promise<EntityManager>) { }

  // TODO: calculate score sold * (unique / total)
  @Query(() => [SeriesEntity])
  async seriesInsightTable(
    @Arg('limit', { nullable: true, defaultValue: null }) limit: number,
    @Arg('offset', { nullable: true, defaultValue: null }) offset: string,
    @Arg('orderBy', { nullable: true, defaultValue: 'total' }) orderBy: OrderBy,
    @Arg('orderDirection', { nullable: true, defaultValue: 'DESC' }) orderDirection: OrderDirection,
    @Arg('dateRange', { nullable: false, defaultValue: '7 DAY' }) dateRange: DateRange,
  ): Promise<SeriesEntity[]> {
    const computedDateRange = dateRange === 'ALL DAY'
      ? ''
      : `AND e.timestamp >= NOW() - INTERVAL '${dateRange}'`
    const query = `SELECT
        ce.id, ce.name, ce.meta_id as metadata, me.image, ce.issuer, 
        COUNT(distinct ne.meta_id) as unique, 
        COUNT(distinct ne.current_owner) as unique_collectors, 
        COUNT(distinct ne.current_owner) as sold, 
        COUNT(ne.*) as total, 
        AVG(ne.price) as average_price, 
        MIN(NULLIF(ne.price, 0)) as floor_price, 
        COALESCE(MAX(e.meta::decimal), 0) as highest_sale,
        COALESCE(SUM(e.meta::decimal), 0) as volume, 
        COUNT(e.*) as buys 
      FROM collection_entity ce 
      LEFT JOIN metadata_entity me on ce.meta_id = me.id 
      LEFT JOIN nft_entity ne on ce.id = ne.collection_id 
      JOIN event e on ne.id = e.nft_id
      WHERE e.interaction = 'BUY' ${computedDateRange}
      GROUP BY ce.id, me.image, ce.name 
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT ${limit} OFFSET ${offset}`
    const result: SeriesEntity[] = await makeQuery(this.tx, NFTEntity, query)

    return result
  }

  @Query(() => [HistoryEntity])
  async seriesInsightBuyHistory(
    @Arg('ids', () => [String!], { nullable: false }) ids: CollectionIDs,
    @Arg('dateRange', { nullable: false, defaultValue: '7 DAY' }) dateRange: DateRange,
  ) {
    const idList = toSqlInParams(ids)
    const computedDateRange = dateRange === 'ALL DAY'
      ? ''
      : `AND e.timestamp >= NOW() - INTERVAL '${dateRange}'`
    const manager = await this.tx()
    const result = await manager
      .getRepository(NFTEntity)
      .query(collectionEventHistory(idList, computedDateRange))
    return result
  }

}
