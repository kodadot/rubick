export const passionQuery = `SELECT DISTINCT ne.issuer as id
FROM nft_entity ne
WHERE ne.current_owner = $1
AND ne.current_owner != ne.issuer`

export const salesQuery = `SELECT
    ne.id,
    ne.name,
    ce.name as collection_name,
    ne.issuer,
    collection_id,
    e.caller as buyer,
    (e.meta::bigint) as sale_price,
    e.timestamp,
    e.block_number,
    me.image
FROM nft_entity ne
    JOIN collection_entity ce on ce.id = collection_id
    LEFT join event as e on e.nft_id = ne.id
    LEFT join metadata_entity me on me.id = ne.metadata
where
    e.interaction = 'BUY'
    and e.timestamp >= NOW() - INTERVAL '7 DAY'
ORDER BY e.timestamp desc`

export const hotDashboardQuery = (dateRange: string): string => `SELECT
    e.timestamp,
    e.meta,
    ce.name as collection_name,
    ce.id as collection_id
FROM
    event e
    LEFT JOIN nft_entity ne ON e.nft_id = ne.id
    LEFT JOIN collection_entity ce ON ne.collection_id = ce.id
WHERE
    e.interaction = 'BUY'
    AND e.timestamp >= NOW() - INTERVAL '${dateRange}'
ORDER BY
    e.timestamp`
