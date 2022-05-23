import { Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../../model/generated'
import { SaleNftEntity } from '../model/sales.model'
import { salesQuery } from "../query/nft";
import { makeQuery } from "../utils";

@Resolver()
export class SalesFeedResolver {
    constructor(private tx: () => Promise<EntityManager>) { }

    @Query(() => [SaleNftEntity])
    async salesFeed(): Promise<[SaleNftEntity]> {
        const result: [SaleNftEntity] = await makeQuery(this.tx, NFTEntity, salesQuery)
        return result
    }
}