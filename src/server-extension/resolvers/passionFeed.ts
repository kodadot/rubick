import { Arg, Field, ObjectType, Query, Resolver, FieldResolver, Root } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { PassionFeedEntity } from '../model/passion.model'
import { passionQuery } from "../query/nft";
import { makeQuery } from "../utils";

@Resolver()
export class PassionFeedResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => [PassionFeedEntity])
    async passionFeed(
        @Arg('account', { nullable: false, }) account: string
    ): Promise<[PassionFeedEntity]> {
        const result: [PassionFeedEntity] = await makeQuery(this.tx, NFTEntity, passionQuery, [account])

        return result
    }
}