import {Field, ObjectType, Query, Resolver} from "type-graphql"
import type {EntityManager} from "typeorm"
import {HistoricalBalance} from "./generated/model"


@ObjectType()
export class Hello {
  @Field(() => String, { nullable: false })
  greeting!: string

  constructor(greeting: string) {
    this.greeting = greeting
  }
}


@Resolver()
export class HelloResolver {
  constructor(
    private tx: () => Promise<EntityManager>
  ) {}

  @Query(() => Hello)
  async hello(): Promise<Hello> {
    const tx = await this.tx()
    let count = await tx.getRepository(HistoricalBalance).count()
    return new Hello(`Hello, we've seen ${count} transfers!`)
  }
}
