import { expect } from 'chai'
import { RemarkResult } from '../../src/mappings/utils/extract'
import { collectionEventFrom, Action } from '../../src/mappings/utils/types'

describe('EVENT TEST', (): void => {
  it('can correctly match sales', async () => {
    const timestamp = new Date('2022-01-01T00:00:00.000Z')
    const remark: RemarkResult = {
      value: '0x0000000000000000000000000000000000000000000000000000000000000001',
      caller: 'DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby',
      blockNumber: '6707036',
      timestamp
    }
    const event = collectionEventFrom(Action.MINT, remark, '')
    expect(event.interaction).to.equal(Action.MINT)
    expect(event.blockNumber).to.equal('6707036')
    expect(event.caller).to.equal('DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby')
    expect(event.meta).to.equal('')
    expect(String(event.timestamp)).to.equal(timestamp.toString())
  })
})