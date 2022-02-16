import { Arg, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Event } from '../../model/generated'
import { ChartEntity } from '../model/chart.model'
import { maxBuy, floorList } from '../query/chart'


@Resolver()
export class CollectionChartResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ChartEntity])
  async collectionBuyChartById(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<ChartEntity[]> {
    const result: ChartEntity[] = await this.genericChartQuery(maxBuy, id)
    return result
  }

  @Query(() => [ChartEntity])
  async collectionListChartById(
    @Arg('id', { nullable: false }) id: string,
  ): Promise<ChartEntity[]> {
    const result: ChartEntity[] = await this.genericChartQuery(floorList, id)
    return result
  }

  async genericChartQuery(query: string, id: string): Promise<ChartEntity[]> {
    const manager = await this.tx()
    const repository = manager.getRepository(Event)

    const result: ChartEntity[] = await repository.query(query, [id])
    return result
  }
}
