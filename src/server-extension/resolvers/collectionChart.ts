import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { Event } from '../../model/generated'
import { ChartEntity } from '../model/chart.model'
import { maxBuy, floorList, averageBuy } from '../query/chart'


@Resolver()
export class CollectionChartResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  // TODO: calculate score sold * (unique / total)
  @Query(() => [ChartEntity])
  async collectionChartById(
    @Arg('id', { nullable: false }) id: string,
    // @Arg('floor', { nullable: true, defaultValue: false }) floor: boolean,
    // @Arg('price', { nullable: true, defaultValue: null }) id: boolean,
    // @Arg('average', { nullable: true, defaultValue: null }) id: boolean,
  ): Promise<ChartEntity[]> {
    const manager = await this.tx()
    const repository = manager.getRepository(Event)

    const result: ChartEntity[] = await repository.query(maxBuy, [id])

    return result
  }
}
