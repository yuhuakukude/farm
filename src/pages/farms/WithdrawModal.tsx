import { Box, Stack } from '@mui/material'
import Image from 'components/Image'
import Modal from 'components/Modal'
import close from 'assets/images/close.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { OutBox, StyledBetweenCenter, Text2 } from '.'
import Button from 'components/Button/Button'
import { FARM } from './farms'
import { Percent, Token, TokenAmount } from '../../constants/token'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from '../../hooks/useModal'
import { useCallback, useMemo, useState } from 'react'
import TransactionSubmittedModal from '../../components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useAuctions } from '../../hooks/useFarm'
import MessageBox from '../../components/Modal/TransactionModals/MessageBox'
import { useActiveWeb3React } from '../../hooks'
import JSBI from 'jsbi'

export default function WithdrawModal({
  customIsOpen,
  customOnDismiss,
  farm,
  lpToken,
  depositedAmount
}: {
  customIsOpen: boolean
  customOnDismiss: () => void
  farm: FARM
  lpToken?: Token
  depositedAmount: string | undefined
}) {
  const { account } = useActiveWeb3React()
  const isSmDown = useBreakpoint('sm')
  const { showModal, hideModal } = useModal()
  const [present, setPresent] = useState('25')
  const presents = ['25', '50', '75', '100']
  const withAmount = useMemo(() => {
    return lpToken && depositedAmount
      ? new TokenAmount(lpToken, new Percent(present, '100').multiply(depositedAmount).quotient)
      : undefined
  }, [depositedAmount, lpToken, present])

  const { withdraw } = useAuctions()
  const depositCallback = useCallback(async () => {
    showModal(<TransactionPendingModal />)
    withdraw(withAmount)
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
  }, [hideModal, showModal, withAmount, withdraw])
  return (
    <Modal width="750px" maxWidth="750px" customIsOpen={customIsOpen} customOnDismiss={customOnDismiss}>
      <Box>
        <StyledBetweenCenter
          sx={{
            padding: { xs: 20, sm: 30 },
            borderBottom: '1px solid #E8E8E8'
          }}
        >
          <Text2>??????LP??????</Text2>
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
              <Text2>??????</Text2>
              <Text2>
                ?????????{lpToken && depositedAmount ? new TokenAmount(lpToken, depositedAmount).toSignificant() : '--'}
              </Text2>
            </StyledBetweenCenter>
            <StyledBetweenCenter>
              <Text2>{withAmount ? withAmount.toSignificant() : '0'}</Text2>
              <Text2>
                {farm.token0Name}-{farm.token1Name} LP
              </Text2>
            </StyledBetweenCenter>
          </OutBox>
          {/*<StyledBetweenCenter>*/}
          {/*  <Text2 style={{ color: '#666666' }}>??????????????????????????????????????????</Text2>*/}
          {/*  <Text2>$18.85</Text2>*/}
          {/*</StyledBetweenCenter>*/}
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
              ??????
            </Button>
            <Button
              disabled={!account || !withAmount || withAmount.equalTo(JSBI.BigInt('0'))}
              onClick={depositCallback}
              classname="global-box-shadow1"
              height={isSmDown ? '40px' : '62px'}
            >
              ??????LP
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}
