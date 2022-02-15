import { SubstrateExtrinsic } from '@subsquid/substrate-processor'
import { System } from '../../src/types'
import { extractRemark } from '../../src/mappings/utils'
import { BatchArg, Context } from '../../src/mappings/utils/types'
import { isBalanceTransfer } from '../../src/mappings/utils/consolidator'
import { expect } from 'chai'

describe('Process TEST', (): void => {
  it('can correctly process system.remark', () => {
    const extrinsic: SubstrateExtrinsic = {
      id: '0004892977-000001-18963',
      method: 'remark',
      section: 'system',
      versionInfo: '132',
      signer: 'DmUVjSi8id22vcH26btyVsVq39p8EVPiepdBEYhzoLL8Qby',
      args: [
        {
          name: '_remark',
          type: 'Bytes',
          value: '0x726d726b3a3a4d494e544e46543a3a253742253232636f6c6c656374696f6e253232253341253232323431423835313635313646333831412d4f4b534d2532322532432532326e616d652532322533412532324b7573616d61253230437562652532322532432532327472616e7366657261626c6525323225334131253243253232736e253232253341253232303030303030303030303030303030312532322532432532326d65746164617461253232253341253232697066732533412f2f697066732f516d5147466e6f484352744163506157636f69544848544a37544568727075723557625a536a5a64655933624570253232253744'
        }
      ],
      signature: '0xde3378de53c870f44db722b8d5201500e5c9b475bf57c21d5fe1291b3a9e111281e7a1d1a2defe7230f6602bd6163b5c0177e04eb644f039790084a44eb1eb88',
      hash: '0x5ef15ca9848c142875dbe07356d685929650b21ef2c9f48d7a7111d6f98d29dd',
      tip: 0n,
      indexInBlock: 1
    }

    const block = {
      height: 4892977,
      timestamp: 1640009369
    }

    
    const remark = new System.RemarkCall(extrinsic).remark
    const records = extractRemark(remark.toString(), { extrinsic, block } as Context)
    expect(records).to.be.an('array')
    expect(records).to.have.lengthOf(1)
    const collection = records[0]
    expect(collection).to.have.property('value')
    const a = '0x726d726b3a3a4d494e544e46543a3a253742253232636f6c6c656374696f6e253232253341253232323431423835313635313646333831412d4f4b534d2532322532432532326e616d652532322533412532324b7573616d61253230437562652532322532432532327472616e7366657261626c6525323225334131253243253232736e253232253341253232303030303030303030303030303030312532322532432532326d65746164617461253232253341253232697066732533412f2f697066732f516d5147466e6f484352744163506157636f69544848544a37544568727075723557625a536a5a64655933624570253232253744'
    expect(collection.value).to.equal(a)
  })

  it('can correctly process utility.batchAll', () => {
    const args = [
      {
        "args": {
          "_remark": "0x524d524b3a3a4d494e543a3a312e302e303a3a25374225323269642532322533412532323930304431394443374433433434344534432d434e522532322532432532325f696425323225334125323225323225324325323273796d626f6c253232253341253232434e522532322532432532326973737565722532322533412532324671434a65476350696459537376766d54313766485661596445326e584d59675073426e33435039677567765a523525323225324325323276657273696f6e253232253341253232312e302e302532322532432532326e616d6525323225334125323243414e4152592532322532432532326d6178253232253341312532432532326d657461646174612532322533412532326970667325334125324625324669706673253246516d514a47445364367278555a755446444b61434b7a567a366e7651705a3779564c444c6e7a32647776766a5a73253232253744"
        },
        "callIndex": "0x0001"
      },
      {
        "args": {
          "_remark": "0x524d524b3a3a4d494e544e46543a3a312e302e303a3a253742253232636f6c6c656374696f6e2532322533412532323930304431394443374433433434344534432d434e52253232253243253232736e253232253341253232303030303030303030303030303030312532322532432532327472616e7366657261626c65253232253341312532432532326e616d6525323225334125323243414e4152592532322532432532326d657461646174612532322533412532326970667325334125324625324669706673253246516d514a47445364367278555a755446444b61434b7a567a366e7651705a3779564c444c6e7a32647776766a5a7325323225324325323263757272656e744f776e65722532322533412532324671434a65476350696459537376766d54313766485661596445326e584d59675073426e33435039677567765a5235253232253243253232696e7374616e636525323225334125323243414e415259253232253744"
        },
        "callIndex": "0x0001"
      }
    ]
    const extrinsic: SubstrateExtrinsic = {
      id: '0006707036-000001-f7b5d',
      method: 'batchAll',
      section: 'utility',
      versionInfo: '132',
      signer: 'FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5',
      args: [ { name: 'calls', type: 'Vec<Call>', value: args } ],
      signature: '0x8a8b6a5540c08f60f60b2b1c85e7d1fcbfbe613a93f4ee4dbd54e787a6b14668cc5862c4447216f7b32a38431f5cd93279c642b4a2c57f1e5f5ef8e206949389',
      hash: '0xc129677d4fd196ce3a5ccdbce3b7cc10f0c4f715309bbdaabd14e3304e952bcc',
      tip: 0n,
      indexInBlock: 1
    }

    const block = {
      height: 6707036,
      timestamp: 1640009369
    }

    
    const records = extractRemark(extrinsic, { extrinsic, block } as Context)
    expect(records).to.be.an('array')
    expect(records).to.have.lengthOf(2)
    const collection = records[0]
    expect(collection).to.have.property('value')
    const a = '0x524d524b3a3a4d494e543a3a312e302e303a3a25374225323269642532322533412532323930304431394443374433433434344534432d434e522532322532432532325f696425323225334125323225323225324325323273796d626f6c253232253341253232434e522532322532432532326973737565722532322533412532324671434a65476350696459537376766d54313766485661596445326e584d59675073426e33435039677567765a523525323225324325323276657273696f6e253232253341253232312e302e302532322532432532326e616d6525323225334125323243414e4152592532322532432532326d6178253232253341312532432532326d657461646174612532322533412532326970667325334125324625324669706673253246516d514a47445364367278555a755446444b61434b7a567a366e7651705a3779564c444c6e7a32647776766a5a73253232253744'
    expect(collection.value).to.equal(a)
  })

  it('can correctly process utility.batch without remark (10603638)',  () => {
    const args = [
      {
        "args": {
          "era": 3125,
          "validator_stash": "GZvxvwKGaZyq21BHnrUpdQkpcF4jrCsi23d3c6dvsmp6BF8"
        },
        "callIndex": "0x0612"
      },
      {
        "args": {
          "era": 3126,
          "validator_stash": "GZvxvwKGaZyq21BHnrUpdQkpcF4jrCsi23d3c6dvsmp6BF8"
        },
        "callIndex": "0x0612"
      },
      {
        "args": {
          "era": 3127,
          "validator_stash": "GZvxvwKGaZyq21BHnrUpdQkpcF4jrCsi23d3c6dvsmp6BF8"
        },
        "callIndex": "0x0612"
      },
      {
        "args": {
          "era": 3128,
          "validator_stash": "GZvxvwKGaZyq21BHnrUpdQkpcF4jrCsi23d3c6dvsmp6BF8"
        },
        "callIndex": "0x0612"
      }
    ]
    const extrinsic: SubstrateExtrinsic = {
      id: '0010603638-000003-5f672',
      method: 'batch',
      section: 'utility',
      versionInfo: '132',
      signer: 'HUiGJZvDT7zH3tR1xoPSbSRi4C2fRfQMt53a2Vr9rV4MSdh',
      args: [ { name: 'calls', type: 'Vec<Call>', value: args } ],
      signature: '0x6cce4d021dd5a1f8930028036a59530703c55f8beccd6ca3fc5c142b7cf4072145ffdaceb7e8008c1a38d6e6f87d0582f914a26e1af568366f502d6c25dbe487',
      hash: '0x58ac3856701ab62a83ab58fe53b5913889e3380b7d5c97421929cffefcb8d552',
      tip: 0n,
      indexInBlock: 1
    }

    const block = {
      height: 10603638,
      timestamp: 1640009369
    }

    const records = extractRemark(extrinsic, { extrinsic, block } as Context)
    expect(records).to.be.an('array')
    expect(records).to.have.lengthOf(0)
  })

  it('can correctly process utility.batch with balance (10603640)',  () => {
    const args: BatchArg[] = [
      {
        "args": {
          "remark": "0x524d524b3a3a4255593a3a312e302e303a3a31303630313533362d6361346139623263346532343430346630392d35364243462d4d414f5f434f4c4c454354494f4e5f32335f4f525f53555045525f464f554e4445522d30303030303030303030303030323432"
        },
        "callIndex": "0x0001"
      },
      {
        "args": {
          "dest": {
            "id": "H9ZMSFU5nyVsaN7DDC9NzMb7zbdHd8dWbNmc5XpQqFW12yq"
          },
          "value": 3920000000000
        },
        "callIndex": "0x0400"
      },
      {
        "args": {
          "dest": {
            "id": "HKKT5DjFaUE339m7ZWS2yutjecbUpBcDQZHw2EF7SFqSFJH"
          },
          "value": 80000000000
        },
        "callIndex": "0x0400"
      }
    ]
    const extrinsic: SubstrateExtrinsic = {
      id: '0010603640-000006-06a8e',
      method: 'batchAll',
      section: 'utility',
      versionInfo: '132',
      signer: 'EmMeMjodt7EWToRKR9sDZAEZx1MuDC8cNaX2YdwfDWbZKU5',
      args: [ { name: 'calls', type: 'Vec<Call>', value: args } ],
      signature: '0xaaa15b17dcbe6cc76d53d1048d99213d2f4b037d98a07257f3c02a2fb48ebe5a8bfd914329ebce05306929de8b5ae6c874bda6794169cca3523e671ca7670184',
      hash: '0xae2adf791931170bd0517db3362b770fcc7667552c85e8551225bf186bd02c1c',
      tip: 0n,
      indexInBlock: 1
    }

    const block = {
      height: 10603640,
      timestamp: 1640009369
    }

    const records = extractRemark(extrinsic, { extrinsic, block } as Context)
    expect(records).to.be.an('array')
    expect(records).to.have.lengthOf(1)
    const collection = records[0]
    expect(collection).to.have.property('value')
    const a = '0x524d524b3a3a4255593a3a312e302e303a3a31303630313533362d6361346139623263346532343430346630392d35364243462d4d414f5f434f4c4c454354494f4e5f32335f4f525f53555045525f464f554e4445522d30303030303030303030303030323432'
    expect(collection.value).to.equal(a)
    expect(collection).to.have.property('extra')
    expect(collection.extra).to.be.an('array')
    expect(collection.extra).to.have.lengthOf(2)
    const extra = (collection.extra as BatchArg[])[0]
    expect(isBalanceTransfer(extra)).to.equal(true)
  })
})


