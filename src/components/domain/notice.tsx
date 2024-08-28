import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { NETWORK_ERROR } from "../../configuration/Config";

const Notice = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Wallet Notice:</AlertTitle>
      <AlertDescription>{NETWORK_ERROR}</AlertDescription>
    </Alert>
  );
};

export default Notice;
