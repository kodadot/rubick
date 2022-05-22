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

  // TODO: calculate score sold * (unique / total)
  @Query(() => [CollectorEntity])
  async collectorTable(
    @Arg("limit", { nullable: true, defaultValue: null }) limit: number,
    @Arg("offset", { nullable: true, defaultValue: null }) offset: string,
    @Arg("orderBy", { nullable: true, defaultValue: "volume" }) orderBy: OrderBy,
    @Arg("orderDirection", { nullable: true, defaultValue: "DESC" })
    orderDirection: OrderDirection
  ): Promise<CollectorEntity[]> {

    const query = `SELECT
    ne.current_owner as id, ne.current_owner as name, 
    COUNT(distinct collection_id) as collections,
    COUNT(distinct meta_id) as unique, AVG(price) as average,
    COUNT(*) as total, COUNT(distinct ne.current_owner) as unique_collectors,
    SUM(CASE WHEN ne.issuer <> ne.current_owner THEN 1 ELSE 0 END) as total,
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
