import { expect } from 'chai'
import { sanitizeIpfsUrl, IPFS_PROVIDER } from '../../src/mappings/utils/metadata'

describe.only('METADATA TEST', (): void => {
  describe('[fn] sanitizeIpfsUrl', () => {
    it('should return the same url if it is not an ipfs url', () => {
      expect(sanitizeIpfsUrl('https://ipfs.io')).to.equal('https://ipfs.io')
    })
    
    it('should return sanitized IPFS_URL if ipfs://ipfs/', () => {
      const IPFS_URL = 'ipfs://ipfs/QmQJGDSd6rxUZuTFDKaCKzVz6nvQpZ7yVLDLnz2dwvvjZs'
      expect(sanitizeIpfsUrl(IPFS_URL)).to.equal(`${IPFS_PROVIDER}ipfs/QmQJGDSd6rxUZuTFDKaCKzVz6nvQpZ7yVLDLnz2dwvvjZs`)
    })
  })
})