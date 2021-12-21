import { expect } from 'chai'
import { isPositiveOrElseError } from '../../src/mappings/utils/consolidator'

describe('CONSOLIDATOR TEST', (): void => {
  describe('[fn] isPositiveOrElseError', () => {
    it('should return true if the value is positive', () => {
      expect(() => isPositiveOrElseError(BigInt(1))).not.to.throw();
    })
    it('should return false if the value is zero', () => {
      expect(() => isPositiveOrElseError(BigInt(0))).not.to.throw();
    })
    it('should throw false if the value is zero and exclude zero', () => {
      expect(() => isPositiveOrElseError(BigInt(0), true)).to.throw(ReferenceError)
    })
  })
})