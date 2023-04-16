import { lookupArchive } from '@subsquid/archive-registry'
import { SubstrateProcessor } from '@subsquid/substrate-processor'
import { FullTypeormDatabase as Database } from '@subsquid/typeorm-store'
import * as mappings from './mappings'

const processor = new SubstrateProcessor(new Database())

const STARTING_BLOCK_V1 = 5_756_453;
const STARTING_BLOCK = 10_269_144; // 8788586
const ENDING_BLOCK = undefined; // 16261119;

processor.setTypesBundle('kusama');
// processor.setBlockRange({ from: 5756453 });
processor.setBlockRange({ from: STARTING_BLOCK, to: ENDING_BLOCK });
processor.setDataSource({
    archive: lookupArchive("kusama", { release: "FireSquid" }),
    chain: 'wss://kusama-rpc.polkadot.io'
});

processor.addCallHandler('System.remark', mappings.handleRemark);

processor.run();