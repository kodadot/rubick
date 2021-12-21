import { expect } from 'chai'
import { sanitizeIpfsUrl, BASE_URL, fetchMetadata, fetchMimeType } from '../../src/mappings/utils/metadata'
import { TokenMetadata as Metadata } from '../../src/mappings/utils/types'

describe('METADATA TEST', (): void => {
  describe('[fn] sanitizeIpfsUrl', () => {
    it('should return the same url if it is not an ipfs url', () => {
      expect(sanitizeIpfsUrl('https://ipfs.io')).to.equal('https://ipfs.io')
    })

    it('should return sanitized IPFS_URL if ipfs://ipfs/', () => {
      const IPFS_URL = 'ipfs://ipfs/QmQJGDSd6rxUZuTFDKaCKzVz6nvQpZ7yVLDLnz2dwvvjZs'
      expect(sanitizeIpfsUrl(IPFS_URL)).to.equal(`${BASE_URL}ipfs/QmQJGDSd6rxUZuTFDKaCKzVz6nvQpZ7yVLDLnz2dwvvjZs`)
    })
  })

  describe('[fn] fetchMetadata', () => {
    it('should return the same url if it is not an ipfs url', async () => {
      const IPFS_URL = 'ipfs://ipfs/QmQJGDSd6rxUZuTFDKaCKzVz6nvQpZ7yVLDLnz2dwvvjZs'
      const metadata = await fetchMetadata<Metadata>({ metadata: IPFS_URL})
      expect(metadata).to.be.an('object')
      expect(metadata).to.have.property('description')
      expect(metadata.description).to.equal('Kusama canary minimal abstract art. ')
      expect(metadata).to.have.property('image')
      expect(metadata.image).to.equal('ipfs://ipfs/QmPSNJKhbRWREaj1znRRRchJCYciHGPFTXFYGRWTdk7ibm')
    })
  })

  describe('[fn] fetchMimeType', () => {
    it('should return the same url if it is not an ipfs url', async () => {
      const IPFS_URL = 'ipfs://ipfs/QmPSNJKhbRWREaj1znRRRchJCYciHGPFTXFYGRWTdk7ibm'
      const mimeType = await fetchMimeType(IPFS_URL)
      expect(mimeType).to.equal('image/png')
    })
  })
})