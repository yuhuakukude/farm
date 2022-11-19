import { ChainId } from '../../constants/chain'
import farms from './farms.json'
export interface FARM {
  lpAddress: string
  token0Address: string
  token1Address: string
  token0Name: string
  token1Name: string
}
export const FARMS: { [chainId in ChainId]: FARM[] } = {
  [ChainId.BSCTEST]: farms,
  [ChainId.BSC]: farms
}
