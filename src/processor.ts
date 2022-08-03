import { lookupArchive } from '@subsquid/archive-registry'
import { SubstrateProcessor } from '@subsquid/substrate-processor'
import { FullTypeormDatabase as Database } from '@subsquid/typeorm-store'
import * as mappings from './mappings'

const processor = new SubstrateProcessor(new Database())

processor.setTypesBundle('kusama');
processor.setBatchSize(500);
processor.setBlockRange({from:5756453});
processor.setDataSource({
    archive: lookupArchive("kusama", { release: "FireSquid" }),
    chain: 'wss://kusama-rpc.polkadot.io'
});

processor.addCallHandler('System.remark', mappings.handleRemark);

// DEV
// good test values from start { from: 5756453, to: 5828351 } }
// processor.addCallHandler('System.remark', { range: { from: 13445851, to: 13445851 } } , async ctx => {
//     const kek = unwrap(ctx, getCreateToken)
//     const extra = extractExtra(ctx)
//     console.log('[NAME]', ctx.extrinsic.call.name)
//     console.log('[EXTRA]', ctx.call.parent?.args?.calls)
//     console.log('[EXTRA]', ctx.call.parent?.args?.calls?.at(0)?.value)
//     console.log('[ARGS]', extra)
//     console.log('[RMRK]', kek)
// });

processor.run();