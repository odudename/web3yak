import React from 'react'
import { default as NextHead } from 'next/head'
import { useLoadConfig } from '../../hooks/useLoadConfig';
interface Props {
  title?: string
  description?: string
}

export function Head(props: Props) {
     // Load the configuration
     const { config, configLoading } = useLoadConfig();

         // Check if the config is loading
    if (configLoading) {
      return <div>Loading...</div>;
    }
  
    // Handle case where config is null or not fully loaded
    if (!config) {
      return <div>Error loading configuration.</div>;
    }

  return (
    <NextHead>
      <title>{props.title ?? config.SITE_NAME}</title>
      <meta name="description" content={props.description ?? config.SITE_DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="web3yak.com" />
    </NextHead>
    )
}
