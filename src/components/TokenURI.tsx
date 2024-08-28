import React, { useEffect, useState } from 'react';
import useDomainInfo from '../hooks/domainInfo'; // Adjust the path to the actual location
import { FaStop } from "react-icons/fa";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import abiFile from '../abiFile.json';
import { ethers } from 'ethers';
import { Button, useToast } from "@chakra-ui/react";
import { checkContract } from '../hooks/useNetworkValidation';
import useGlobal from '../hooks/global';

function TokenURI({ domainName, TokenURI }: { domainName: string; TokenURI: string }) {
  const { domainId, ownerAddress, oldUri } = useDomainInfo(domainName);
  const { showToast } = useGlobal();
  const [hasUpdated, setHasUpdated] = useState(false); // Flag to prevent repeated execution
  const contractAddress = checkContract();

var CONTRACT_ADDRESS = ''; // No contract found
    if (contractAddress) {
      CONTRACT_ADDRESS = contractAddress;
     // console.log(CONTRACT_ADDRESS);
    } 
//console.log(TokenURI);
//console.log(domainId);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: abiFile.abi,
    functionName: 'setTokenURI',
    args: [domainId, TokenURI],
    overrides: {
      value: ethers.utils.parseEther("0.01")
    }
  })
  const { data, error, isError, write } = useContractWrite(config)
   //console.log(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  const toast = useToast();

  const randomNumber = Math.random();
  const url = "https://web3domain.org/endpoint/v1/index.php?domain=" + domainName + "&" + randomNumber+"&update=yes";
 
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorHandled, setErrorHandled] = useState(false); // New state variable to track if error has been handled
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isSuccess && !hasUpdated) {
      console.log("Transaction successful, updating API.");
      
      const updateApi = async () => {
        try {
         // console.log("Starting API update");
          // Uncomment the actual API call when ready
          const response = await fetch(url);
          const json = await response.json();
          console.log("API updated");
        } catch (error) {
          console.error("API update failed:", error);
        }
      };
  
      updateApi();
           setHasUpdated(true); // Flag to avoid repeated execution
    } else {
     // console.log("API update not required");
      setHasUpdated(true);
    }
  }, [isSuccess, hasUpdated, url]); // Dependencies should reflect variables affecting this `useEffect`
  

  useEffect(() => {
   
    if (isPrepareError || isError) {
      setShowErrorAlert(true);
      const errorMessage = (prepareError || error)?.message || 'An error occurred';
      setErrorMessage(errorMessage);
    }

  }, [isPrepareError, isError, prepareError]);



  useEffect(() => {
    if (showErrorAlert && !errorHandled) { // Only show the alert if it hasn't been handled
      showToast("Error", errorMessage, "warning");
      console.log("0000");
      setErrorHandled(true); // Mark the error as handled
      setShowErrorAlert(false); // Reset the state to prevent re-triggering
    }
  }, [showErrorAlert, errorHandled]); // This `useEffect` should trigger only if `showErrorAlert` changes and `errorHandled` is false


  useEffect(() => {
    if (showSuccessAlert) {
      showToast("Success", "Successfully synchronized with blockchain", "success");
      setShowSuccessAlert(false); // Reset the state after showing the alert
      setHasUpdated(false); // Optional: Reset hasUpdated if needed
      //console.log("Success alert triggered");
    }
  }, [showSuccessAlert]); // Trigger only when `showSuccessAlert` changes
  

  useEffect(() => {
    if (isSuccess) {
    //  console.log("Successful......."); // Confirm if this logs
      setShowSuccessAlert(true);
     // showToast("Success", "Testing.....", "success");
    }
  }, [isSuccess]);

  return (
    <div>

      {write && (
        <Button
        size="sm" 
          rightIcon={<FaStop />}
          colorScheme="yellow"
          mt={4}
          disabled={!write || isLoading}
          onClick={() => write && write()} // Ensure write function is available before calling
        >
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      )}
    </div>
  );
}

export default TokenURI;
