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
let peaPrice: string | undefined = undefined

function useTVLs() {
  const ONE_AMOUNT = JSBI.BigInt('1000000000000000000')
  const BASE_PAIR_ADDRESS = '0x96b0809f2aa0b0ae6e379d36c2254151a0b1c2a2'
  const PU_PAIR_ADDRESS = '0xA38d53bA758A656C3D7004b1f2C6278124270261'
  const WTX = '0x68909Fea4ca0e80247da6b974c10f225696e00D6'
  const USTX = '0xa8210fc1387c26230598d056f01e19eaa9ffffff'
  const PEA = '0xd406D5A414419B43d54444b11e894711108CB0d9'
  const { library } = useActiveWeb3React()
  const pairAddress = farms.map(({ lpAddress }) => lpAddress)
  const WUContract = library ? getContract(BASE_PAIR_ADDRESS, LPABI, library) : undefined
  const WUReserve = useSingleCallResult(WUContract, 'getReserves')?.result
  const WUTotalSupply = useSingleCallResult(WUContract, 'totalSupply')?.result
  const reserveU = USTX.toLowerCase() < WTX.toLowerCase() ? WUReserve?._reserve0 : WUReserve?._reserve1
  const reserveE = USTX.toLowerCase() > WTX.toLowerCase() ? WUReserve?._reserve0 : WUReserve?._reserve1
  const reserves = useMultipleContractSingleData(pairAddress, LP_INTERFACE, 'getReserves')
  const balances = useMultipleContractSingleData(pairAddress, LP_INTERFACE, 'balanceOf', [
    '0xfccf0B208a958310aFEeFBd817ACC30D8cEDa575'
  ])
  const totalSupply = useMultipleContractSingleData(pairAddress, LP_INTERFACE, 'totalSupply')
  const tvls = useMemo(() => {
    return farms.map(({ token0Address, token1Address, lpAddress }, index) => {
      let tvl: string | undefined = undefined
      let lpPrice: string | undefined = undefined
      const token0 = token0Address.toLowerCase() < token1Address ? token0Address : token1Address
      const token1 = token0Address.toLowerCase() > token1Address ? token0Address : token1Address
      const balance = balances?.[index]?.result?.[0]
      const total = totalSupply?.[index]?.result?.[0]
      const reserve0 = reserves?.[index]?.result?._reserve0
      const reserve1 = reserves?.[index]?.result?._reserve1
      if (!balance || !totalSupply || !reserve0 || !reserve1 || !WUTotalSupply) {
        return { tvl, lpPrice }
      }
      //查询pea价格
      if (PU_PAIR_ADDRESS.toLowerCase() === lpAddress.toLowerCase() && !peaPrice) {
        peaPrice =
          PEA.toLowerCase() < USTX.toLowerCase()
            ? JSBI.divide(
                JSBI.multiply(JSBI.BigInt(reserve1), JSBI.BigInt('1000000000000000000')),
                JSBI.BigInt(reserve0)
              ).toString()
            : JSBI.divide(
                JSBI.multiply(JSBI.BigInt(reserve0), JSBI.BigInt('1000000000000000000')),
                JSBI.BigInt(reserve1)
              ).toString()
      }
      if (token0.toLowerCase() === USTX.toLowerCase()) {
        lpPrice = JSBI.divide(
          JSBI.multiply(ONE_AMOUNT, JSBI.multiply(JSBI.BigInt(reserve0), JSBI.BigInt('2'))),
          JSBI.BigInt(total)
        ).toString()
      }
      if (token1.toLowerCase() === USTX.toLowerCase()) {
        lpPrice = JSBI.divide(
          JSBI.multiply(ONE_AMOUNT, JSBI.multiply(JSBI.BigInt(reserve1), JSBI.BigInt('2'))),
          JSBI.BigInt(total)
        ).toString()
      }
      if (token0.toLowerCase() === WTX.toLowerCase()) {
        lpPrice = JSBI.divide(
          JSBI.multiply(
            ONE_AMOUNT,
            JSBI.multiply(JSBI.multiply(JSBI.BigInt(reserve0), JSBI.BigInt(reserveU)), JSBI.BigInt('2'))
          ),
          JSBI.multiply(JSBI.BigInt(reserveE), JSBI.BigInt(total))
        ).toString()
      }
      if (token1.toLowerCase() === WTX.toLowerCase()) {
        lpPrice = JSBI.divide(
          JSBI.multiply(
            ONE_AMOUNT,
            JSBI.multiply(JSBI.multiply(JSBI.BigInt(reserve1), JSBI.BigInt(reserveU)), JSBI.BigInt('2'))
          ),
          JSBI.multiply(JSBI.BigInt(reserveE), JSBI.BigInt(total))
        ).toString()
      }
      tvl = lpPrice
        ? JSBI.divide(JSBI.multiply(JSBI.BigInt(balance), JSBI.BigInt(lpPrice)), ONE_AMOUNT).toString()
        : undefined

      return { tvl, lpPrice, balance: balance?.toString() }
    })
  }, [ONE_AMOUNT, WUTotalSupply, balances, reserveE, reserveU, reserves, totalSupply])

  return { tvls, peaPrice }
}

export { useTVL, useTVLs }
