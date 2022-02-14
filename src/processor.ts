import { SubstrateProcessor } from '@subsquid/substrate-processor'
import * as mappings from './mappings'

const processor = new SubstrateProcessor('kusama_remark');

processor.setTypesBundle('kusama');
processor.setBatchSize(500);
processor.setBlockRange({from:5756453});
processor.setDataSource({
    archive: 'https://kusama.indexer.gc.subsquid.io/v4/graphql',
    chain: 'wss://kusama-rpc.polkadot.io'
});

processor.addExtrinsicHandler('system.remark', mappings.handleRemark);
processor.addExtrinsicHandler('utility.batchAll', mappings.handleBatchAll);
processor.addExtrinsicHandler('utility.batch', mappings.handleBatch);

processor.run();