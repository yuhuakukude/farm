import { Box, Collapse, Link, Stack, styled, Typography } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import tvl_bg from 'assets/images/TVLbg.png'
import core from 'assets/images/core.png'
import logo1 from 'assets/images/logo1.png'
import share from 'assets/images/share.png'
import add from 'assets/images/add.png'
import sub from 'assets/images/sub.png'
import Image from 'components/Image'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useCallback, useState } from 'react'
import Button from 'components/Button/Button'
import StakeModal from './StakeModal'
import WithdrawModal from './WithdrawModal'
import { FARM } from './farms'
import { useAuctions, useFarmInfos, useUserInfo } from '../../hooks/useFarm'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { tryParseAmount } from '../../utils/parseAmount'
import { useToken } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { FARM_ADDRESS } from '../../constants'
import ActionButton from '../../components/Button/ActionButton'
import { CurrencyAmount, TokenAmount } from '../../constants/token'
import useModal from '../../hooks/useModal'
import TransactionPendingModal from '../../components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from '../../components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from '../../components/Modal/TransactionModals/MessageBox'
import { ExternalLink } from '../../theme/components'
import { useTVL, useTVLs } from '../../hooks/useLiquidity'
import JSBI from 'jsbi'

// const Wrapper = styled(Box)`
//   border: 2px solid #191919;
//   box-shadow: 6px 6px 0px 0px #191919;
//   border-radius: 12px;
// `
//
// const Dot = styled(Box)`
//   width: 48px;
//   height: 48px;
//   border-radius: 24px;
//   border: 2px solid #191919;
//   box-shadow: 4px 4px 0px 0px #191919;
// `
//
// const RowBetween = styled(Stack)`
//   flex-direction: row;
//   justify-content: space-between;
//   width: 100%;
// `

// export default function Farms() {
//   const farms = useFarmInfos()
//   return (
//     <Wrapper sx={{ width: 100, margin: 10 }}>
//       {farms.map(farm => {
//         return (
//           <RowBetween key={farm.base.lpAddress}>
//             <Stack direction={'row'}>
//               <Dot />
//               <Typography>
//                 {farm.base.token0Name}
//                 {farm.base.token1Name}
//               </Typography>
//             </Stack>
//           </RowBetween>
//         )
//       })}
//     </Wrapper>

export const StyledBetweenCenter = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export const Text1 = styled(Typography)(({ theme }) => ({
  color: '#666',
  fontSize: 24,
  [theme.breakpoints.down('sm')]: {
    fontSize: 14
  }
}))

export const Text2 = styled(Typography)(({ theme }) => ({
  fontSize: 28,
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    fontSize: 18
  }
}))

export const OutBox = styled(Box)(({ theme }) => ({
  padding: 30,
  borderRadius: '12px',
  border: '1px solid #161616',
  [theme.breakpoints.down('sm')]: {
    padding: 15
  }
}))

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: 28,
  fontWeight: 600,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: 16
  }
}))

export default function Farms() {
  const isSmDown = useBreakpoint('sm')
  const farms = useFarmInfos()
  const { tvls, peaPrice } = useTVLs()
  const totalTVL = [...tvls.map(({ tvl }) => tvl), 0].map(i => JSBI.BigInt(i ?? '0')).reduce((a, b) => JSBI.add(a, b))
  return (
    <Box
      sx={{
        padding: { sm: 30, xs: 20 }
      }}
    >
      <Stack spacing={isSmDown ? 20 : 36}>
        <Box
          sx={{
            padding: { xs: 30, sm: 45 },
            background: `url(${tvl_bg}) no-repeat`,
            backgroundSize: '100% 100%',
            display: 'grid',
            justifyContent: 'center'
          }}
        >
          <Typography
            color={'#fff'}
            sx={{
              fontSize: { xs: 20, sm: 28 },
              textAlign: 'center'
            }}
          >
            TVL
          </Typography>
          <Typography
            color={'#fff'}
            sx={{
              mt: 20,
              textAlign: 'center',
              fontSize: { xs: 30, sm: 58 }
            }}
          >
            ${CurrencyAmount.ether(totalTVL).toSignificant()}
          </Typography>
        </Box>
        {farms.map((farm, index) => {
          return <PoolBox key={farm.lpAddress} peaPrice={peaPrice} liquidity={tvls[index]} farm={farm} />
        })}
      </Stack>
    </Box>
  )
}

interface LIQUIDITY {
  tvl?: string | undefined
  lpPrice?: string | undefined
  balance?: string | undefined
}

function PoolBox({
  farm,
  liquidity,
  peaPrice
}: {
  farm: FARM
  liquidity: LIQUIDITY | undefined
  peaPrice: string | undefined
}) {
  const { chainId, account } = useActiveWeb3React()
  const isSmDown = useBreakpoint('sm')
  const [openStake, setOpenStake] = useState(false)
  const [openWithdraw, setOpenWithdraw] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { pendingRewards, depositedAmount, claimedAmount } = useUserInfo(farm)
  const { showModal, hideModal } = useModal()
  const { claim } = useAuctions()
  const { token0Amount, token1Amount } = useTVL(depositedAmount ?? '0', farm.lpAddress)
  const lpToken = useToken(farm.lpAddress, chainId)
  const [depositTyped] = useState('1')
  const depositAmount = tryParseAmount(depositTyped, lpToken ?? undefined)
  const [approvalState, approveCallback] = useApproveCallback(depositAmount, FARM_ADDRESS[chainId ?? 8989])
  const balance = liquidity?.balance
  const lpPrice = liquidity?.lpPrice
  const x = farm?.x

  const apy =
    balance &&
    x &&
    peaPrice &&
    lpPrice &&
    JSBI.greaterThan(JSBI.BigInt(balance), JSBI.BigInt('0')) &&
    JSBI.greaterThan(JSBI.BigInt(lpPrice), JSBI.BigInt('0'))
      ? JSBI.divide(
          JSBI.multiply(
            JSBI.multiply(JSBI.multiply(JSBI.BigInt(x), JSBI.BigInt('10512000')), JSBI.BigInt(peaPrice)),
            JSBI.BigInt('100000000000000000000')
          ),
          JSBI.multiply(JSBI.BigInt(balance), JSBI.BigInt(lpPrice))
        )
      : undefined

  const claimCallback = useCallback(async () => {
    showModal(<TransactionPendingModal />)
    claim(farm.lpAddress)
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
  }, [claim, farm.lpAddress, hideModal, showModal])

  return (
    <Box
      className="global-box-shadow"
      sx={{
        borderRadius: '15px'
      }}
    >
      <Box
        sx={{
          padding: { xs: 15, sm: 28 }
        }}
      >
        <StyledBetweenCenter>
          <StyledBetweenCenter>
            <Image
              className="global-box-shadow1"
              src={logo1}
              width={isSmDown ? 32 : 48}
              style={{ borderRadius: '50%' }}
            />
            <Typography
              fontWeight={800}
              ml={6}
              sx={{
                fontSize: { xs: 18, sm: 32 }
              }}
            >
              {farm.token0Name}-{farm.token1Name}
            </Typography>
          </StyledBetweenCenter>
          <Image src={core} width={isSmDown ? 70 : 114} />
        </StyledBetweenCenter>
        <StyledBetweenCenter
          sx={{
            mt: { xs: 16, sm: 30 }
          }}
        >
          <StyledBetweenCenter>
            <Box display={'flex'} alignItems="center">
              <Box mr={isSmDown ? 70 : 100}>
                <Text1>已赚取</Text1>
                <Text2 mt={10}>{claimedAmount ? CurrencyAmount.ether(claimedAmount).toSignificant() : '--'}</Text2>
              </Box>
              <Box>
                <Text1>APR</Text1>
                <Text2 mt={10}>{apy ? CurrencyAmount.ether(apy).toSignificant() : '--'}%</Text2>
              </Box>
            </Box>
          </StyledBetweenCenter>
          <StyledBetweenCenter
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              cursor: 'pointer'
            }}
          >
            <Typography
              color="#14A65F"
              sx={{
                fontSize: { xs: 18, sm: 32 }
              }}
            >
              详情
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                color: '#14A65F'
              }}
            />
          </StyledBetweenCenter>
        </StyledBetweenCenter>
      </Box>

      <Collapse in={isOpen}>
        <Box
          mt={10}
          sx={{
            borderTop: '1.5px solid #161616',
            padding: { xs: 15, sm: 30 }
          }}
        >
          <Stack spacing={isSmDown ? 20 : 30}>
            <OutBox>
              <StyledBetweenCenter>
                <Text1 mr={6}>
                  <span style={{ color: '#14A65F' }}>PEA</span> 已赚取
                </Text1>
                <Typography sx={{ fontSize: { sm: 20, xs: 12 } }}>1%取消质押费用（在72小时内提取）</Typography>
              </StyledBetweenCenter>
              <StyledBetweenCenter mt={isSmDown ? 15 : 30}>
                <Text2 style={{ fontSize: isSmDown ? 24 : 36 }}>
                  {lpToken && pendingRewards ? new TokenAmount(lpToken, pendingRewards).toSignificant() : '--'}
                </Text2>
                <Button
                  disabled={!account || !pendingRewards || pendingRewards === '0'}
                  classname="global-box-shadow1"
                  width={isSmDown ? '80px' : '128px'}
                  height={isSmDown ? '40px' : '62px'}
                  onClick={claimCallback}
                >
                  领取
                </Button>
              </StyledBetweenCenter>
            </OutBox>
            {approvalState !== ApprovalState.APPROVED ? (
              <OutBox>
                <Text1 mb={isSmDown ? 15 : 30}>启用农场</Text1>
                <ActionButton
                  actionText={'启用'}
                  pendingText={'启用中'}
                  pending={approvalState === ApprovalState.PENDING}
                  disableAction={approvalState !== ApprovalState.NOT_APPROVED || !account}
                  height={isSmDown ? '40px' : '62px'}
                  onAction={approveCallback}
                />
              </OutBox>
            ) : null}

            {!depositedAmount || depositedAmount === '0' ? (
              <OutBox>
                <Text1 mb={isSmDown ? 15 : 30}>
                  质押
                  <span style={{ color: '#14A65F' }}>
                    {farm.token0Name}-{farm.token1Name} LP
                  </span>
                </Text1>
                <Button
                  disabled={approvalState !== ApprovalState.APPROVED}
                  classname="global-box-shadow1"
                  height={isSmDown ? '40px' : '62px'}
                  onClick={() => setOpenStake(true)}
                >
                  质押LP
                </Button>
              </OutBox>
            ) : (
              <OutBox>
                <Text1 mb={isSmDown ? 15 : 30}>
                  <span style={{ color: '#14A65F' }}>
                    {farm.token0Name}-{farm.token1Name} LP
                  </span>{' '}
                  已质押
                </Text1>
                <Text2>
                  {depositedAmount && lpToken ? new TokenAmount(lpToken, depositedAmount).toSignificant() : '--'}
                </Text2>
                <StyledBetweenCenter mt={10}>
                  <Box>
                    <Text1>
                      {token0Amount ? CurrencyAmount.ether(token0Amount).toSignificant() : '--'}
                      {farm.token0Address.toLowerCase() > farm.token1Address.toLowerCase()
                        ? farm.token0Name
                        : farm.token1Name}
                    </Text1>
                    <Text1>
                      {token1Amount ? CurrencyAmount.ether(token1Amount).toSignificant() : '--'}
                      {farm.token0Address.toLowerCase() < farm.token1Address.toLowerCase()
                        ? farm.token0Name
                        : farm.token1Name}
                    </Text1>
                  </Box>
                  <Stack direction={'row'} spacing={10}>
                    <Image
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setOpenStake(true)
                      }}
                      src={add}
                      width={24}
                    />
                    <Image
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setOpenWithdraw(true)
                      }}
                      src={sub}
                      width={24}
                    />
                  </Stack>
                </StyledBetweenCenter>
              </OutBox>
            )}

            <Stack spacing={isSmDown ? 10 : 15}>
              <StyledBetweenCenter>
                <Text2>权重</Text2>
                <Text2>{farm.weights}X</Text2>
              </StyledBetweenCenter>
              <StyledBetweenCenter>
                <Text2>流动性</Text2>
                <Text2>${liquidity?.tvl ? CurrencyAmount.ether(liquidity?.tvl).toSignificant() : '--'}</Text2>
              </StyledBetweenCenter>
              <ExternalLink href={`https://l.peafarms.app/#/add/${farm.token0Address}/${farm.token1Address}`}>
                <StyledLink>
                  获取{farm.token0Name}-{farm.token1Name} LP
                  <Image src={share} width={isSmDown ? 16 : 24} style={{ marginLeft: 5 }} />
                </StyledLink>
              </ExternalLink>
              <ExternalLink href={`https://www.telegramx.link/address/${farm.lpAddress}`}>
                <StyledLink>
                  查看合约 <Image src={share} width={isSmDown ? 16 : 24} style={{ marginLeft: 5 }} />
                </StyledLink>
              </ExternalLink>
            </Stack>
          </Stack>
        </Box>
        <StakeModal
          farm={farm}
          lpToken={lpToken ?? undefined}
          customIsOpen={openStake}
          customOnDismiss={() => setOpenStake(!openStake)}
        />
        <WithdrawModal
          depositedAmount={depositedAmount}
          farm={farm}
          lpToken={lpToken ?? undefined}
          customIsOpen={openWithdraw}
          customOnDismiss={() => setOpenWithdraw(!openWithdraw)}
        />
      </Collapse>
    </Box>
  )
}
