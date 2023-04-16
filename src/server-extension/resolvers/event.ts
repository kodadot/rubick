import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { LastEventEntity } from '../model/event.model'
import { lastEventQuery } from '../query/event'
import { makeQuery, toSqlInParams } from "../utils";
import { Interaction } from '../../model'
import { passionQuery } from "../query/nft";
import { PassionFeedEntity } from '../model/passion.model'

@Resolver()
export class EventResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [LastEventEntity])
  async lastEvent(
    @Arg('interaction', { nullable: true, defaultValue: Interaction.LIST }) interaction: Interaction,
    @Arg('passionAccount', { nullable: true, }) account: string,
    @Arg('limit', { nullable: true, defaultValue: 20 }) limit: number,
    @Arg('offset', { nullable: true, defaultValue: 0 }) offset: number,
  ): Promise<[LastEventEntity]> {


    const passionResult: [PassionFeedEntity] = await makeQuery(this.tx, NFTEntity, passionQuery, [account])
    const passionList = passionResult.map(passion => passion.id)

    const selectFromPassionList = passionList && passionList.length > 0
    ? `AND ne.issuer in (${toSqlInParams(passionList)})`
    : ''
    const result: [LastEventEntity] = await makeQuery(this.tx, NFTEntity, lastEventQuery(selectFromPassionList), [interaction, limit, offset])
    return result
  }

}
