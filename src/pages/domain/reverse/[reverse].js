import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
var w3d = require("@odude/odudename");
import { FaEthereum } from "react-icons/fa";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import abiFile from '../../../abiFile.json';
import useDomainInfo from '../../../hooks/domainInfo';
import { useNetworkValidation, checkContract } from '../../../hooks/useNetworkValidation';
import HomeButton from "../../../components/HomeButton"; // Home Button
import {
  Box,
  Button,
  Container,
  Flex,
  SkeletonText,
  Skeleton,
  CardHeader,
  Heading,
  Stack,
  SkeletonCircle,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  useToast
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import {
  Divider
} from '@chakra-ui/react'
import { useAccount } from "wagmi";
import { NETWORK_ERROR,DOMAIN_TYPE,DOMAIN_TLDS} from '../../../configuration/Config'


export default function Info() {
  const { address } = useAccount();
  const router = useRouter();
  const { reverse } = router.query;
  const domain = reverse ? String(reverse).toLowerCase() : "";
  const [addrDomain, setAddrDomain] = useState(null); // Initialize jsonData as null
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const contractAddress = checkContract();
  const isNetworkValid = useNetworkValidation();
  var CONTRACT_ADDRESS = ''; // No contract found
  if (contractAddress) {
    CONTRACT_ADDRESS = contractAddress;
    //console.log(CONTRACT_ADDRESS);
  }

  const { domainId, ownerAddress } = useDomainInfo(domain);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abiFile.abi,
    functionName: 'setReverse',
    args: [domainId],
  })
  const { data, werror, isError, write } = useContractWrite(config)
  // console.log(config);

  const { isWriteLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  const toast = useToast();

  const isDomainMatched = (domain) => {
    // Check if the domain is an exact match or ends with any of the TLDs
    return DOMAIN_TLDS.some(tld => domain === tld || domain.endsWith(`.${tld}`));
  };


  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    if (isSuccess) {
      setShowSuccessAlert(true);
    }
    if (isPrepareError || isError) {
      setShowErrorAlert(true);
      const errorMessage = (prepareError || werror)?.message || 'An error occurred';
      setErrorMessage(errorMessage);
    }
  }, [isSuccess, isPrepareError, isError, prepareError, werror]);


  useEffect(() => {

    function showAlert(title, err) {

      toast({
        title: title,
        description: err,
        status: 'warning',
        duration: 4000,
        isClosable: false,
      })
    }
    if (showSuccessAlert) {
      showAlert("Success", "Successfully synchronized with blockchain");
      setShowSuccessAlert(false); // Reset the state
    }
    if (showErrorAlert) {
      showAlert("Error", errorMessage);
      setShowErrorAlert(false); // Reset the state
    }
  }, [showSuccessAlert, showErrorAlert, errorMessage, toast]);

  useEffect(() => {

    setIsLoading(true); // Set isLoading to true whenever the effect runs
    const settings = {
      matic_rpc_url: process.env.NEXT_PUBLIC_MATIC,
      eth_rpc_url: process.env.NEXT_PUBLIC_ETH,
      fvm_rpc_url: process.env.NEXT_PUBLIC_FILECOIN,
      wallet_pvt_key: process.env.NEXT_PUBLIC_PVT_KEY
    };

    const resolve = new w3d(settings);
   // console.log(resolve);

    // console.log(resolve.SmartContractAddress); //Polygon Mainnet contract address
    // console.log(resolve.fvm_SmartContractAddress);  //Filecoin 


    if (domain) {



      resolve.getDomain(address, DOMAIN_TYPE)
        .then(address => {
          setAddrDomain(address);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });



    }
  }, [domain, address]);

  return (

    <Flex
      align="center"
      justify="center"
      bg={useColorModeValue("white", "gray.700")}
      borderRadius="md"
      color={useColorModeValue("gray.700", "whiteAlpha.900")}
      shadow="base"
    >
       <Container
          maxW={"3xl"}
          alignContent={"center"}
          textAlign="center"
          alignItems={"center"}
          justifyContent={"center"}
        >
     <HomeButton domain={domain} />

      <Box
        textAlign="center"
        alignContent={"center"}
        borderRadius="lg"
        p={{ base: 2, lg: 1 }}
        bgSize={"lg"}
        maxH={"80vh"}
      >
        {isNetworkValid && isDomainMatched(domain) ? (
          
            <Stack
              as={Box}
              textAlign={"center"}
              alignItems={"center"}
          justifyContent={"center"}
              spacing={{ base: 2, md: 2 }}
              py={{ base: 10, md: 6 }}
            >

              {isLoading ? (
                <Box padding='6' boxShadow='lg' bg='white'>
                  <SkeletonCircle size='10' />
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='3' />
                </Box>
              ) : (
                <>
                  {error ? (
                    <p>Error: {error}</p>
                  ) : (
                    <p>

                      <Card
                        direction={{ base: 'column', sm: 'row' }}
                        overflow='hidden'
                        variant='outline'
                        
                      >
                        <Stack>
                          <Heading size='md'>On-chain Reverse Address</Heading>
                          
                          {address == ownerAddress ? (
                            <div>
                              <CardBody>



                                <br />
                                <Card>
                                  <CardBody>
                                    <Flex>
                                      <FaEthereum />
                                      <Box ml='3'>
                                        <Text fontWeight='bold'>
                                          {domain}

                                        </Text>
                                        <Text fontSize='sm'>{ownerAddress}</Text>
                                      </Box>
                                    </Flex>
                                  </CardBody>
                                </Card>
                                <br />
                                <Divider />
                                <br />
                                <Card>
                                  <CardBody>
                                    <Flex>
                                      <FaEthereum />
                                      <Box ml='3'>
                                        <Text fontWeight='bold'>
                                          {address}
                                        </Text>
                                        <Text fontSize='sm'>{addrDomain}</Text>
                                      </Box>
                                    </Flex>
                                  </CardBody>
                                </Card>


                              </CardBody>

                              <CardFooter>


                                {write && domain != addrDomain && (
                                  <Button
                                    rightIcon={<FaEthereum />}
                                    colorScheme="yellow"
                                    mt={4}
                                    disabled={!write || isLoading}
                                    onClick={() => write && write()} // Ensure write function is available before calling
                                  >
                                    {isLoading ? 'Updating...' : (<>Reverse to {domain}</>)}
                                  </Button>
                                )}
                              </CardFooter>
                            </div>
                          ) : (
                            
                            <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle>You are not authorized.</AlertTitle>

                          </Alert>
                          
                          )}
                        </Stack>
                      </Card>

                    </p>



                  )}
                </>
              )}

            </Stack>
          
        ) :
          (<>{NETWORK_ERROR}</>)
        }
      </Box>
      </Container>
    </Flex>
  )
}
