import React, { useEffect } from 'react';
import { default as NextHead } from 'next/head';
import { useLoadConfig } from '../../hooks/useLoadConfig';
import { Spinner } from "@chakra-ui/react"; // Import Spinner for loading state

interface Props {
  title?: string;
  description?: string;
}

export function Head(props: Props) {
  // Load the configuration
  const { config, configLoading } = useLoadConfig();

  // Check if the config is loading
  if (configLoading) {
    return <Spinner size="xs" />;
  }

  // Handle case where config is null or not fully loaded
  if (!config) {
    return <div>Error loading configuration.</div>;
  }

  // Define the favicon URL based on the configuration
  const faviconUrl = config?.FAVICON ?? '/favicon.ico'; // Use the default favicon if not configured

  return (
    <NextHead>
      <title>{props.title ?? config.SITE_NAME}</title>
      <meta name="description" content={props.description ?? config.SITE_DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="web3yak.com" />
      <link rel="icon" href={faviconUrl} type="image/x-icon" /> {/* Add the favicon dynamically */}
    </NextHead>
  );
}
