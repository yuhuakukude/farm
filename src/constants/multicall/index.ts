import MULTICALL_ABI from './abi.json'
import { ChainId } from '../chain'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.TX]: '0x657D91B1e6D26b97869a40937382CA3D8302e389'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
