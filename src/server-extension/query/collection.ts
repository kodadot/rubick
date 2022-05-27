export const collectionsDistribution = (idList: string): string =>
`SELECT ce.id,
        COUNT(ne.current_owner) AS owners,
        COUNT (DISTINCT ne.current_owner) AS unique_owner
FROM collection_entity ce
LEFT JOIN nft_entity ne ON ne.collection_id = ce.id
WHERE ce.id in (${idList})
GROUP BY ce.id`