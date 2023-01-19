import type { Store } from '@kodadot1/metasquid/types'
import { CreatedCollection, CreatedNFT } from '@vikiival/minimark/v1'
import { CreatedCollection as NewCreatedCollection, CreatedNFT as NewCreatedNFT } from '@vikiival/minimark/v2'
// import type { CreatedCollection, CreatedNFT } from '@vikiival/minimark'

import { CallHandlerContext } from '@subsquid/substrate-processor'
import { Attribute, CollectionEvent, Interaction as Action } from '../../model/generated'
import { RemarkResult } from './extract'
import { InteractionValue as NewInteractionValue } from '@vikiival/minimark/v2'
import { InteractionValue } from '@vikiival/minimark/v1'

export { Action, Store }

export const getNftId = (nft: any, blocknumber?: string | number): string => {
  return `${blocknumber ? blocknumber + '-' : '' }${nft.collection}-${nft.instance || nft.name}-${nft.sn}`
}


export function collectionEventFrom(interaction: Action.MINT | Action.CHANGEISSUER,  { blockNumber, caller, timestamp }: RemarkResult, meta: string): CollectionEvent {
  return new CollectionEvent({
    interaction,
    blockNumber,
    caller,
    timestamp,
    meta
  })
}

export function eventFrom<T>(interaction: T, { blockNumber, caller, timestamp }: BaseCall, meta: string, currentOwner?: string): IEvent<T> {
  return {
    interaction,
    blockNumber: BigInt(blockNumber),
    caller,
    currentOwner: currentOwner ?? caller,
    timestamp,
    meta,
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

export interface IEvent<T = Action> {
  interaction: T;
  blockNumber: bigint,
  caller: string,
  currentOwner: string,
  timestamp: Date,
  meta: string;
}

// TODO: use
type NewType<IsNew extends boolean, Old, New> = IsNew extends false ? Old : New
type Bool<T extends boolean = false> = T

// Conditional types
export type RmrkInteraction<T extends boolean = false> = T extends false ? InteractionValue : NewInteractionValue
export type NFT<T extends boolean = false> = T extends false ? CreatedNFT : NewCreatedNFT
export type Collection <T extends boolean = false> = NewType<Bool<T>, CreatedCollection, NewCreatedCollection>

// TODO: remove once new minimark is imported
export type BaseType = 'svg' | 'png' | 'audio' | 'video' | 'mixed' | string;
type Theme = string | Record<string, string>
type Themes = Record<string, Theme>

export type Base = {
  symbol: string
  type?: BaseType
  themes?: Themes
  parts: any[]
  metadata?: string
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
  mediaUri?: string;
  type?: string;
  thumbnailUri?: string;
}

export type MetadataAttribute = {
  display_type?: DisplayType
  trait_type?: string
  value: number | string
}

export type Transfer = {
  to: string,
  value: bigint
}


export type InteractionExtra<T = Transfer[]> = {
  extra: T
}

export type ExtraCall = {
  transfers: Transfer[]
  remarkCount: number // kodadot/rubick#6
}

export enum DisplayType {
  null,
  'boost_number',
  'number',
  'boost_percentage',
}
