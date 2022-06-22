import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { LastEventEntity } from '../model/event.model'
import { lastEventQuery } from '../query/event'
import { makeQuery, toSqlInParams } from "../utils";
import { Interaction } from '../../model'

@Resolver()
export class EventResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [LastEventEntity])
  async lastEvent(
    @Arg('interaction', { nullable: true, defaultValue: Interaction.LIST }) interaction: Interaction,
    @Arg('passionList', () => [String!], { nullable: true }) passionList: string[],
    @Arg('limit', { nullable: true, defaultValue: 20 }) limit: number,
    @Arg('offset', { nullable: true, defaultValue: 0 }) offset: number,
  ): Promise<[LastEventEntity]> {

    const selectFromPassionList = passionList && passionList.length > 0
    ? `AND ne.issuer in (${toSqlInParams(passionList)})`
    : ''
    const result: [LastEventEntity] = await makeQuery(this.tx, NFTEntity, lastEventQuery(selectFromPassionList), [interaction, limit, offset])
    return result
  }

}
