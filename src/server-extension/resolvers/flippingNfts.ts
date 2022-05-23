import { Query, Resolver, } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { FlippingNFT } from '../model/nft.model'
import { flippingQuery } from "../query/nft";
import { makeQuery } from "../utils";

@Resolver()
export class FlippingNFTsResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => [FlippingNFT])
    async flippingNFTs(): Promise<[FlippingNFT]> {
        const result: [FlippingNFT] = await makeQuery(this.tx, NFTEntity, flippingQuery)

        return result
    }
}