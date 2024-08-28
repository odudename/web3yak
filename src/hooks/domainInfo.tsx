import { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
import abiFile from '../abiFile.json';
import { useNetworkValidation, checkContract } from './useNetworkValidation';
const contractAddress = checkContract();
var CONTRACT_ADDRESS = ''; // No contract found
    if (contractAddress) {
      CONTRACT_ADDRESS = contractAddress;
     // console.log(CONTRACT_ADDRESS);
    } else {
      console.log("No matching contract address found for the current chain.");
    }

function useDomainInfo(domainName: string) {
  const [domainId, setDomainId] = useState<number | null>(null);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [oldUri, setOldUri] = useState<string | null>(null);
  const [erc20, setErc20] = useState<number | null>(null);
  const [listing_price, setAllow] = useState<number | null>(null);
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'getID',
        args: [domainName],
      },
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'getOwner',
        args: [domainId],
      },
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'tokenURI',
        args: [domainId],
      },
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: abiFile.abi,
        functionName: 'get_erc_TLD',
        args: [domainId],
      },
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
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
   // console.log("am here");
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

export default useDomainInfo;
