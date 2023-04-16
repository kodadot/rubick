import { GraphQLResolveInfo } from "graphql"
import { groupBy } from "lodash"
import { Arg, Info, Query, Resolver } from "type-graphql"
import type { EntityManager } from "typeorm"
import { Interaction } from "../../model"
import { NFTEntity } from "../../model/generated"
import { LastEventEntity, ResourceEntity } from "../model/event.model"
import { PassionFeedEntity } from "../model/passion.model"
import { lastEventQuery, resourcesByNFT } from "../query/event"
import { passionQuery } from "../query/nft"
import { makeQuery, toSqlInParams } from "../utils"

type FieldName = {
  name: {
    value: string;
  };
};

@Resolver((of) => LastEventEntity)
export class EventResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [LastEventEntity])
  async lastEvent(
    @Arg("interaction", { nullable: true, defaultValue: Interaction.LIST }) interaction: Interaction,
    @Arg("passionAccount", { nullable: true }) account: string,
    @Arg("limit", { nullable: true, defaultValue: 20 }) limit: number,
    @Arg("offset", { nullable: true, defaultValue: 0 }) offset: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<[LastEventEntity]> {
    const passionResult: [PassionFeedEntity] = await makeQuery(this.tx, NFTEntity, passionQuery, [account]);
    const passionList = passionResult.map((passion) => passion.id);

    const selectFromPassionList =
      passionList && passionList.length > 0 ? `AND ne.issuer in (${toSqlInParams(passionList)})` : "";
    let lastEvents: [LastEventEntity] = await makeQuery(this.tx, NFTEntity, lastEventQuery(selectFromPassionList), [
      interaction,
      limit,
      offset,
    ]);

    // TODO: Refactor this to use proper dataloader with FieldResolver, currently dataloader is not supported
    // ref https://github.com/MichalLytek/type-graphql/issues/51
    const isResourcesQueried = Object.values(info.fieldNodes[0]?.selectionSet?.selections as unknown[] as FieldName[])
      .map((i) => i.name.value)
      .includes("resources");

    if (isResourcesQueried) {
      const whereCondition = `r.nft_id IN (${toSqlInParams(lastEvents.map((i) => String(i.id)))})`;
      const resources: [ResourceEntity] = await makeQuery(this.tx, NFTEntity, resourcesByNFT(whereCondition));
      const resourcesById = groupBy(resources, "nft_id");

      lastEvents.map((event) => (event.resources = resourcesById[String(event.id)] ?? []));
    }

    return lastEvents;
  }
}
