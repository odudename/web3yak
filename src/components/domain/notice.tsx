import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useLoadConfig } from '../../hooks/useLoadConfig';

const Notice = () => {
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
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Wallet Notice:</AlertTitle>
      <AlertDescription>{config.NETWORK_ERROR}</AlertDescription>
    </Alert>
  );
};

export default Notice;
