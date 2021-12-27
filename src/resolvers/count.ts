import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity } from '../generated/model'
import { CountEntity } from './model/count.model'

@Resolver()
export class CountResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  private async execQuery(query: string): Promise<CountEntity> {
    const manager = await this.tx()
    return  manager.getRepository(NFTEntity).query(query)
  }

  @Query(() => CountEntity)
  async totalCollections(): Promise<CountEntity> {
    return this.execQuery(`SELECT COUNT(*) as total collection_entity;`)
  }

  @Query(() => CountEntity)
  async totalTokens(): Promise<CountEntity> {
    return this.execQuery(`SELECT COUNT(*) as total nft_entity;`)
  }

  // TODO: could be hacked with SQL injection

  // @Query(() => CountEntity)
  // async totalTokensByCollectionId(@Arg('id', { nullable: false }) id: string): Promise<CountEntity> {
  //   return this.execQuery(`SELECT COUNT(*) as total nft_entity where collection_id = '${id}';`)
  // }

  // @Query(() => CountEntity)
  // async totalTokensByIssuer(@Arg('id', { nullable: false }) id: string): Promise<CountEntity> {
  //   return this.execQuery(`SELECT COUNT(*) as total nft_entity where issuer = '${id}';`)
  // }
}
