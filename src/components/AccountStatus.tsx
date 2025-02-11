import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { isValidMember } from "../hooks/validate";
import { useAddressInfo } from '../hooks/domainInfo';
import { useLoadConfig } from "../hooks/useLoadConfig";
import {
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { CheckCircleIcon, NotAllowedIcon } from '@chakra-ui/icons';
import localforage from "localforage";

const AccountStatus = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [status, setStatus] = useState<string>();
  const addressInfo = useAddressInfo(walletAddress || '');
  const displayName = addressInfo.odudeName || "No Name";
  const { config, configLoading } = useLoadConfig(); // Load configuration

  const setMembershipStatus = (key: string, status: string) => {
    localforage.setItem(key, status);
  };

  useEffect(() => {
    if (isConnected) {
      setWalletAddress(address || "");
    } else {
      setWalletAddress("");
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isConnected) {
    const tlds = config?.DOMAIN_TLDS || []; // List of TLDs from config

    if (displayName) {
      const isGold = tlds.includes(displayName) || 
                     tlds.some((tld: string) => displayName.endsWith(`@${tld}`));
      const newStatus = isGold ? 'GOLD' : 'REGULAR';
      setStatus(newStatus);
      setMembershipStatus(walletAddress || '', newStatus);
    } else {
      setStatus('REGULAR');
      setMembershipStatus(walletAddress || '', 'REGULAR');
    }
  }
  }, [displayName, config, walletAddress]);

  useEffect(() => {
    if (status && isConnected) {
      const timeoutId = setTimeout(() => {
        async function getStatus() {
          try {
            let test = await isValidMember(walletAddress || '');
            console.log(walletAddress);
            console.log(test); 
          } catch (error) {
            console.error("Error fetching membership status:", error);
          }
        }

        getStatus();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [status]);

  // Check if the config is loading
  if (configLoading) {
    return (<Spinner size="xs" />); 
  }

  // Handle case where config is null or not fully loaded
  if (!config) {
    return <div>Error loading configuration.</div>;
  }

  return (
    <div>
        {isConnected ? (
      <Button onClick={onOpen} m='3'>
        {status === 'GOLD' ? (
          <CheckCircleIcon color="blue.500" />
        ) : (
          <NotAllowedIcon color="red.500" />
        )}
      </Button>
         ) : (
          <p></p>
        )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isConnected ? (
              <div>
                <p>Connected Wallet Address: {walletAddress}</p>
                <p>Odude Name: {displayName}</p>
                <p>Membership Status: {status}</p>
              </div>
            ) : (
              <p>No wallet connected</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AccountStatus;