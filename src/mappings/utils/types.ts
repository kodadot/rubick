import { Attribute, CollectionEvent, Interaction as RmrkEvent } from '../../generated/model'
import { StoreContext, ExtrinsicContext } from '@subsquid/hydra-common'
import { RemarkResult } from './extract'
import { string } from '../../generated/marshal'

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

export function eventFrom(interaction: RmrkEvent,  { blockNumber, caller, timestamp }: RemarkResult, meta: string): IEvent {
  return {
    interaction,
    blockNumber: BigInt(blockNumber),
    caller,
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

export type Context = ExtrinsicContext & StoreContext

export type Optional<T> = T | null

export interface IEvent {
  interaction: RmrkEvent;
  blockNumber: bigint,
  caller: string,
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


export type RmrkType = Collection | NFT | RmrkInteraction

export type BatchArg = {
  args: Record<string, any>,
  callIndex: string,  
}

export type SomethingWithMeta = {
  metadata: string
}

export type SanitizerFunc = (url: string) => string

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

export enum DisplayType {
  null,
  'boost_number',
  'number',
  'boost_percentage',
}
