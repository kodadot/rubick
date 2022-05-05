export const buyEvent = `SELECT
    COUNT(e.*) as count,
    COALESCE(MAX(e.meta::bigint), 0) as max
    FROM event e
    LEFT JOIN nft_entity ne on ne.id = e.nft_id
    WHERE e.interaction = 'BUY' AND ne.collection_id = $1;`

export const collectionEventHistory = `SELECT
	ce.id as collection_id,
	DATE(e.timestamp),
	count(e) as freq
FROM nft_entity ne
JOIN collection_entity ce on ce.id = ne.collection_id
JOIN event e on e.nft_id = ne.id
WHERE e.interaction = 'BUY' and ce.id = $1 and e.timestamp >= NOW() - INTERVAL '30 DAY'
GROUP BY ce.id, DATE(e.timestamp)
ORDER BY DATE(e.timestamp)`

export const spotlightSoldHistory = `SELECT
ne.issuer as spotlight_id,
DATE(e.timestamp),
count(e) as count
FROM
nft_entity ne
JOIN event e on e.nft_id = ne.id
WHERE
e.interaction = 'BUY'
and ne.issuer != ne.current_owner
and ne.issuer = $1
and e.timestamp >= NOW() - INTERVAL '30 DAY'
GROUP BY
ne.issuer,
DATE(e.timestamp)
ORDER BY DATE(e.timestamp)`