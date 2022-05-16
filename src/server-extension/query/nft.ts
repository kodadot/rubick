export const passionQuery = `SELECT DISTINCT ne.issuer as id
FROM nft_entity ne
WHERE ne.current_owner = $1
AND ne.current_owner != ne.issuer`