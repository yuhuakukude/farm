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
import { useState } from 'react'
import Button from 'components/Button/Button'
import StakeModal from './StakeModal'

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
            3265
          </Typography>
        </Box>
        <PoolBox />
        <PoolBox />
      </Stack>
    </Box>
  )
}

function PoolBox() {
  const isSmDown = useBreakpoint('sm')
  const [openStake, setOpenStake] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
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
              Pea-USTX
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
                <Text2 mt={10}>2</Text2>
              </Box>
              <Box>
                <Text1>APR</Text1>
                <Text2 mt={10}>31.06%</Text2>
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
                <Text2 style={{ fontSize: isSmDown ? 24 : 36 }}>350,000</Text2>
                <Button
                  classname="global-box-shadow1"
                  width={isSmDown ? '80px' : '128px'}
                  height={isSmDown ? '40px' : '62px'}
                >
                  领取
                </Button>
              </StyledBetweenCenter>
            </OutBox>

            <OutBox>
              <Text1 mb={isSmDown ? 15 : 30}>启用农场</Text1>
              <Button classname="global-box-shadow1" height={isSmDown ? '40px' : '62px'}>
                启用
              </Button>
            </OutBox>

            <OutBox>
              <Text1 mb={isSmDown ? 15 : 30}>
                质押 <span style={{ color: '#14A65F' }}>USDT-BNBLP</span>
              </Text1>
              <Button
                classname="global-box-shadow1"
                height={isSmDown ? '40px' : '62px'}
                onClick={() => setOpenStake(true)}
              >
                质押LP
              </Button>
            </OutBox>

            <OutBox>
              <Text1 mb={isSmDown ? 15 : 30}>
                <span style={{ color: '#14A65F' }}>USDT-BNBLP</span> 已质押
              </Text1>
              <Text2>0.00000</Text2>
              <StyledBetweenCenter mt={10}>
                <Box>
                  <Text1>-268.43 USD</Text1>
                  <Text1>72.73 USDT</Text1>
                </Box>
                <Stack direction={'row'} spacing={10}>
                  <Image src={add} width={24} />
                  <Image src={sub} width={24} />
                </Stack>
              </StyledBetweenCenter>
            </OutBox>

            <Stack spacing={isSmDown ? 10 : 15}>
              <StyledBetweenCenter>
                <Text2>APR</Text2>
                <Text2>18.85%</Text2>
              </StyledBetweenCenter>
              <StyledBetweenCenter>
                <Text2>权重</Text2>
                <Text2>40X</Text2>
              </StyledBetweenCenter>
              <StyledBetweenCenter>
                <Text2>流动性</Text2>
                <Text2>$236,486,669</Text2>
              </StyledBetweenCenter>

              <StyledLink>
                获取PEA-USTX LP
                <Image src={share} width={isSmDown ? 16 : 24} style={{ marginLeft: 5 }} />
              </StyledLink>
              <StyledLink>
                查看合约 <Image src={share} width={isSmDown ? 16 : 24} style={{ marginLeft: 5 }} />
              </StyledLink>
              <StyledLink>
                查看代币对信息 <Image src={share} width={isSmDown ? 16 : 24} style={{ marginLeft: 5 }} />
              </StyledLink>
            </Stack>
          </Stack>
        </Box>
        <StakeModal customIsOpen={openStake} customOnDismiss={() => setOpenStake(!openStake)} />
      </Collapse>
    </Box>
  )
}
