import { CollectionEntity } from '../../generated/model'
import { canOrElseError, exists } from '../utils/consolidator'
import { RemarkResult } from '../utils/extract'
import logger, { logError } from '../utils/logger'
import NFTUtils from '../utils/NftUtils'
import { Collection, eventFrom, RmrkEvent } from '../utils/types'
import { createOrElseThrow, create } from '../utils/entity'

// TODO: add a check for the issuer
// DEV: does not create any entity
async function mint(remark: RemarkResult) {
  let collection: Collection | null = null
  try {
    collection = NFTUtils.unwrap(remark.value) as Collection
    canOrElseError<string>(exists, collection.id, true)
    let final = await create<CollectionEntity>(CollectionEntity, collection.id, {})
    // const entity = await CollectionEntity.get(collection.id)
    // canOrElseError<CollectionEntity>(exists, entity)
    // const final = CollectionEntity.create(collection)
    
    final.name = collection.name.trim()
    final.max = Number(collection.max)
    final.issuer = remark.caller
    final.currentOwner = remark.caller
    final.symbol = collection.symbol.trim()
    final.blockNumber = BigInt(remark.blockNumber)
    final.metadata = collection.metadata
    final.events = [eventFrom(RmrkEvent.MINT, remark, '')]

    logger.info(`Processed [COLLECTION] ${final.id}`)
    
  } catch (e) {
    logError(e, (e) => logger.error(`[COLLECTION] ${e.message}, ${JSON.stringify(collection)}`))
    
    // await logFail(JSON.stringify(collection), e.message, RmrkEvent.MINT)
  }

}

export default mint