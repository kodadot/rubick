
import {
  Arg,
  Query,
  Resolver,
} from "type-graphql";
import type { EntityManager } from "typeorm";
import { NFTEntity} from "../../model/generated";
import { CollectorEntity } from "../model/collector.model";
import { makeQuery } from "../utils";

enum OrderBy {
  name = "name",
  total = "total",
  average = "average",
  volume = "volume",
  max = "max",
}

enum OrderDirection {
  DESC = "DESC",
  ASC = "ASC",
}

@Resolver((of) => CollectorEntity)
export class CollectorResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [CollectorEntity])
  async collectorTable(
    @Arg("limit", { nullable: true, defaultValue: 20 }) limit: number,
    @Arg("offset", { nullable: true, defaultValue: 0 }) offset: string,
    @Arg("orderBy", { nullable: true, defaultValue: "total" }) orderBy: OrderBy,
    @Arg("orderDirection", { nullable: true, defaultValue: "DESC" })
    orderDirection: OrderDirection
  ): Promise<CollectorEntity[]> {

    const query = `SELECT
    ne.current_owner as id, ne.current_owner as name, 
    COUNT(distinct collection_id) as collections,
    COUNT(distinct meta_id) as unique, 
    AVG(e.meta::bigint) as average,
    COUNT(*) as total, 
    COUNT(ne.current_owner) as unique_collectors,
    COALESCE(SUM(e.meta::bigint), 0) as volume,
    COALESCE(MAX(e.meta::bigint), 0) as max
  FROM nft_entity ne
  JOIN event e on e.nft_id = ne.id WHERE e.interaction = 'BUY'
  GROUP BY ne.current_owner
  ORDER BY ${orderBy} ${orderDirection}
  LIMIT $1 OFFSET $2`

    const result: [CollectorEntity] = await makeQuery(this.tx, NFTEntity, query, [limit, offset])
    return result;

  }
}
