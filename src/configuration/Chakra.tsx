import { ChakraProvider as ChakraUiProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useLoadConfig } from '../hooks/useLoadConfig';
import { Spinner, Center } from "@chakra-ui/react"; // Import Spinner for loading state

interface Props {
  children: ReactNode;
}

export function ChakraProvider(props: Props) {
  // Load configuration
  const { config, configLoading } = useLoadConfig();

  // Show a loading spinner while the config is being loaded
  if (configLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Once config is loaded, create the theme using loaded config values
  const theme = extendTheme(
    withDefaultColorScheme({ colorScheme: config.THEME_COLOR_SCHEME }), // Use config for color scheme
    {
      ...config.THEME_CONFIG, // Apply the loaded theme config
    }
  );

  return <ChakraUiProvider theme={theme}>{props.children}</ChakraUiProvider>;
}
