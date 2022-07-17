import { Arg, Query, Resolver, } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { HotNFTEntity } from '../model/hot.model'
import { hotDashboardQuery } from "../query/nft";
import { makeQuery } from "../utils";

@Resolver()
export class HotDashboardResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => [HotNFTEntity])
    async hotDashboard(
        @Arg('dateRange', { nullable: false, defaultValue: '7 DAY' }) dateRange: string,
    ): Promise<[HotNFTEntity]> {
        const result: [HotNFTEntity] = await makeQuery(
            this.tx,
            NFTEntity,
            hotDashboardQuery(dateRange))

        return result
    }
}