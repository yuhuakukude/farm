import React, { useState, useCallback } from 'react'
import { ExpandMore } from '@mui/icons-material'
import { NavLink } from 'react-router-dom'
import { Box, MenuItem, styled, Theme, Drawer, Link } from '@mui/material'
import logo from 'assets/images/logo1.png'
import title from 'assets/images/title.png'
import { ExternalLink } from 'theme/components'
import { useTabs } from '.'
import Image from 'components/Image'
// import { scrollToElement } from '../../utils'
import twitter from 'assets/images/twitter.png'
import tg from 'assets/images/tg.png'
import menu_desc from 'assets/images/menu_desc.png'
import useBreakpoint from 'hooks/useBreakpoint'

const StyledNavLink = styled(NavLink)({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500
})

const navLinkSx = {
  cursor: 'pointer',
  textDecoration: 'none',
  fontSize: 16,
  color: '#191919',
  margin: '13px 24px',
  width: 'fit-content',
  height: 'fit-content',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  borderBottom: '3px solid transparent',
  '&.active': {
    color: (theme: Theme) => theme.palette.primary.main
    // borderColor: (theme: Theme) => theme.palette.primary.main
  },
  '&:hover': {
    color: (theme: Theme) => theme.palette.text.primary
    // borderColor: (theme: Theme) => theme.palette.primary.main
  }
} as const

export default function MobileMenu({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const tabs = useTabs()
  const isSmDown = useBreakpoint('sm')
  return (
    <Drawer
      open={isOpen}
      onClose={onDismiss}
      anchor="right"
      BackdropProps={{ sx: { backgroundColor: 'transparent' } }}
      PaperProps={{
        sx: {
          width: { xs: 200, sm: 345 },
          top: 0
          // top: theme => ({ xs: theme.height.mobileHeader, sm: theme.height.header })
        }
      }}
      sx={{
        zIndex: theme => theme.zIndex.drawer,
        overflow: 'hidden'
        // top: theme => ({ xs: theme.height.mobileHeader, sm: theme.height.header })
      }}
    >
      <Box display="grid" gap="15px" position={'relative'}>
        <Box
          sx={{
            height: { xs: 200, sm: 315 },
            backgroundColor: '#14A65F',
            display: 'grid',
            justifyItems: 'center',
            alignContent: 'center'
          }}
        >
          <Image src={logo} width={'40%'} />
          <Image src={title} style={{ margin: '20px' }} width={'60%'} />
        </Box>
        {tabs.map(({ title, route, link, titleContent, subTab, image }) => {
          const content = titleContent ?? title
          return subTab ? (
            <Accordion placeholder={title} key={title}>
              {subTab.map(sub => {
                const subContent = sub.titleContent ?? sub.title
                return sub.link ? (
                  <MenuItem key={sub.link}>
                    <ExternalLink href={sub.link} sx={navLinkSx}>
                      {subContent}
                    </ExternalLink>
                  </MenuItem>
                ) : (
                  <MenuItem key={sub.title} onClick={onDismiss}>
                    <StyledNavLink to={sub.route ?? ''} className={'link'} sx={navLinkSx}>
                      {subContent}
                    </StyledNavLink>
                  </MenuItem>
                )
              })}
            </Accordion>
          ) : link ? (
            <ExternalLink href={link} sx={navLinkSx} key={link}>
              {content}
            </ExternalLink>
          ) : (
            route && (
              <StyledNavLink key={title} id={`${route}-nav-link`} to={route} sx={navLinkSx}>
                <Image src={image} width={40} style={{ marginRight: 6 }} />
                {content}
              </StyledNavLink>
            )
          )
        })}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <ExternalLink href={'https://book.peafarms.app/'}>
          <Image src={menu_desc} width={isSmDown ? 30 : 50} />
        </ExternalLink>
        <ExternalLink href={'https://twitter.com/peafarms'}>
          <Image src={twitter} width={isSmDown ? 30 : 50} />
        </ExternalLink>
        <ExternalLink href={'https://t.me/Pea_farms'}>
          <Image src={tg} width={isSmDown ? 30 : 50} />
        </ExternalLink>
      </Box>
    </Drawer>
  )
}

function Accordion({ children, placeholder }: { children: React.ReactNode; placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = useCallback(() => {
    setIsOpen(state => !state)
  }, [])
  return (
    <>
      <Box sx={navLinkSx} display="flex" alignItems="center" gap={12} onClick={handleClick}>
        {placeholder}{' '}
        <ExpandMore
          sx={{
            transform: isOpen ? 'rotate(180deg)' : ''
          }}
        />
      </Box>

      {isOpen && (
        <Box mt={-25} mb={12}>
          {children}
        </Box>
      )}
    </>
  )
}
