import { getContract } from '../utils'
import LPABI from '../constants/abis/lpToken.json'
import { useActiveWeb3React } from './index'
import { useMultipleContractSingleData, useSingleCallResult } from '../state/multicall/hooks'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import farms from '../pages/farms/farms.json'
import { Interface } from '@ethersproject/abi'

const LP_INTERFACE = new Interface(LPABI)

function useTVL(amount: string, pairAddress: string) {
  const { library } = useActiveWeb3React()
  const contract = pairAddress && library ? getContract(pairAddress, LPABI, library) : undefined
  const reservesRes = useSingleCallResult(contract, 'getReserves')
  const totalSupplyRes = useSingleCallResult(contract, 'totalSupply')
  const totalSupply = totalSupplyRes?.result?.[0]
  const reserve0 = reservesRes?.result?._reserve0
  const reserve1 = reservesRes?.result?._reserve1

  const token0Amount = useMemo(() => {
    if (!reserve0 || !totalSupply) return undefined
    return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(reserve0)), JSBI.BigInt(totalSupply))
  }, [amount, reserve0, totalSupply])

  const token1Amount = useMemo(() => {
    if (!reserve0 || !totalSupply) return undefined
    return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(reserve1)), JSBI.BigInt(totalSupply))
  }, [amount, reserve0, reserve1, totalSupply])
  return { token0Amount, token1Amount }
}

function useTVLs() {
  const BASE_PAIR_ADDRESS = '0x952259a93fec93628b84c96983a1fbf98ad49958'
  const WTX = '0x68909Fea4ca0e80247da6b974c10f225696e00D6'
  const USTX = '0x58a12868Eec1ba590cB289472b871029CC77FB7c'
  const { library } = useActiveWeb3React()
  const pairAddress = farms.map(({ lpAddress }) => lpAddress)
  const WUContract = library ? getContract(BASE_PAIR_ADDRESS, LPABI, library) : undefined
  const WUReserve = useSingleCallResult(WUContract, 'getReserves')?.result
  const reserveU = USTX.toLowerCase() < WTX.toLowerCase() ? WUReserve?._reserve0 : WUReserve?._reserve1
  const reserveE = USTX.toLowerCase() > WTX.toLowerCase() ? WUReserve?._reserve0 : WUReserve?._reserve1
  const reserves = useMultipleContractSingleData(pairAddress, LP_INTERFACE, 'getReserves')
  const balances = useMultipleContractSingleData(pairAddress, LP_INTERFACE, 'balanceOf', [
    '0x569CD8Db162eC15B947e2a45BB5Dc671DfDe9d00'
  ])
  const totalSupply = useMultipleContractSingleData(pairAddress, LP_INTERFACE, 'totalSupply')

  // const reservesRes = useSingleCallResult(contract, 'getReserves')
  // const balanceRes = useSingleCallResult(contract, 'balanceOf', ['0x569CD8Db162eC15B947e2a45BB5Dc671DfDe9d00'])
  // const totalSupplyRes = useSingleCallResult(contract, 'totalSupply')
  // const totalSupply = totalSupplyRes?.result?.[0]
  // const balance = balanceRes?.result?.[0]
  // const reserve0 = reservesRes?.result?._reserve0
  // const reserve1 = reservesRes?.result?._reserve1

  return useMemo(() => {
    return farms.map(({ token0Address, token1Address }, index) => {
      const token0 = token0Address.toLowerCase() < token1Address ? token0Address : token1Address
      const token1 = token0Address.toLowerCase() > token1Address ? token0Address : token1Address
      const balance = balances?.[index]?.result?.[0]
      const total = totalSupply?.[index]?.result?.[0]
      const reserve0 = reserves?.[index]?.result?._reserve0
      const reserve1 = reserves?.[index]?.result?._reserve1
      if (!balance || !totalSupply || !reserve0 || !reserve1) {
        return undefined
      }
      if (token0.toLowerCase() === '0x58a12868Eec1ba590cB289472b871029CC77FB7c'.toLowerCase()) {
        return JSBI.divide(
          JSBI.multiply(JSBI.BigInt(balance), JSBI.multiply(JSBI.BigInt(reserve0), JSBI.BigInt('2'))),
          JSBI.BigInt(total)
        ).toString()
      }
      if (token1.toLowerCase() === '0x58a12868Eec1ba590cB289472b871029CC77FB7c'.toLowerCase()) {
        return JSBI.divide(
          JSBI.multiply(JSBI.BigInt(balance), JSBI.multiply(JSBI.BigInt(reserve1), JSBI.BigInt('2'))),
          JSBI.BigInt(total)
        ).toString()
      }
      if (token0.toLowerCase() === WTX.toLowerCase()) {
        return JSBI.divide(
          JSBI.multiply(
            JSBI.divide(JSBI.multiply(JSBI.BigInt(balance), JSBI.BigInt(reserve0)), JSBI.BigInt(total)),
            JSBI.BigInt(reserveE)
          ),
          JSBI.BigInt(reserveU)
        )
      }
      if (token1.toLowerCase() === WTX.toLowerCase()) {
        return JSBI.divide(
          JSBI.multiply(
            JSBI.divide(JSBI.multiply(JSBI.BigInt(balance), JSBI.BigInt(reserve1)), JSBI.BigInt(total)),
            JSBI.BigInt(reserveE)
          ),
          JSBI.BigInt(reserveU)
        )
      }
      return undefined
    })
  }, [balances, reserveE, reserveU, reserves, totalSupply])
}

export { useTVL, useTVLs }
