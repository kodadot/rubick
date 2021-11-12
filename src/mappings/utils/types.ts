import { CollectionEntity, NFTEntity } from '../../types'
import { Event } from '../../types'
import { RemarkResult } from './extract'

export enum RmrkEvent {
  MINT = 'MINT',
  MINTNFT = 'MINTNFT',
  LIST = 'LIST',
  BUY = 'BUY',
  CONSUME = 'CONSUME',
  CHANGEISSUER = 'CHANGEISSUER',
  SEND = 'SEND',
  EMOTE = 'EMOTE',
}

export const getNftId = (nft: any, blocknumber?: string | number): string => {
  return `${blocknumber ? blocknumber + '-' : '' }${nft.collection}-${nft.instance || nft.name}-${nft.sn}`
}

export function eventFrom(interaction: RmrkEvent,  { blockNumber, caller, timestamp }: RemarkResult, meta: string): Event {
  return {
    interaction,
    blockNumber,
    caller,
    timestamp,
    meta
  }
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

export type RmrkType = Collection | NFT | RmrkInteraction
