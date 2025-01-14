import { useToast , UseToastOptions } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { useLoadConfig } from "../hooks/useLoadConfig";

function useGlobal() {
  const toast = useToast();
  const { config, configLoading } = useLoadConfig();
  function showToast(title: string, description: string, status: UseToastOptions["status"]) {

    toast({
      title: title,
      description: description,
      status: status,
      duration: 4000,
      isClosable: false,
    });
  }

  function replaceNullWithEmptyString(obj: any) {
    for (const key in obj) {
      if (obj[key] === null) {
        obj[key] = "";
      } else if (typeof obj[key] === "object") {
        replaceNullWithEmptyString(obj[key]);
      }
    }
  }

  function getDomainTLD(domainName: string) {
    const parts = domainName.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    } else {
      return domainName;
    }
  }

  async function getErcBalance(contractAddress: string, walletAddress: string, rpcUrl: string) {
    
    try {

       // Ensure config is loaded before continuing
       if (configLoading) {
        throw new Error('Config is still loading');
      }

      // Use config.TOKEN_DECIMAL instead of TOKEN_DECIMAL
      const tokenDecimal = config.TOKEN_DECIMAL;


      //console.log(rpcUrl);
      // Connect to Ethereum using an appropriate provider
      const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/wdUDrkg1zZhHlYC-59w5qJCQWfO1InE7');

      // Connect to the ERC20 contract
      const ercContract = new ethers.Contract(contractAddress, [
        'function balanceOf(address) view returns (uint256)',
      ], provider);

      // Call balanceOf function of ERC20 contract to get balance
      const balanceBigNumber = await ercContract.balanceOf(walletAddress);
      // Convert balance to human-readable format
      const balanceFormatted = ethers.utils.formatUnits(balanceBigNumber, tokenDecimal );

      return balanceFormatted;
    } catch (error) {
      console.error('Error fetching ERC20 balance:', error);
      return null;
    }
  }

  function isValidDomainName(domainName: string): boolean {
    const atCount = domainName.split('@').length - 1;
    if (atCount > 1) return false;
  
    return (
      /^[a-z\d]([a-z\d.]*[a-z\d])?(@[a-z\d]([a-z\d.]*[a-z\d])?)*$/i.test(domainName) &&
      /^.{1,253}$/.test(domainName) &&
      /^[^@]{1,63}(@[^@]{1,63})*$/.test(domainName)
    );
  }

  return { showToast, replaceNullWithEmptyString, getDomainTLD , getErcBalance, isValidDomainName};
}

export default useGlobal;
