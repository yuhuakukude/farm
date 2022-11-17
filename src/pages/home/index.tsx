import { Box, Link, Stack, Typography, useTheme } from '@mui/material'
import Image from 'components/Image'
import intr from 'assets/images/intr.png'
import prod from 'assets/images/prod.png'
import mode from 'assets/images/mode.png'
import howBuy from 'assets/images/how_buy.png'
import step1 from 'assets/images/step1.png'
import step2 from 'assets/images/step2.png'
import coin2 from 'assets/images/coin2.png'
import coin3 from 'assets/images/coin3.png'
import arrow_line from 'assets/images/arrow_line.png'
import roadmap from 'assets/images/role_line.png'
import checkout from 'assets/images/checkout.png'
import step_bg from 'assets/images/step_bg.png'
import product_intr from 'assets/images/product_intr.png'
import team_intr from 'assets/images/team_intr.png'
import person_toggle from 'assets/images/person_toggle.png'
import person from 'assets/images/person.png'
import coin_arr from 'assets/images/coin_arr.png'
import gov from 'assets/images/gov.png'
import bg1 from 'assets/images/bg1.png'
import twitter from 'assets/images/twitter.png'
import tg from 'assets/images/tg.png'
import menu_desc from 'assets/images/menu_desc.png'
import tokenpea from 'assets/images/tokenpea.png'
import coin1 from 'assets/images/coin1.png'
import coin5 from 'assets/images/coin5.png'
import coin4 from 'assets/images/coin4.png'
import detail from 'assets/images/detail.png'
import useBreakpoint from 'hooks/useBreakpoint'
import Button from 'components/Button/Button'

export default function Home() {
  const isSmDown = useBreakpoint('sm')
  const theme = useTheme()
  return (
    <Box
      sx={{
        padding: { sm: 30, xs: 20 }
      }}
    >
      <Image src={intr} height={isSmDown ? 24 : 30} />
      <Box sx={{ margin: { sm: '30px 0 20px', xs: '20px 0' } }} display="flex" alignItems={'flex-end'}>
        <Typography sx={{ fontSize: { xs: 30, sm: 48 } }} fontWeight={800}>
          豌豆农场
        </Typography>
        <Typography sx={{ fontSize: { xs: 24, sm: 30 } }} fontWeight={600}>
          （Pea farms）
        </Typography>
      </Box>
      <Box display={'flex'}>
        <Box
          className="global-box-shadow"
          sx={{
            borderRadius: '20px',
            padding: '6px 20px',
            backgroundColor: theme.palette.primary.light
          }}
        >
          <Typography sx={{ fontSize: { xs: 22, sm: 28 } }}>TX公链首个农场挖矿产品</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: { sm: 60, xs: 40 } }}>
        <Image src={prod} height={isSmDown ? 24 : 30} />
        <Box
          className="global-box-shadow"
          sx={{
            borderRadius: '20px',
            padding: '5px 0',
            background: '#fff',
            mt: 20
          }}
        >
          <Image src={mode} width="100%" />
          <Box
            sx={{
              padding: { xs: 20, sm: 30 }
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 18, sm: 26 }
              }}
            >
              以“LP农场机枪池”为核心的产品形态，打通其他链上DEFI协议，从而创造外部收益，打造成为TX链上聚合性金融协议龙头。
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: { sm: 110, xs: 60 } }}>
        <Image src={howBuy} height={isSmDown ? 24 : 30} />
        <Box mt={30}>
          <Image src={step1} />
          <Box padding="0 20px">
            <Box
              className="global-box-shadow"
              sx={{
                mt: -40,
                padding: { xs: '15px', sm: '30px' },
                position: 'relative',
                borderRadius: '10px',
                zIndex: 1,
                background: '#fff'
              }}
            >
              <Typography sx={{ fontSize: { sx: 20, sm: 30 }, fontWeight: 500 }}>配置TX公链参数</Typography>
              <ChainInfo />
              <Box display={'flex'} justifyContent="center" mt={20}>
                <Button
                  style={{
                    height: 33,
                    width: '50%'
                  }}
                  classname="global-box-shadow"
                >
                  复制
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            display={'grid'}
            justifyContent="flex-end"
            mt={-50}
            sx={{
              position: 'relative',
              zIndex: 2
            }}
          >
            <Image style={{ justifySelf: 'flex-end' }} src={arrow_line} />
            <Image src={step2} />
          </Box>

          <Box padding="0 20px">
            <Box
              className="global-box-shadow"
              sx={{
                mt: -40,
                padding: { xs: '15px', sm: '30px' },
                position: 'relative',
                borderRadius: '10px',
                zIndex: 3,
                background: '#fff'
              }}
            >
              <Box display="flex" alignItems={'center'}>
                <Image src={checkout} />
                <Typography
                  display="flex"
                  alignItems={'center'}
                  flexWrap="wrap"
                  sx={{ fontSize: { sx: 16, sm: 26 }, fontWeight: 500, color: theme.palette.text.secondary }}
                  ml={6}
                >
                  swap跳转：
                  <Link sx={{ fontSize: { sx: 16, sm: 26 } }} href="https://txswap.maplesales.org/">
                    https://txswap.maplesales.org/
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: { sm: 110, xs: 60 } }}>
        <Image src={roadmap} height={isSmDown ? 24 : 30} />
        <Box
          padding={'20px 0'}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            justifyContent: 'center',
            '& .bor-b': {
              borderBottom: '1px dashed #191919'
            },
            '& .bor-r': {
              borderRight: '1px dashed #191919'
            }
          }}
        >
          <RoadMap />
        </Box>
      </Box>

      <Box
        sx={{
          margin: '0 -20px',
          padding: { sm: '110px 30px 0', xs: '60px 20px 0' },
          background: `url(${bg1}) no-repeat`,
          backgroundSize: 'contain'
        }}
      >
        <Image src={product_intr} height={isSmDown ? 24 : 30} />

        <Box
          sx={{
            mt: 30,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            alignItems: 'center'
          }}
        >
          <Box display={'grid'} gap="12px">
            <Image src={tokenpea} style={{ marginBottom: 10 }} height={isSmDown ? 24 : 30} />
            <ShowCoin title="总量" desc="100,000,000（1亿）" image={coin1} />
            <ShowCoin title="初始流通(含预售量)" desc="20,000,000（2千万）" image={coin5} />
            <ShowCoin title="交易税" desc="买1%销毁 , 卖1%营销" image={coin4} />
          </Box>

          <Image src={detail} width="100%" />
        </Box>

        <Stack spacing={50} mt={50}>
          <Box>
            <Image src={team_intr} height={isSmDown ? 24 : 30} />
            <Box
              sx={{
                mt: 30,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <Image src={person} width="100%" />
              <Typography
                sx={{
                  fontSize: { sm: 26, xs: 18 },
                  fontWeight: 500
                }}
              >
                成熟产品团队携手多名币圈大佬及多个社区联合组成。
              </Typography>
            </Box>
          </Box>
          <Box>
            <Image src={gov} height={isSmDown ? 24 : 30} />
            <Box display={'flex'} justifyItems="center" mt={20}>
              <Box
                sx={{
                  width: { xs: 100, sm: 150 },
                  display: 'grid',
                  justifyItems: 'center'
                }}
              >
                <Image src={coin3} width={isSmDown ? 50 : 92} />
                <Typography mt={10} sx={{ fontSize: { xs: 16, sm: 28 }, fontWeight: 500 }}>
                  枫叶科技
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 140, sm: 220 },
                  display: 'grid',
                  justifyItems: 'center'
                }}
              >
                <Image src={coin2} width={isSmDown ? 50 : 92} />
                <Typography mt={10} sx={{ fontSize: { xs: 16, sm: 28 }, fontWeight: 500 }}>
                  TelegramX公链
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Image src={person_toggle} height={isSmDown ? 24 : 30} />
            <Box
              sx={{
                padding: '20px',
                mt: 20
              }}
            >
              <Image src={coin_arr} width="100%" />
            </Box>
          </Box>
        </Stack>
      </Box>

      <Social />
    </Box>
  )
}

function RoadMap() {
  const list = [
    {
      title: '第一阶段',
      list: ['网站发布', '智能合约', '电报社区建设', '营销宣传', '白名单活动', '枫叶预售']
    },
    {
      title: '第二阶段',
      list: ['V1农场开启', '热搜等其他营销', '对接优质项目', '豌豆俱乐部', '俱乐部会员NFT', 'V2农场发布']
    },
    {
      title: '第三阶段',
      list: ['豌豆孵化器', '品牌衍生应用', '外部收益创收', '代币回购销毁', '持续营销']
    },
    {
      title: '第四阶段',
      list: ['敬请期待…']
    }
  ]
  return (
    <>
      {list.map((item, index) => (
        <Box
          key={item.title}
          sx={{ padding: '20px 15px' }}
          className={`${index <= 1 ? 'bor-b' : ''} ${index % 2 === 0 ? 'bor-r' : ''}`}
        >
          <Box
            sx={{
              mb: { xs: 25, sm: 40 },
              padding: '6px',
              background: `url(${step_bg}) no-repeat`,
              backgroundSize: '100% 100%'
            }}
          >
            <Typography
              sx={{
                fontSize: { sm: 30, xs: 18 },
                fontWeight: 500
              }}
              textAlign={'center'}
            >
              {item.title}
            </Typography>
          </Box>
          <Stack spacing={8}>
            {item.list.map((it, idx) => (
              <Typography
                sx={{
                  fontSize: { sm: 28, xs: 16 },
                  fontWeight: 500
                }}
                textAlign={'center'}
                key={idx}
              >
                {it}
              </Typography>
            ))}
          </Stack>
        </Box>
      ))}
    </>
  )
}

function ChainInfo() {
  const theme = useTheme()
  const list = [
    '网络名称：telegramx',
    '新增 RPC URL:  https://tx.telegramx.space',
    '链 ID（自动弹出):  8989',
    '货币符号:  TX'
  ]
  return (
    <Stack mt={20} spacing={5}>
      {list.map(item => (
        <Box key={item} display="flex" alignItems={'center'}>
          <Image src={checkout} />
          <Typography
            sx={{ fontSize: { sx: 16, sm: 26 }, fontWeight: 500, color: theme.palette.text.secondary }}
            ml={6}
          >
            {item}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

function Social() {
  const isSmDown = useBreakpoint('sm')

  return (
    <Box
      className="global-box-shadow"
      sx={{
        mt: { sm: 100, xs: 50 },
        padding: { xs: '15px 20px', sm: '23px 30px' },
        borderRadius: '10px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Link>
        <Image src={menu_desc} width={isSmDown ? 50 : 92} />
      </Link>
      <Link>
        <Image src={twitter} width={isSmDown ? 50 : 92} />
      </Link>
      <Link>
        <Image src={tg} width={isSmDown ? 50 : 92} />
      </Link>
    </Box>
  )
}

function ShowCoin({ image, title, desc }: { image: string; title: string; desc: string }) {
  const isSmDown = useBreakpoint('sm')

  return (
    <Box display={'grid'} gridTemplateColumns={isSmDown ? '50px 1fr' : '74px 1fr'}>
      <Image src={image} width={isSmDown ? 50 : 74} />
      <Box
        sx={{
          ml: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          sx={{
            fontSize: { sm: 24, xs: 14 },
            fontWeight: 500,
            color: '#666'
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: { sm: 28, xs: 16 },
            fontWeight: 500
          }}
        >
          {desc}
        </Typography>
      </Box>
    </Box>
  )
}
