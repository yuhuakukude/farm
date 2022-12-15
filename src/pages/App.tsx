import { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import { ModalProvider } from 'context/ModalContext'
import { createI18n, I18nProvider } from 'react-simple-i18n'
import { langData } from '../langs/lang'
import Home from './home'
import bodyBg from 'assets/images/bodybg.png'
import { routes } from 'constants/routes'
import Farms from '../pages/farms'
import NFT from './nft'
// import Footer from 'components/Footer'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%',
  maxWidth: '750px',
  margin: 'auto',
  maxHeight: '100vh',
  // overflow: 'auto',
  alignItems: 'center'
})

const BodyWrapper = styled('div')(({ theme }) => ({
  // display: 'flex',
  // flexDirection: 'column',
  // justifyContent: 'center',
  // alignItems: 'center',
  width: '100%',
  minHeight: `calc(100vh - ${theme.height.header})`,
  background: `url(${bodyBg}) no-repeat`,
  backgroundSize: '100% 100%',
  flex: 1,
  // overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.mobileHeader})`
  }
}))

export default function App() {
  return (
    <Suspense fallback={null}>
      <I18nProvider i18n={createI18n(langData, { lang: 'en' })}>
        <ModalProvider>
          <AppWrapper id="app">
            <ContentWrapper>
              <Header />
              <BodyWrapper id="body">
                <Popups />
                <Polling />
                <Web3ReactManager>
                  <Switch>
                    <Route exact strict path={routes.home} component={Home} />
                    <Route exact strict path={routes.farms} component={Farms} />
                    <Route exact strict path={routes.club} component={NFT} />
                    <Route path="/">
                      <Redirect to="/home" />
                    </Route>
                  </Switch>
                </Web3ReactManager>
              </BodyWrapper>
              {/* <Footer /> */}
            </ContentWrapper>
          </AppWrapper>
        </ModalProvider>
      </I18nProvider>
    </Suspense>
  )
}
