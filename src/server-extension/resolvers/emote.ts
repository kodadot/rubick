import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Emote } from '../../model'
import { EmoteCountEntity, EmoteCountMapEntity } from '../model/emote.model'
import { nftEmoteMapQuery, nftEmoteQuery } from '../query/emote'
import { makeQuery } from '../utils'



@Resolver()
export class EmoteResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [EmoteCountEntity])
  async emoteListByNftId(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<EmoteCountEntity[]> {
    const result: EmoteCountEntity[] = await makeQuery(this.tx, Emote, nftEmoteQuery, [id])
    return result
  }

  @Query(() => String)
  async emoteMapByNftId(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<String> {
    const result: [EmoteCountMapEntity] = await makeQuery(this.tx, Emote, nftEmoteMapQuery, [id])
    return JSON.stringify(result[0].counts)
    // const result = await this.emoteListByNftId(id)
    // return new Map(result.map(e => [e.id, e.count])) 
  }

}