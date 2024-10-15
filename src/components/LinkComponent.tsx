import React, { ReactNode } from 'react'
import NextLink from 'next/link'
import { Link, useColorModeValue, Spinner } from '@chakra-ui/react'
import { useLoadConfig } from '../hooks/useLoadConfig';

interface Props {
  href: string
  children: ReactNode
  isExternal?: boolean
  className?: string
}

export function LinkComponent(props: Props) {
    // Load the configuration
    const { config, configLoading } = useLoadConfig();

     // Define the className and isExternal variables at the top
  const className = props.className ?? '';
  const isExternal = props.href.match(/^([a-z0-9]*:|.{0})\/\/.*$/) || props.isExternal;

  // Define the color hook outside of any conditional return
  const defaultColorScheme = 'blue'; // Fallback in case config is not available
  const color = useColorModeValue(
    `${config?.THEME_COLOR_SCHEME || defaultColorScheme}.600`,
    `${config?.THEME_COLOR_SCHEME || defaultColorScheme}.400`
  );

    // Check if the config is loading
    if (configLoading) {
      return (<Spinner size="xs" />);
    }
  
    // Handle case where config is null or not fully loaded
    if (!config) {
      return <div>Error loading configuration.</div>;
    }




  if (isExternal) {
    return (
      <Link className={className} _hover={{ color: color }} href={props.href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </Link>
    )
  }

  return (
    <Link as={NextLink} className={className} _hover={{ color: color }} href={props.href}>
      {props.children}
    </Link>
  )
}
