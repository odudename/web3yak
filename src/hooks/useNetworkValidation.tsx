import { useAccount, useNetwork } from "wagmi";
import { useLoadConfig } from "../hooks/useLoadConfig";

function useNetworkValidation() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { config, configLoading } = useLoadConfig(); // Correct place to call the hook

  // Ensure config is loaded before proceeding
  if (configLoading) {
    return false; // Handle loading state appropriately
  }

  if (!isConnected) {
    console.log("Not connected to any wallet");
    return false;
  }

  if (chain?.id !== config.DOMAIN_NETWORK_CHAIN) {
    console.log(`Connected to a different network: ${chain?.name}. Please switch to ${config.DOMAIN_NETWORK_CHAIN}`);
    return false;
  }

  console.log("Connected to the right network");
  return true;
}

function checkContract() {
  const { config, configLoading } = useLoadConfig(); // Call the hook inside a valid function

  if (configLoading) {
    return null; // Handle loading state or return something else
  }

  if (config.DOMAIN_NETWORK_CHAIN === 137) {
    return "0x3325229F15fe0Cee4148C1e395b080C8A51353Dd";
  } else if (config.DOMAIN_NETWORK_CHAIN === 80001) {
    return "0xf89F5492094b5169C82dfE1cD9C7Ce1C070ca902";
  } else if (config.DOMAIN_NETWORK_CHAIN === 314) {
    return "0x732dC8d0c7388c3E60e70776D0a1e663166cfCBD";
  } else {
    return null;
  }
}

export { useNetworkValidation, checkContract };
