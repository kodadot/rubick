export const maxBuyEvent = `SELECT
    date(e.timestamp),
    COALESCE(MAX(e.meta::bigint), 0) as max,
    FROM event e
    LEFT JOIN nft_entity ne on ne.id = e.nft_id
    WHERE e.interaction = 'BUY' AND ne.collection_id = $1;`

export const totalBuyEvent = `SELECT
    COUNT(e.*) as count
    FROM event e
    LEFT JOIN nft_entity ne on ne.id = e.nft_id
    WHERE e.interaction = 'BUY' AND ne.collection_id = $1;`