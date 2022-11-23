import MULTICALL_ABI from './abi.json'
import { ChainId } from '../chain'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.TX]: '0x0BEB432ab375b031a755237fd738766658dedB6c'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
