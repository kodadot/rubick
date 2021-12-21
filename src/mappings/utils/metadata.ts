export const IPFS_PROVIDER = 'https://kodadot.mypinata.cloud/'

export const sanitizeIpfsUrl = (ipfsUrl: string): string => {

  const rr = /^ipfs:\/\/ipfs/
  if (rr.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', IPFS_PROVIDER)
  }

  const r = /^ipfs:\/\//
  if (r.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', `${IPFS_PROVIDER}ipfs/`)
  }

  return ipfsUrl
}