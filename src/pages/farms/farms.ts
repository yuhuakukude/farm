import { ChainId } from '../../constants/chain'
import farms from './farms.json'
export interface FARM {
  index: string
  lpAddress: string
  token0Address: string
  token1Address: string
  token0Name: string
  token1Name: string
  weights: string
  x?: string
}
export const FARMS: { [chainId in ChainId]: FARM[] } = {
  [ChainId.TX]: farms
}
