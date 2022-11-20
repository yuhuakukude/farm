import { Box, Stack } from '@mui/material'
import Image from 'components/Image'
import Modal from 'components/Modal'
import close from 'assets/images/close.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { OutBox, StyledBetweenCenter, Text2 } from '.'
import Button from 'components/Button/Button'
import { FARM } from './farms'
import { useTokenBalance } from '../../state/wallet/hooks'
import { Percent, Token, TokenAmount } from '../../constants/token'
import { useActiveWeb3React } from '../../hooks'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from '../../hooks/useModal'
import { useCallback, useMemo, useState } from 'react'
import TransactionSubmittedModal from '../../components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useAuctions } from '../../hooks/useFarm'
import MessageBox from '../../components/Modal/TransactionModals/MessageBox'
import JSBI from 'jsbi'

export default function StakeModal({
  customIsOpen,
  customOnDismiss,
  farm,
  lpToken
}: {
  customIsOpen: boolean
  customOnDismiss: () => void
  farm: FARM
  lpToken?: Token
}) {
  const isSmDown = useBreakpoint('sm')
  const { account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const [present, setPresent] = useState('25')
  const presents = ['25', '50', '75', '100']
  const lpBalance = useTokenBalance(account ?? undefined, lpToken)
  const depositAmount = useMemo(() => {
    return (
      lpBalance?.token &&
      new TokenAmount(lpBalance?.token, new Percent(present, '100').multiply(lpBalance?.raw).quotient)
    )
  }, [lpBalance?.raw, lpBalance?.token, present])
  const { deposit } = useAuctions()
  const depositCallback = useCallback(async () => {
    showModal(<TransactionPendingModal />)
    deposit(depositAmount)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [deposit, depositAmount, hideModal, showModal])
  return (
    <Modal width="750px" maxWidth="750px" customIsOpen={customIsOpen} customOnDismiss={customOnDismiss}>
      <Box>
        <StyledBetweenCenter
          sx={{
            padding: { xs: 20, sm: 30 },
            borderBottom: '1px solid #E8E8E8'
          }}
        >
          <Text2>质押LP代币</Text2>
          <Image src={close} width={isSmDown ? 16 : 24} onClick={customOnDismiss} />
        </StyledBetweenCenter>
        <Stack
          spacing={20}
          sx={{
            padding: { xs: 20, sm: 30 }
          }}
        >
          <OutBox>
            <StyledBetweenCenter>
              <Text2>质押</Text2>
              <Text2>余额：{lpBalance ? lpBalance.toSignificant(6) : '--'}</Text2>
            </StyledBetweenCenter>
            <StyledBetweenCenter>
              <Text2>{depositAmount ? depositAmount.toSignificant() : '0'}</Text2>
              <Text2>
                {farm.token0Name}-{farm.token1Name} LP
              </Text2>
            </StyledBetweenCenter>
          </OutBox>
          <StyledBetweenCenter>
            <Text2 style={{ color: '#666666' }}>当前汇率下的年度投资回报率：</Text2>
            <Text2>$--</Text2>
          </StyledBetweenCenter>
          <Stack spacing={15} direction={'row'}>
            {presents.map(value => {
              return (
                <Button
                  style={{
                    width: 80,
                    height: 30,
                    borderRadius: 15
                  }}
                  classname="global-box-shadow1"
                  key={value}
                  onClick={() => {
                    setPresent(value)
                  }}
                >
                  {value}%
                </Button>
              )
            })}
          </Stack>
          <Box display={'grid'} gridTemplateColumns="1fr 1fr" gap="20px">
            <Button classname="global-box-shadow1" height={isSmDown ? '40px' : '62px'} onClick={customOnDismiss}>
              取消
            </Button>
            <Button
              disabled={!account || !depositAmount || depositAmount.equalTo(JSBI.BigInt('0'))}
              onClick={depositCallback}
              classname="global-box-shadow1"
              height={isSmDown ? '40px' : '62px'}
            >
              质押LP
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}
