import { useAccount, useNetwork } from "wagmi";
import { DOMAIN_NETWORK_CHAIN } from '../configuration/Config'

function useNetworkValidation() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  if (!isConnected) {
    // Not connected
   // console.log("Not connected to any wallet");
    return false;
  }

  if (chain?.id !== DOMAIN_NETWORK_CHAIN) {
 console.log(`Connected to a different network : ${chain?.name}. Please switch to ${DOMAIN_NETWORK_CHAIN}`);
  //console.log(chain);
    return false;
  }

  //console.log("Connected to the right network");
  return true;
}

function checkContract() {
  if (DOMAIN_NETWORK_CHAIN === 137 as number) {
    return "0x3325229F15fe0Cee4148C1e395b080C8A51353Dd";
  } else if (DOMAIN_NETWORK_CHAIN === 80001 as number) {
    return "0xf89F5492094b5169C82dfE1cD9C7Ce1C070ca902";
  } else if (DOMAIN_NETWORK_CHAIN === 314 as number) {
    return "0x732dC8d0c7388c3E60e70776D0a1e663166cfCBD";
  } else {
    return null; // Return null or handle other cases as needed
  }
}

export { useNetworkValidation, checkContract };
