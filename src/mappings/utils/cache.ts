import { CacheStatus, Collector, MetadataEntity, Series, Spotlight } from '../../model/generated'
import { create, EntityWithId, getOrCreate } from './entity'
import { camelCase } from './helper'
import logger, { logError } from './logger'
import { fetchAllMetadata } from './metadata'
import { EntityConstructor, Store, TokenMetadata } from './types'

const DELAY_MIN = 60 // every 60 minutes
const STATUS_ID = '0'
const METADATA_STATUS_ID = '1'
const METADATA_DELAY_MIN = 10 // every 24 hours
const TO_MINUTES = 60_000

enum Query {
  series = `SELECT
        ce.id,
        ce.name,
        ce.meta_id                         as metadata,
        me.image,
        ce.issuer,
        COUNT(distinct ne.meta_id)         as unique,
        COUNT(distinct ne.current_owner)   as unique_collectors,
        COUNT(distinct ne.current_owner)   as sold,
        COUNT(ne.*)                        as total,
        AVG(ne.price)                      as average_price,
        MIN(NULLIF(ne.price, 0))           as floor_price,
        COALESCE(MAX(e.meta :: bigint), 0) as highest_sale,
        COALESCE(SUM(e.meta::decimal), 0)   as volume,
        COUNT(e.*)                         as buys,
        COUNT(em.*)                        as emote_count
    FROM collection_entity ce
        LEFT JOIN metadata_entity me on ce.meta_id = me.id
        LEFT JOIN nft_entity ne on ce.id = ne.collection_id
        LEFT JOIN emote em on ne.id = em.nft_id
        JOIN event e on ne.id = e.nft_id
    WHERE e.interaction = 'BUY'
    GROUP BY ce.id, me.image, ce.name
    ORDER BY volume DESC
    LIMIT 100`,

  spotlight = `SELECT
        issuer                                                         as id,
        COUNT(distinct collection_id)                                  as collections,
        COUNT(distinct meta_id)                                        as unique,
        AVG(price)                                                     as average,
        COUNT(*)                                                       as total,
        COUNT(distinct ne.current_owner)                               as unique_collectors,
        SUM(CASE WHEN ne.issuer <> ne.current_owner THEN 1 ELSE 0 END) as sold,
        COALESCE(SUM(e.meta::decimal), 0)                               as volume
    FROM nft_entity ne
        JOIN event e on e.nft_id = ne.id
    WHERE e.interaction = 'BUY'
    GROUP BY issuer
    ORDER BY sold DESC
    LIMIT 400`,

  collector_whale = `SELECT
        ne.current_owner                 as id,
        ne.current_owner                 as name,
        COUNT(distinct collection_id)    as collections,
        COUNT(distinct meta_id)          as unique,
        AVG(e.meta::decimal)              as average,
        COUNT(e.id)                      as total,
        COUNT(ne.current_owner)          as unique_collectors,
        COALESCE(SUM(e.meta::decimal), 0) as volume,
        COALESCE(MAX(e.meta::decimal), 0) as max
    FROM nft_entity ne
            JOIN event e on e.nft_id = ne.id
    WHERE e.interaction = 'BUY'
    GROUP BY ne.current_owner
    ORDER BY volume DESC
    LIMIT 100`,
}

enum MetadataQuery {
  missing = `SELECT *
    FROM (
      SELECT DISTINCT metadata as id
      FROM nft_entity
      WHERE metadata IS NOT NULL AND metadata <> ''
        AND meta_id IS NULL
      UNION
      SELECT DISTINCT metadata as id
      FROM collection_entity
      WHERE metadata IS NOT NULL AND metadata <> ''
        AND meta_id IS NULL
    ) AS missing
    LIMIT 10;`,

  nft = `UPDATE
      nft_entity ne
    SET meta_id = me.id
    FROM metadata_entity me
    WHERE ne.metadata = me.id
    AND ne.meta_id IS NULL
    RETURNING ne.id, me.id;`,

  collection = `UPDATE
      collection_entity ce
    SET meta_id = me.id
    FROM metadata_entity me
    WHERE ce.metadata = me.id
    AND ce.meta_id IS NULL
    RETURNING ce.id, me.id;`,
}

export async function updateMetadataCache(timestamp: Date, store: Store): Promise<void> {
  const lastUpdate = await getOrCreate(store, CacheStatus, METADATA_STATUS_ID, {
    id: METADATA_STATUS_ID,
    lastBlockTimestamp: new Date(0),
  })
  const passedMins = getPassedMinutes(timestamp, lastUpdate.lastBlockTimestamp)
  if (passedMins >= METADATA_DELAY_MIN) {
    logger.info(`[METADATA CACHE UPDATE] PASSED TIME - ${passedMins} MINS`)
    try {
      await updateMissingMetadata(store)
      lastUpdate.lastBlockTimestamp = timestamp
      await store.save(lastUpdate)
      logger.info('💚 [METADATA CACHE UPDATE]')
    } catch (e) {
      logError(e, (err) => logger.error(`[METADATA CACHE UPDATE] ${err.message}`))
    }
  }
}

function getPassedMinutes(timestamp: Date, lastBlockTimestamp: Date): number {
  return (timestamp.getTime() - lastBlockTimestamp.getTime()) / TO_MINUTES
}

export async function updateCache(timestamp: Date, store: Store): Promise<void> {
  let lastUpdate = await getOrCreate(store, CacheStatus, STATUS_ID, {
    id: STATUS_ID,
    lastBlockTimestamp: new Date(0),
  })
  const passedMins = (timestamp.getTime() - lastUpdate.lastBlockTimestamp.getTime()) / 60_000
  logger.info(`[CACHE UPDATE] PASSED TIME - ${passedMins} MINS`)
  if (passedMins > DELAY_MIN) {
    try {
      await Promise.all([
        updateEntityCache(store, Series, Query.series),
        // updateEntityCache(store, Spotlight, Query.spotlight),
        // updateEntityCache(store, Collector, Query.collector_whale),
      ])
      lastUpdate.lastBlockTimestamp = timestamp
      await store.save(lastUpdate)
      logger.info(`[CACHE UPDATE]`)
    } catch (e) {
      logError(e, (e) => logger.error(`[CACHE UPDATE] ${e.message}`))
    }
  }
}

async function updateEntityCache<T>(store: Store, entityConstructor: EntityConstructor<T>, query: Query): Promise<T[]> {
  const result: any[] = await store.query(query)
  const entities = result.map((el) => {
    const entity: T = new entityConstructor()
    for (const prop in el) {
      entity[camelCase(prop) as keyof T] = el[prop]
    }
    return entity
  })
  return store.save(entities)
}

async function updateMissingMetadata(store: Store) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const missing: EntityWithId[] = await store.query(MetadataQuery.missing)
    if (missing.length === 0) {
      logger.info('[MISSING METADATA] - NONE')
      return
    }

    logger.info(`[MISSING METADATA] - ${missing.length}`)
    const ids = missing.map((el) => el.id).filter(Boolean)
    const results = await fetchAllMetadata<TokenMetadata>(ids)
    const entities = results.map((el) => create(MetadataEntity, el.id, el))
    logger.debug(`[MISSING METADATA] - FOUND ${entities.length}`)
    await store.save(entities)
    await store.query(MetadataQuery.nft)
    await store.query(MetadataQuery.collection)
    logger.info('[METADATA UPDATE]')
  } catch (e) {
    logError(e, (err) => logger.error(`[MISSING METADATA] ${err.message}`))
  }
  // const nft = await store.query(MetadataQuery.nft);
  // const collection = await store.query(MetadataQuery.collection);
  // logger.info(`[CACHE UPDATE] MISSING METADATA - ${missing.length} NFTs, ${nft.length} NFTs, ${collection.length} Collections`);
}
