export const buyEvent = `SELECT
    COUNT(e.*) as count,
    COALESCE(MAX(e.meta::bigint), 0) as max
    FROM event e
    LEFT JOIN nft_entity ne on ne.id = e.nft_id
    WHERE e.interaction = 'BUY' AND ne.collection_id = $1;`

export const collectionEventHistory = (idList: string, dateRange: string) => `SELECT
	ce.id as id,
	DATE(e.timestamp),
	count(e)
FROM nft_entity ne
JOIN collection_entity ce on ce.id = ne.collection_id
JOIN event e on e.nft_id = ne.id
WHERE e.interaction = 'BUY'
and ce.id in (${idList})
${dateRange}
GROUP BY ce.id, DATE(e.timestamp)
ORDER BY DATE(e.timestamp)`


export const lastEventQuery = `SELECT
    DISTINCT ne.id as id,
    ne.name as name,
    ne.issuer as issuer,
    ne.metadata as metadata,
    (e.meta::bigint) as value,
    e.timestamp,
    e.current_owner,
    me.image as image
FROM event e
    JOIN nft_entity ne on e.nft_id = ne.id
    LEFT join metadata_entity me on me.id = ne.metadata
WHERE
    e.interaction = $1
    AND ne.burned = false
ORDER BY e.timestamp desc
LIMIT $2 OFFSET $3`