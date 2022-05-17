export const passionQuery = `SELECT DISTINCT ne.issuer as id
FROM nft_entity ne
WHERE ne.current_owner = $1
AND ne.current_owner != ne.issuer`

export const salesQuery = `SELECT
    ne.id,
    ne.name,
    ne.issuer,
    e.caller as buyer,
    collection_id,
    (e.meta::bigint) as sale_price,
    e.timestamp,
    me.image
FROM
    nft_entity ne
    LEFT join event as e on e.nft_id = ne.id
    LEFT join metadata_entity me on me.id = ne.metadata
where
    e.interaction = 'BUY'
    and e.timestamp >= NOW() - INTERVAL '10 DAY'`