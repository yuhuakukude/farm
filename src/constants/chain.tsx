import { Chain } from 'models/chain'
import BSCUrl from 'assets/svg/binance.svg'
import { ReactComponent as BSC } from 'assets/svg/binance.svg'

export enum ChainId {
  TX = 8989
}

export const NETWORK_CHAIN_ID: ChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : ChainId.TX

export const SUPPORT_NETWORK_CHAIN_IDS: ChainId[] = process.env.REACT_APP_CHAIN_IDS
  ? process.env.REACT_APP_CHAIN_IDS.split(',').map(v => Number(v) as ChainId)
  : [ChainId.TX]

export const AllChainList = [
  {
    icon: <BSC height={20} width={20} />,
    logo: BSCUrl,
    symbol: 'TX',
    name: 'Telegramx',
    id: ChainId.TX,
    hex: '0x231d'
  }
]

export const ChainList = AllChainList.filter(v => SUPPORT_NETWORK_CHAIN_IDS.includes(v.id))

export const ChainListMap: {
  [key: number]: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.TX]: {
    chainId: '0x231d',
    chainName: 'Telegramx',
    nativeCurrency: {
      name: 'TX',
      symbol: 'Telegramx',
      decimals: 18
    },
    rpcUrls: ['https://tx.telegramx.space'],
    blockExplorerUrls: ['https://www.telegramx.link/']
  }
}
