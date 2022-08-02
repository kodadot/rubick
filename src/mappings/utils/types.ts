import { Attribute, CollectionEvent, Interaction as RmrkEvent } from '../../model/generated'
import { CallHandlerContext } from '@subsquid/substrate-processor'

import { RemarkResult } from './extract'
import type { EntityManager } from 'typeorm'

export type Store = EntityManager

export { RmrkEvent }

export const getNftId = (nft: any, blocknumber?: string | number): string => {
  return `${blocknumber ? blocknumber + '-' : '' }${nft.collection}-${nft.instance || nft.name}-${nft.sn}`
}


export function collectionEventFrom(interaction: RmrkEvent.MINT | RmrkEvent.CHANGEISSUER,  { blockNumber, caller, timestamp }: RemarkResult, meta: string): CollectionEvent {
  return new CollectionEvent({
    interaction,
    blockNumber,
    caller,
    timestamp,
    meta
  })
}

export function eventFrom(interaction: RmrkEvent,  { blockNumber, caller, timestamp }: RemarkResult, meta: string, currentOwner?: string): IEvent {
  return {
    interaction,
    blockNumber: BigInt(blockNumber),
    caller,
    currentOwner: currentOwner || caller,
    timestamp,
    meta
  }
}

export function attributeFrom(attribute: MetadataAttribute): Attribute {
  return new Attribute({}, {
    display: String(attribute.display_type),
    trait: String(attribute.trait_type),
    value: String(attribute.value)
  })
}

export type Context = CallHandlerContext<Store> 

export type Optional<T> = T | null
export type UnwrapFunc<T> = (ctx: Context) => T;
export type SanitizerFunc = (url: string) => string;
export type CallWith<T> = BaseCall & T;

export type BaseCall = {
  caller: string;
  blockNumber: string;
  timestamp: Date;
};

export interface IEvent {
  interaction: RmrkEvent;
  blockNumber: bigint,
  caller: string,
  currentOwner: string,
  timestamp: Date,
  meta: string;
}

export interface RmrkInteraction {
  id: string;
  metadata?: string;
}

export interface Collection {
  version: string;
  name: string;
  max: number;
  issuer: string;
  symbol: string;
  id: string;
  _id: string;
  metadata: string;
  blockNumber?: number;
}

export interface NFT {
  name: string;
  instance: string;
  transferable: number;
  collection: string;
  sn: string;
  _id: string;
  id: string;
  metadata: string;
  currentOwner: string;
  price?: string;
  disabled?: boolean;
  blockNumber?: number;
}


export interface RMRK {
  event: RmrkEvent;
  view: RmrkType;
}

export type EntityConstructor<T> = {
  new (...args: any[]): T;
};

export type ArchiveCall = {
  __kind: string,
  value: any
}

export type ArchiveCallWithOptionalValue = {
  __kind: string,
  value?: any
}

export type RmrkType = Collection | NFT | RmrkInteraction

export type BatchArg = {
  args: Record<string, any>,
  callIndex: string,  
}

export type SomethingWithMeta = {
  metadata: string
}

export type TokenMetadata = {
  name?: string
  description: string
  external_url?: string
  image: string
  animation_url?: string
  attributes?: MetadataAttribute[]
}

export type MetadataAttribute = {
  display_type?: DisplayType
  trait_type?: string
  value: number | string
}

export type Transfer = {
  to: any,
  value: bigint
}

export enum DisplayType {
  null,
  'boost_number',
  'number',
  'boost_percentage',
}
