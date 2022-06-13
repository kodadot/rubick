import logger, { logError } from './logger';
import { Series, Spotlight, CacheStatus, Collector } from "../../model/generated";
import { Store } from "@subsquid/substrate-processor";
import { EntityConstructor } from "./types";
import { getOrCreate } from './entity';
import { camelCase } from './helper';

const DELAY_MIN: number = 60 // every 60 minutes
const STATUS_ID: string = "0"

enum Query {

    series = `SELECT
            ce.id, ce.name, ce.meta_id as metadata, me.image, ce.issuer,
            COUNT(distinct ne.meta_id) as unique,
            COUNT(distinct ne.current_owner) as unique_collectors,
            COUNT(distinct ne.current_owner) as sold,
            COUNT(ne.*) as total,
            AVG(ne.price) as average_price,
            MIN(NULLIF(ne.price, 0)) as floor_price,
            COALESCE(MAX(e.meta :: bigint), 0) as highest_sale,
            COALESCE(SUM(e.meta::bigint), 0) as volume,
            COUNT(e.*) as buys,
            COUNT(em.*) as emote_count
        FROM collection_entity ce
        LEFT JOIN metadata_entity me on ce.meta_id = me.id
        LEFT JOIN nft_entity ne on ce.id = ne.collection_id
        LEFT JOIN emote em on ne.id = em.nft_id
        JOIN event e on ne.id = e.nft_id
        WHERE e.interaction = 'BUY'
        GROUP BY ce.id, me.image, ce.name`,

    spotlight = `SELECT
        issuer as id,
        COUNT(distinct collection_id) as collections,
        COUNT(distinct meta_id) as unique,
        AVG(price) as average,
        COUNT(*) as total,
        COUNT(distinct ne.current_owner) as unique_collectors,
        SUM(CASE WHEN ne.issuer <> ne.current_owner THEN 1 ELSE 0 END) as sold,
        COALESCE(SUM(e.meta::bigint), 0) as volume
    FROM nft_entity ne
    JOIN event e on e.nft_id = ne.id WHERE e.interaction = 'BUY'
    GROUP BY issuer`,

    collector_whale = `SELECT
        ne.current_owner                 as id,
        ne.current_owner                 as name,
        COUNT(distinct collection_id)    as collections,
        COUNT(distinct meta_id)          as unique,
        AVG(e.meta::bigint)              as average,
        COUNT(e.id)                      as total,
        COUNT(ne.current_owner)          as unique_collectors,
        COALESCE(SUM(e.meta::bigint), 0) as volume,
        COALESCE(MAX(e.meta::bigint), 0) as max
    FROM nft_entity ne
            JOIN event e on e.nft_id = ne.id
    WHERE e.interaction = 'BUY'
    GROUP BY ne.current_owner
    ORDER BY volume DESC
    LIMIT 100`,

}

export async function updateCache(timestamp: Date, store: Store): Promise<void> {
    let lastUpdate = await getOrCreate(store, CacheStatus, STATUS_ID, { id: STATUS_ID, lastBlockTimestamp: new Date(0) })
    const passedMins = (timestamp.getTime() - lastUpdate.lastBlockTimestamp.getTime()) / 60000
    logger.info(`[CACHE UPDATE] PASSED TIME - ${passedMins} MINS`)
    if (passedMins > DELAY_MIN) {
        try {
            await Promise.all([
                updateEntityCache(store, Series, Query.series),
                updateEntityCache(store, Spotlight, Query.spotlight),
                updateEntityCache(store, Collector, Query.collector_whale),
            ])
            lastUpdate.lastBlockTimestamp = timestamp;
            await store.save(lastUpdate)
            logger.success(`[CACHE UPDATE]`)
        }
        catch (e) {
            logError(e, (e) =>
                logger.error(`[CACHE UPDATE] ${e.message}`)
            )
        }
    }
}

async function updateEntityCache<T>(
    store: Store,
    entityConstructor: EntityConstructor<T>,
    query: Query
): Promise<T[]> {
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
