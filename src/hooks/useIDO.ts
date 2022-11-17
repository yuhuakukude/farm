import { useActiveWeb3React } from './index'
import { useRAMContract } from './useContract'
import { CurrencyAmount, ETHER, TokenAmount } from '../constants/token'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCallback, useMemo } from 'react'
import JSBI from 'jsbi'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { USDT } from '../constants'
import { useI18n } from 'react-simple-i18n'
import { tryParseAmount } from 'utils/parseAmount'

const mockTimeStamp = [1668567600000, 1668600000000]
const mockMax = 90000
function mockAdd() {
  const curTime = new Date().getTime()
  if (curTime < mockTimeStamp[0]) return CurrencyAmount.ether(JSBI.BigInt(0))

  const gap = mockTimeStamp[1] - mockTimeStamp[0]
  const passTime = curTime - mockTimeStamp[0]
  const per = passTime > gap ? 1 : passTime / gap
  const _add = mockMax * per
  const ret = tryParseAmount(_add.toFixed(18), ETHER)
  return ret ? ret : CurrencyAmount.ether(JSBI.BigInt(0))
}
export function useIDO() {
  const { account, chainId } = useActiveWeb3React()
  const contract = useRAMContract()
  const totalSale = CurrencyAmount.ether(JSBI.BigInt('60000000000000000000000000'))
  const totalSaleWithAccount = useSingleCallResult(contract, 'soldAmountInPaymentOf', [account ?? undefined])
  const accountAmount = useSingleCallResult(contract, 'soldAmountOf', [account ?? undefined])
  // const totalSoleAmount = useSingleCallResult(contract, 'totalSoldAmount')
  const totalSoleAmountInUSDT = useSingleCallResult(contract, 'totalSoldAmountInPayment')

  const _totalSoleAmountInUSDT = useMemo(() => {
    const _mockAdd = mockAdd()
    return totalSoleAmountInUSDT?.result
      ? CurrencyAmount.ether(totalSoleAmountInUSDT?.result?.[0]).add(_mockAdd)
      : undefined
  }, [totalSoleAmountInUSDT?.result])

  const _totalSoleAmount = useMemo(() => _totalSoleAmountInUSDT?.multiply(JSBI.BigInt(400)), [_totalSoleAmountInUSDT])

  return {
    totalSale,
    accountAmount: accountAmount?.result ? CurrencyAmount.ether(accountAmount.result?.[0].toString()) : undefined,
    totalSaleUSDTWithAccount: totalSaleWithAccount?.result
      ? new TokenAmount(USDT[chainId ?? 56], totalSaleWithAccount?.result?.[0].toString())
      : undefined,
    // totalSoleAmount: totalSoleAmount?.result ? CurrencyAmount.ether(totalSoleAmount?.result?.[0]) : undefined,
    totalSoleAmount: _totalSoleAmount ? CurrencyAmount.ether(_totalSoleAmount.numerator.toString()) : undefined,
    totalSoleAmountInUSDT: _totalSoleAmountInUSDT
  }
}

export function useMint() {
  const { t } = useI18n()
  const addTransaction = useTransactionAdder()
  const contract = useRAMContract()
  const { account } = useActiveWeb3React()
  const mint = useCallback(
    async (amount: CurrencyAmount) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      if (amount.equalTo(JSBI.BigInt('0'))) throw new Error('amount is un support')
      const args = [amount.raw.toString()]
      const method = 'participate'
      console.log('🚀 ~ file: useBuyBong.ts ~ line 18 ~ args', args, method)
      return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
        return contract[method](...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `${t('buy')} ${amount
              .multiply(JSBI.BigInt('5'))
              .toSignificant(4, { groupSeparator: ',' })
              .toString()}  RAM ${t('with')} ${amount.toSignificant()} USDT`
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, contract, t]
  )

  return {
    mint
  }
}
