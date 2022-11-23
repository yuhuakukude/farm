import { getContract } from '../utils'
import LPABI from '../constants/abis/lpToken.json'
import { useActiveWeb3React } from './index'
import { useSingleCallResult } from '../state/multicall/hooks'
import JSBI from 'jsbi'
import { useMemo } from 'react'
function useTVL(amount: string, pairAddress: string, token0: string, token1: string) {
  const BASE_PAIR_ADDRESS = '0x952259a93fec93628b84c96983a1fbf98ad49958'
  const WTX = '0x68909Fea4ca0e80247da6b974c10f225696e00D6'
  const USTX = '0x58a12868Eec1ba590cB289472b871029CC77FB7c'
  const { library } = useActiveWeb3React()
  const contract = pairAddress && library ? getContract(pairAddress, LPABI, library) : undefined
  const WUContract = library ? getContract(BASE_PAIR_ADDRESS, LPABI, library) : undefined
  const WUReserve = useSingleCallResult(WUContract, 'getReserves')?.result
  const reserveU = USTX.toLowerCase() < WTX.toLowerCase() ? WUReserve?._reserve0 : WUReserve?._reserve1
  const reserveE = USTX.toLowerCase() > WTX.toLowerCase() ? WUReserve?._reserve0 : WUReserve?._reserve1
  const reservesRes = useSingleCallResult(contract, 'getReserves')
  const balanceRes = useSingleCallResult(contract, 'balanceOf', ['0x569CD8Db162eC15B947e2a45BB5Dc671DfDe9d00'])
  const totalSupplyRes = useSingleCallResult(contract, 'totalSupply')
  const totalSupply = totalSupplyRes?.result?.[0]
  const balance = balanceRes?.result?.[0]
  const reserve0 = reservesRes?.result?._reserve0
  const reserve1 = reservesRes?.result?._reserve1
  const tvl = useMemo(() => {
    if (!balance || !totalSupply || !reserve0 || !reserve1 || !reserveU || !reserveE) {
      return undefined
    }
    if (token0.toLowerCase() === '0x58a12868Eec1ba590cB289472b871029CC77FB7c'.toLowerCase()) {
      return JSBI.divide(
        JSBI.multiply(JSBI.BigInt(balance), JSBI.multiply(JSBI.BigInt(reserve0), JSBI.BigInt('2'))),
        JSBI.BigInt(totalSupply)
      ).toString()
    }
    if (token1.toLowerCase() === '0x58a12868Eec1ba590cB289472b871029CC77FB7c'.toLowerCase()) {
      return JSBI.divide(
        JSBI.multiply(JSBI.BigInt(balance), JSBI.multiply(JSBI.BigInt(reserve1), JSBI.BigInt('2'))),
        JSBI.BigInt(totalSupply)
      ).toString()
    }
    if (token0.toLowerCase() === WTX.toLowerCase()) {
      return JSBI.divide(
        JSBI.multiply(
          JSBI.divide(JSBI.multiply(JSBI.BigInt(balance), JSBI.BigInt(reserve0)), JSBI.BigInt(totalSupply)),
          JSBI.BigInt(reserveE)
        ),
        JSBI.BigInt(reserveU)
      )
    }
    if (token1.toLowerCase() === WTX.toLowerCase()) {
      return JSBI.divide(
        JSBI.multiply(
          JSBI.divide(JSBI.multiply(JSBI.BigInt(balance), JSBI.BigInt(reserve1)), JSBI.BigInt(totalSupply)),
          JSBI.BigInt(reserveE)
        ),
        JSBI.BigInt(reserveU)
      )
    }

    return undefined
  }, [balance, reserve0, reserve1, reserveE, reserveU, token0, token1, totalSupply])

  const token0Amount = useMemo(() => {
    if (!reserve0 || !totalSupply) return undefined
    return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(reserve0)), JSBI.BigInt(totalSupply))
  }, [amount, reserve0, totalSupply])

  const token1Amount = useMemo(() => {
    if (!reserve0 || !totalSupply) return undefined
    return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(reserve1)), JSBI.BigInt(totalSupply))
  }, [amount, reserve0, reserve1, totalSupply])
  return { tvl, token0Amount, token1Amount }
}

export { useTVL }
