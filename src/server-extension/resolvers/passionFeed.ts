import { Arg, Field, ObjectType, Query, Resolver, FieldResolver, Root } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { PassionFeedEntity } from '../model/passion.model'


const passionQuery = `SELECT DISTINCT ne.issuer as id
FROM nft_entity ne
WHERE ne.current_owner = $1
AND ne.current_owner != ne.issuer`

@Resolver()
export class PassionFeedResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => [PassionFeedEntity])
    async passionFeed(
        @Arg('account', { nullable: false, }) account: string
    ): Promise<[PassionFeedEntity]> {
        const manager = await this.tx()
        const result = await manager.getRepository(NFTEntity)
            .query(passionQuery, [account])

        return result
    }
}