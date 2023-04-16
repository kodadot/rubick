import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class EventEntity {
  @Field(() => Date, { nullable: false })
  date!: Date;

  @Field(() => BigInt, { nullable: true, defaultValue: 0n })
  max!: bigint;

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  count!: number;

  constructor(props: Partial<EventEntity>) {
    Object.assign(this, props);
  }
}

@ObjectType()
export class HistoryEntity {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  date!: Date;

  @Field(() => Number)
  count!: number;
}

@ObjectType()
export class LastEventEntity {
  @Field(() => String, { nullable: false })
  id!: String;

  @Field(() => String, { nullable: false })
  name!: String;

  @Field(() => String, { nullable: false })
  issuer!: String;

  @Field(() => Date, { nullable: false })
  timestamp!: Date;

  @Field(() => String, { nullable: false })
  metadata!: String;

  @Field(() => String, { nullable: false })
  value!: String;

  @Field(() => String, { nullable: false, name: "currentOwner" })
  current_owner!: String;

  @Field(() => String, { nullable: true })
  image!: String;

  @Field(() => String, { nullable: true, name: "animationUrl" })
  animation_url!: string | undefined | null;

  @Field(() => String, { nullable: false, name: "collectionId" })
  collection_id!: string;

  @Field(() => String, { nullable: false, name: "collectionName" })
  collection_name!: string;

  @Field(() => [Resource], { nullable: true })
  resources!: Resource[];

  constructor(props: Partial<LastEventEntity>) {
    Object.assign(this, props);
  }
}

@ObjectType()
export class Resource {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: true })
  src!: string;

  @Field(() => String, { nullable: true })
  metadata!: string;

  @Field(() => String, { nullable: true, name: "slotId" })
  slot_id!: string;

  @Field(() => String, { nullable: true })
  thumb!: string;

  @Field(() => Int, { nullable: false })
  priority!: number;

  @Field(() => Boolean, { nullable: false })
  pending!: boolean;

  nftId!: string;

  constructor(props: Partial<Resource>) {
    Object.assign(this, props);
  }
}
