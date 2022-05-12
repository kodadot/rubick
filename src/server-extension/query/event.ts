export const buyEvent = `SELECT
    COUNT(e.*) as count,
    COALESCE(MAX(e.meta::bigint), 0) as max
    FROM event e
    LEFT JOIN nft_entity ne on ne.id = e.nft_id
    WHERE e.interaction = 'BUY' AND ne.collection_id = $1;`

export const collectionEventHistory = `SELECT
	ce.id as collection_id,
	DATE(e.timestamp),
	count(e)
FROM nft_entity ne
JOIN collection_entity ce on ce.id = ne.collection_id
JOIN event e on e.nft_id = ne.id
WHERE e.interaction = 'BUY' and ce.id = $1 and e.timestamp >= NOW() - INTERVAL '30 DAY'
GROUP BY ce.id, DATE(e.timestamp)
ORDER BY DATE(e.timestamp)`

export const nftEventList = `SELECT e.meta, e.timestamp, ne.id, ne.name, me.image, ne.issuer, e.caller
FROM event e
LEFT JOIN nft_entity ne ON ne.id = e.nft_id
LEFT JOIN metadata_entity me ON me.id = ne.meta_id
WHERE e.interaction = $1
LIMIT $2`