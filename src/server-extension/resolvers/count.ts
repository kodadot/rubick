import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { NFTEntity, CollectionEntity } from '../../model/generated'
import { EntityConstructor } from '../../mappings/utils/types'
import { CountEntity } from '../model/count.model'

@Resolver()
export class CountResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  private async execQuery<T>(entityConstructor: EntityConstructor<T>): Promise<Number> {
    const manager = await this.tx()
    const count = await manager.getRepository(entityConstructor).count()
    return count
  }

  @Query(() => Number)
  async totalCollections(): Promise<Number> {
    return this.execQuery(CollectionEntity)
  }

  @Query(() => Number)
  async totalTokens(): Promise<Number> {
    return this.execQuery(NFTEntity)
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
