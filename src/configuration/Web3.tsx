import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ReactNode } from 'react'
//import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { NETWORKS, PROJECT_ID } from '../configuration/Config'
import React from 'react'

let INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY || "";
let ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY || "";

interface Props {
  children: ReactNode
}

const { chains, provider } = configureChains(NETWORKS, [alchemyProvider({ apiKey: ALCHEMY_KEY }), publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'odude',
  projectId: PROJECT_ID,
  chains,
})

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export function Web3Provider(props: Props) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider modalSize="compact" coolMode chains={chains}>
        {props.children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
