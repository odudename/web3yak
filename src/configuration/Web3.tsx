import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ReactNode } from 'react'
//import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { useLoadConfig } from "../hooks/useLoadConfig";
import React from 'react'

let INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY || "";
let ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY || "";

interface Props {
  children: ReactNode
}


export function Web3Provider(props: Props) {
  const { config, configLoading } = useLoadConfig();
      // If loading, show a loading state for the header
      if (configLoading) {
        return <div>Loading...</div>;
      }
    
      // If config is missing or failed to load
      if (!config) {
        return <div>Error loading configuration.</div>;
      }

  const { chains, provider } = configureChains(config.NETWORKS, [alchemyProvider({ apiKey: ALCHEMY_KEY }), publicProvider()])
  
  const { connectors } = getDefaultWallets({
    appName: 'odude',
    projectId: config.PROJECT_ID,
    chains,
  })
  
  const client = createClient({
    autoConnect: true,
    connectors,
    provider,
  })

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider modalSize="compact" coolMode chains={chains}>
        {props.children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
