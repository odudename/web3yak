// src/hooks/domainInfo.tsx

import { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
import abiFile from '../abiFile.json';
import { useNetworkValidation } from './useNetworkValidation';

interface DomainInfo {
  domainId: number | null;
  oldUri: string | null;
  ownerAddress: string | null;
  erc20: number | null;
  listing_price: number | null;
  isLoading: boolean;
  isError: boolean;
}

interface AddressInfo {

  odudeName: string | null;
  isLoading: boolean;
  isError: boolean;
}


function useDomainInfo(domainName: string): DomainInfo {
  const [domainId, setDomainId] = useState<number | null>(null);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [oldUri, setOldUri] = useState<string | null>(null);
  const [erc20, setErc20] = useState<number | null>(null);
  const [listing_price, setAllow] = useState<number | null>(null);

  const { isValid, contractAddress } = useNetworkValidation(); // Get the contract address and validation status

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: contractAddress as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'getID',
        args: [domainName],
      },
      {
        address: contractAddress as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'getOwner',
        args: [domainId]
      },
      {
        address: contractAddress as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'tokenURI',
        args: [domainId]
      },
      {
        address: contractAddress as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'get_erc_TLD',
        args: [domainId]
      },
      {
        address: contractAddress as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'getAllow',
        args: [domainId],
      },
    ],
  });

  useEffect(() => {
    if (data && !isError) {
      const dataArray = data as [number, string, string, number, number]; // Adjust the types as needed
      setDomainId(dataArray[0]);
      setOwnerAddress(dataArray[1]);
      setOldUri(dataArray[2]);
      setErc20(dataArray[3]);
      setAllow(dataArray[4]);
    }
  }, [data, isError]);

  return {
    domainId,
    oldUri,
    ownerAddress,
    erc20,
    listing_price,
    isLoading,
    isError,
  };
}


function useAddressInfo(walletAddress: string): AddressInfo {
  const [odudeName, setOdudeName] = useState<string | null>(null);
  const { isValid, contractAddress } = useNetworkValidation(); // Get the contract address and validation status
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: contractAddress as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'getReverse',
        args: [walletAddress],
      },
    ],
  });

  useEffect(() => {
    if (data && !isError) {
      const dataArray = data as [string]; // Adjust the types as needed
      //console.log(dataArray[0]);
      setOdudeName(dataArray[0]);

    }
  }, [data, isError]);


  return {
    odudeName,
    isLoading,
    isError,
  };
}

export type { AddressInfo };
export { useDomainInfo, useAddressInfo };
