import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Emote } from '../../model'
import { EmoteCountEntity } from '../model/emote.model'
import { nftEmoteQuery } from '../query/emote'
import { makeQuery } from '../utils'



@Resolver()
export class EmoteResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [EmoteCountEntity])
  async emoteMapByNftId(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<EmoteCountEntity[]> {
    const result: EmoteCountEntity[] = await makeQuery(this.tx, Emote, nftEmoteQuery, [id])
    return result
  }

}