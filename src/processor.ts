import { lookupArchive } from '@subsquid/archive-registry'
import { SubstrateProcessor } from '@subsquid/substrate-processor'
import { FullTypeormDatabase as Database } from '@subsquid/typeorm-store'
import * as mappings from './mappings'
import { extractExtra, extractRemark } from './mappings/utils'
import { SystemRemarkCall } from './types/calls'
import { unwrapRemark } from '@kodadot1/minimark'

const processor = new SubstrateProcessor(new Database())

processor.setTypesBundle('kusama');
processor.setBatchSize(500);
processor.setBlockRange({from:5756453});
processor.setDataSource({
    archive: lookupArchive("kusama", { release: "FireSquid" }),
    chain: 'wss://kusama-rpc.polkadot.io'
});

// processor.addCallHandler('System.remark', mappings.handleRemark);
// processor.addCallHandler('Utility.batch_all', mappings.handleBatchAll);
// processor.addCallHandler('Utility.batch', mappings.handleBatch);

processor.addCallHandler('System.remark', { range: { from: 13445851, to: 13445851 } } , async ctx => {
    const { remark } = new SystemRemarkCall(ctx).asV1020
    // const records = extractRemark(remark.toString(), ctx)
    const records = unwrapRemark(remark.toString())
    const extra = extractExtra(ctx)
    console.log('[NAME]', ctx.extrinsic.call.name)
    console.log('[ARGS]', extra)
    console.log('[RMRK]', records)
    
    // console.log(ctx.block.height)
});

processor.run();