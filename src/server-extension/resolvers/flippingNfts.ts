import { Query, Resolver, Arg } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { FlippingNFT } from '../model/nft.model'
import { flippingQuery, previousPriceQuery } from "../query/nft";
import { collectionsDistribution } from "../query/collection"
import { makeQuery, toSqlInParams } from "../utils";

type previousNft = {
    nft_id: string,
    meta: string,
    rank: number,
}

type CollectionDistribution = {
    id: string
    owners: number
    unique_owner: number
}

@Resolver()
export class FlippingNFTsResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => [FlippingNFT])
    async flippingNFTs(
        @Arg('limit', { nullable: true, defaultValue: 20 }) limit: number,
        @Arg('offset', { nullable: true, defaultValue: 0 }) offset: number,
    ): Promise<Array<FlippingNFT>> {
        const result: Array<FlippingNFT> = await makeQuery(this.tx, NFTEntity, flippingQuery, [limit, offset])

        const nfts = result.map(item => item.nft_id)

        const prevNFTs: [previousNft] = (await makeQuery(
            this.tx,
            NFTEntity,
            previousPriceQuery(toSqlInParams(nfts))))

        const collections: CollectionDistribution[] = await makeQuery(
            this.tx,
            NFTEntity,
            collectionsDistribution(toSqlInParams(result.map(item => item.collection_id))))

        return result.map(nft => {
            const { nft_id, collection_id } = nft
            const previousNft = prevNFTs.find((nft) => nft.nft_id === nft_id) || { meta: "0" }
            // handle LIST meta is not money
            const previous = Number(previousNft.meta)
            const { owners = 0, unique_owner = 0} = collections.find(col => col.id === collection_id) || {}

            return {
                ...nft,
                previous: Number.isNaN(previous) ? "0" : String(previous),
                distribution: (owners / unique_owner).toFixed(2),
            }

        })
    }
}
