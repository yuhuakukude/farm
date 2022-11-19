import { Box, Stack } from '@mui/material'
import Image from 'components/Image'
import Modal from 'components/Modal'
import close from 'assets/images/close.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { OutBox, StyledBetweenCenter, Text2 } from '.'
import Button from 'components/Button/Button'

export default function StakeModal({
  customIsOpen,
  customOnDismiss
}: {
  customIsOpen: boolean
  customOnDismiss: () => void
}) {
  const isSmDown = useBreakpoint('sm')
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
              <Text2>余额：8.685495369758611658</Text2>
            </StyledBetweenCenter>
            <StyledBetweenCenter>
              <Text2>0</Text2>
              <Text2>USDT-BNB LP</Text2>
            </StyledBetweenCenter>
          </OutBox>
          <StyledBetweenCenter>
            <Text2 style={{ color: '#666666' }}>当前汇率下的年度投资回报率：</Text2>
            <Text2>$18.85</Text2>
          </StyledBetweenCenter>
          <Box display={'grid'} gridTemplateColumns="1fr 1fr" gap="20px">
            <Button classname="global-box-shadow1" height={isSmDown ? '40px' : '62px'} onClick={customOnDismiss}>
              取消
            </Button>
            <Button classname="global-box-shadow1" height={isSmDown ? '40px' : '62px'}>
              质押LP
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}
