import { useActiveWeb3React } from './index'
import { FARMS } from '../pages/farms/farms'

function useFarmInfos() {
  const { chainId } = useActiveWeb3React()
  const farms = FARMS[chainId ?? 56]
  return farms.map(farm => {
    return { base: farm }
  })
}

export { useFarmInfos }
