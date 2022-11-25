import { useActiveWeb3React } from './index'
import { FARM, FARMS } from '../pages/farms/farms'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useFarmContract } from './useContract'
import { useCallback } from 'react'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { TokenAmount } from '../constants/token'
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import JSBI from 'jsbi'

function useFarmInfos() {
  const { chainId } = useActiveWeb3React()
  const farms = FARMS[chainId ?? 8989]
  const contract = useFarmContract()
  const pools = useSingleContractMultipleData(contract, 'poolInfos', [['0'], ['1'], ['2']])
  const totalAllocPoint = useSingleCallResult(contract, 'totalAllocPoint')?.result?.[0]
  const peaCount = useSingleCallResult(contract, 'peaPerBlock')?.result?.[0]
  return farms.map((farm, index) => {
    const point = pools[index]?.result?.allocPoint
    farm.x =
      point && totalAllocPoint && peaCount
        ? JSBI.divide(JSBI.multiply(JSBI.BigInt(peaCount), JSBI.BigInt(point)), JSBI.BigInt(totalAllocPoint)).toString()
        : '0'
    return farm
  })
}

function useUserInfo(farm: FARM) {
  const contract = useFarmContract()
  const { account } = useActiveWeb3React()
  const userRes = useSingleCallResult(contract, 'userInfo', account ? [farm.index, account] : [undefined, undefined])
  const rewardsRes = useSingleCallResult(
    contract,
    'getPendingReward',
    account ? [farm.lpAddress, account] : [undefined, undefined]
  )
  const res = userRes.result
  return {
    depositedAmount: res ? res.amount.toString() : undefined,
    claimedAmount: res ? res.claimedAmount.toString() : undefined,
    pendingRewards: rewardsRes.result ? rewardsRes.result?.[0].toString() : undefined
  }
}

export function useAuctions() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmContract()
  const { account } = useActiveWeb3React()
  const deposit = useCallback(
    async (amount: TokenAmount | undefined) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      if (!amount) throw new Error('none amount')

      const args = [amount.token.address, amount.raw.toString()]
      const method = 'deposit'
      console.log('🚀 ~ file: useBuyBong.ts ~ line 18 ~ args', args, method)
      return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
        return contract[method](...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `质押`
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, contract]
  )

  const withdraw = useCallback(
    async (amount: TokenAmount | undefined) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      if (!amount) throw new Error('none amount')

      const args = [amount.token.address, amount.raw.toString()]
      const method = 'withdraw'
      console.log('🚀 ~ file: useBuyBong.ts ~ line 18 ~ args', args, method)
      return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
        return contract[method](...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `质押`
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, contract]
  )

  const claim = useCallback(
    async (lpAddress: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const method = 'claim'
      const args = [lpAddress]
      console.log('🚀 ~ file: useBuyBong.ts ~ line 18 ~ args', method)
      return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
        return contract[method](...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `领取奖励`
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, contract]
  )

  return {
    deposit,
    withdraw,
    claim
  }
}

export { useFarmInfos, useUserInfo }
