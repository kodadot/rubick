import { Query, Resolver, Arg } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { FlippingNFT } from '../model/nft.model'
import { flippingQuery } from "../query/nft";
import { makeQuery } from "../utils";

@Resolver()
export class FlippingNFTsResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => [FlippingNFT])
    async flippingNFTs(
        @Arg('limit', { nullable: true, defaultValue: 20 }) limit: number,
        @Arg('offset', { nullable: true, defaultValue: 0 }) offset: number,
    ): Promise<[FlippingNFT]> {
        const result: [FlippingNFT] = await makeQuery(this.tx, NFTEntity, flippingQuery, [limit, offset])

        return result
    }
}