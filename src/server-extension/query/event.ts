export const buyEvent = `SELECT
    date(e.timestamp),
    COUNT(e.*) as count,
    COALESCE(MAX(e.meta::bigint), 0) as max,
    FROM event e
    LEFT JOIN nft_entity ne on ne.id = e.nft_id
    WHERE e.interaction = 'BUY' AND ne.collection_id = $1;`