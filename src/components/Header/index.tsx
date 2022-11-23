import { useState, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AppBar, Box, MenuItem, Stack, styled as muiStyled, styled } from '@mui/material'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
// import logo from '../../assets/svg/chain_swap.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
// import NetworkSelect from './NetworkSelect'
import menu from '../../assets/images/menu.png'
// import Lang from './Lang'
import { scrollToElement } from '../../utils'
import logo from 'assets/images/logo.png'
import logo1 from 'assets/images/logo1.png'
import farm from 'assets/images/farm.png'
import club from 'assets/images/club.png'
// import { useI18n } from 'react-simple-i18n'

interface TabContent {
  title: string
  route?: string
  link?: string
  id?: string
  image: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export function useTabs(): Tab[] {
  // const { t } = useI18n()
  return [
    { title: '简介', route: routes.home, image: logo1 },
    { title: '农场', route: routes.farms, image: farm },
    { title: '农场', route: routes.club, image: club }
    // { title: t('marketplace'), route: routes.Marketplace, id: 'marketplace' },
    // { title: t('roadmap.title'), route: routes.Roadmap, id: 'roadmap' },
    // { title: t('tokenomics1'), route: routes.Tokenomics, id: 'tokenomics' },
    // { title: 'DAO', link: '/' }
    // { title: 'Referral Program', route: routes.test }
    // { title: 'DAO', link: 'https://dao.logo.finance/#/' },
    // { title: 'Docs', link: 'https://docs.logo.finance/' }
  ]
}

const navLinkSX = ({ theme }: any) => ({
  textDecoration: 'none',
  fontSize: 14,
  color: theme.palette.text.primary,
  opacity: 0.5,
  '&:hover': {
    opacity: 1
  }
})

const StyledNavLink = styled(NavLink)(navLinkSX)

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  height: theme.height.header,
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: 'none',
  padding: '0 40px 0 25px!important',
  zIndex: theme.zIndex.drawer,
  // borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  // [theme.breakpoints.down('md')]: {
  //   position: 'fixed',
  //   bottom: 0,
  //   left: 0,
  //   top: 'unset',
  //   borderTop: '1px solid ' + theme.bgColor.bg4,
  //   justifyContent: 'center'
  // },
  '& .link': {
    textDecoration: 'none',
    fontSize: 16,
    color: theme.palette.text.primary,
    // opacity: 0.5,
    marginRight: 48,
    '&.active': {
      opacity: 1,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main
    },
    '&:hover': {
      opacity: 1,
      color: theme.palette.primary.main
    }
  },
  '& .lr': {},
  [theme.breakpoints.down('lg')]: {
    '& .link': { marginRight: 15 },
    padding: '0 24px 0 0!important'
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px!important'
  }
}))

const Filler = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    height: theme.height.header,
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px'
  }
}))

// const MainLogo = styled(NavLink)(({ theme }) => ({
//   '& img': {
//     width: 180.8,
//     height: 34.7
//   },
//   '&:hover': {
//     cursor: 'pointer'
//   },
//   [theme.breakpoints.down('sm')]: {
//     '& img': { width: 100, height: 'auto' },
//     marginBottom: -10
//   }
// }))

const LinksWrapper = muiStyled('div')(({ theme }) => ({
  width: '100%',
  margin: 'auto',
  display: 'flex',
  marginLeft: 20,
  justifyContent: 'space-around',
  alignItems: 'center',
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0
  }
}))

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const tabs = useTabs()
  const handleMobileMenueDismiss = useCallback(() => {
    setTimeout(() => {
      setMobileMenuOpen(false)
    }, 200)
  }, [])

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <StyledAppBar>
        {/* <HideOnMobile>
          <Lang />
        </HideOnMobile> */}
        <Box display="flex" alignItems="center" width={'100%'}>
          <Link id={'logo'} to={'/'} style={{ height: 30 }}>
            <Image src={logo} height={'100%'} alt={'logo'} />
          </Link>
          <HideOnMobile breakpoint="md" sx={{ display: 'none' }}>
            <LinksWrapper>
              {tabs.map(({ title, route, subTab, link, titleContent, id }, idx) =>
                subTab ? (
                  <Box
                    sx={{
                      marginRight: {
                        xs: 15,
                        lg: 48
                      },
                      height: 80,
                      lineHeight: 80,
                      borderBottom: '2px solid transparent',
                      borderColor: theme =>
                        subTab.some(tab => tab.route && pathname.includes(tab.route))
                          ? theme.palette.text.primary
                          : 'transparnet',
                      display: 'inline'
                    }}
                    key={title + idx}
                  >
                    <PlainSelect
                      key={title + idx}
                      placeholder={title}
                      autoFocus={false}
                      width={title === 'Test' ? '70px' : undefined}
                      style={{
                        height: '16px'
                      }}
                    >
                      {subTab.map((sub, idx) =>
                        sub.link ? (
                          <MenuItem
                            key={sub.link + idx}
                            sx={{ backgroundColor: 'transparent!important', background: 'transparent!important' }}
                            selected={false}
                          >
                            <ExternalLink
                              href={sub.link}
                              className={'link'}
                              color="#00000050"
                              sx={{
                                '&:hover': {
                                  color: '#232323!important'
                                }
                              }}
                            >
                              {sub.titleContent ?? sub.title}
                            </ExternalLink>
                          </MenuItem>
                        ) : (
                          <MenuItem key={sub.title + idx}>
                            <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                          </MenuItem>
                        )
                      )}
                    </PlainSelect>
                  </Box>
                ) : link ? (
                  <ExternalLink href={link} className={'link'} key={link + idx} style={{ fontSize: 14 }}>
                    {titleContent ?? title}
                  </ExternalLink>
                ) : (
                  <NavLink
                    onClick={() => {
                      if (id) scrollToElement(id)
                    }}
                    style={{ height: 80, lineHeight: '80px' }}
                    key={title + idx}
                    id={`${route}-nav-link`}
                    to={route ?? ''}
                    className={
                      (route
                        ? pathname.includes(route)
                          ? 'active'
                          : pathname.includes('account')
                          ? route.includes('account')
                            ? 'active'
                            : ''
                          : ''
                        : '') + ' link'
                    }
                  >
                    {titleContent ?? title}
                  </NavLink>
                )
              )}
            </LinksWrapper>
          </HideOnMobile>
        </Box>
        <Box className="lr" display="flex" alignItems="center" gap={{ xs: '6px', sm: '20px' }}>
          {/* <NetworkSelect /> */}
          <Web3Status />
          <Stack direction={'row'} alignItems={'center'}>
            {/* <Lang /> */}
            <Stack
              marginLeft={12}
              onClick={() => {
                setMobileMenuOpen(true)
              }}
            >
              <Image width={18} src={menu} />
            </Stack>
          </Stack>
        </Box>
      </StyledAppBar>
    </>
  )
}
