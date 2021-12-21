import { NFTEntity } from '../../generated/model'
import { canOrElseError, exists } from '../utils/consolidator'
import { RemarkResult } from '../utils/extract'
import logger, { logError } from '../utils/logger'
import NFTUtils from '../utils/NftUtils'
import { NFT, eventFrom, RmrkEvent, getNftId, Optional } from '../utils/types'
import { createOrElseThrow, create } from '../utils/entity'

function mintNFT(remark: RemarkResult) {
  let nft: Optional<NFT> = null
  try {
    nft = NFTUtils.unwrap(remark.value) as NFT
    canOrElseError<string>(exists, nft.collection, true)
    // const collection = await CollectionEntity.get(nft.collection)
    // canOrElseError<CollectionEntity>(exists, collection, true)
    // isOwnerOrElseError(collection, remark.caller)
    let final = create<NFTEntity>(NFTEntity, nft.id, {})
    
    final.id = getNftId(nft, remark.blockNumber)
    final.issuer = remark.caller
    final.currentOwner = remark.caller
    final.blockNumber = BigInt(remark.blockNumber)
    final.name = nft.name
    final.instance = nft.instance
    final.transferable = nft.transferable
    // final.collection = nft.collection
    final.sn = nft.sn
    final.metadata = nft.metadata
    final.price = BigInt(0) 
    final.burned = false
    final.events = [eventFrom(RmrkEvent.MINTNFT, remark, '')]
    
    logger.info(`SAVED [MINT] ${final.id}`)
    // await final.save()
    return final
  } catch (e) {
    logError(e, (e) => logger.error(`[COLLECTION] ${e.message}, ${JSON.stringify(nft)}`))
    // await logFail(JSON.stringify(nft), e.message, RmrkEvent.MINTNFT)
  }
}