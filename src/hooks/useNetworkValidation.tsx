// src/hooks/useNetworkValidation.tsx

import { useAccount, useNetwork } from "wagmi";
import { useLoadConfig } from "./useLoadConfig";
import { useEffect, useState } from "react";

interface NetworkValidation {
  isValid: boolean;
  contractAddress: string | null;
}

function useNetworkValidation(): NetworkValidation {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { config, configLoading } = useLoadConfig(); 
  const [validation, setValidation] = useState<NetworkValidation>({
    isValid: false,
    contractAddress: null,
  });

  useEffect(() => {
    if (configLoading) {
      setValidation({ isValid: false, contractAddress: null });
      return;
    }

    if (!isConnected) {
      console.log("Not connected to any wallet");
      setValidation({ isValid: false, contractAddress: null });
      return;
    }

    if (!chain || chain.id !== config.DOMAIN_NETWORK_CHAIN) {
      console.log(`Connected to a different network: ${chain?.name || "Unknown"}. Please switch to chain ID ${config.DOMAIN_NETWORK_CHAIN}`);
      setValidation({ isValid: false, contractAddress: null });
      return;
    }

    let address: string | null = null;
    switch (config.DOMAIN_NETWORK_CHAIN) {
      case 137:
        address = "0x3325229F15fe0Cee4148C1e395b080C8A51353Dd";
        break;
      case 80001:
        address = "0xf89F5492094b5169C82dfE1cD9C7Ce1C070ca902";
        break;
      case 314:
        address = "0x732dC8d0c7388c3E60e70776D0a1e663166cfCBD";
        break;
      default:
        console.log("Unsupported network chain ID:", config.DOMAIN_NETWORK_CHAIN);
        address = null;
    }

    if (address) {
      console.log("Connected to the right network with contract address:", address);
      setValidation({ isValid: true, contractAddress: address });
    } else {
      setValidation({ isValid: false, contractAddress: null });
    }
  }, [configLoading, isConnected, chain, config]);

  return validation;
}

export { useNetworkValidation };
