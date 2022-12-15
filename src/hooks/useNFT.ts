import { useFarmNFTContract } from './useContract'
import { useCallback } from 'react'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from './index'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'

export function useNFT() {
  const { account } = useActiveWeb3React()
  const contract = useFarmNFTContract()
  const addTransaction = useTransactionAdder()

  const count = useSingleCallResult(contract, 'balanceOf', [account ?? undefined])
  const ids = count && account && count.result ? Array.from(new Array(parseInt(count.result?.[0])).keys()).slice(0) : []
  const args = account
    ? ids.map(item => {
        return [account, item]
      })
    : []
  const nftIds = useSingleContractMultipleData(contract, 'tokenOfOwnerByIndex', args)

  const mint = useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')

    const args = ['1']
    const method = 'purchase'
    console.log('🚀 ~ file: useNFT.ts ~ line 20 ~ args', args, method)
    return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
      return contract[method](...args, {
        gasLimit: calculateGasMargin(estimatedGasLimit),
        // gasLimit: '3500000',
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `铸造NFT`
        })
        return response.hash
      })
    })
  }, [account, addTransaction, contract])

  return {
    mint,
    nfts: nftIds.map(item => {
      return item.result?.[0].toString()
    })
  }
}
