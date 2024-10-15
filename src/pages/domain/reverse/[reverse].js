//src\pages\domain\reverse\[reverse].js

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
var w3d = require("@odude/oduderesolve");
import { FaEthereum } from "react-icons/fa";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abiFile from "../../../abiFile.json";
import useDomainInfo from "../../../hooks/domainInfo";
import { useNetworkValidation } from "../../../hooks/useNetworkValidation";
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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useLoadConfig } from "../../../hooks/useLoadConfig";

export default function Info() {
  const { config, configLoading } = useLoadConfig(); // Load configuration
  const { isValid, contractAddress } = useNetworkValidation(); // Get the contract address and validation status

  const { isConnected, address } = useAccount();
  //console.log("User Address:.....", address); // Ensure this is populated
  const router = useRouter();
  const { reverse } = router.query;
  const domain = reverse ? String(reverse).toLowerCase() : "";
  const [addrDomain, setAddrDomain] = useState(null); // Initialize as null
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true); // Separate fetching state
  const [isTransactionLoading, setIsTransactionLoading] = useState(false); // Separate transaction loading
  const bg=useColorModeValue("white", "gray.700");
  const color=useColorModeValue("gray.700", "whiteAlpha.900");
  var CONTRACT_ADDRESS = ""; // No contract found
  if (contractAddress) {
    CONTRACT_ADDRESS = contractAddress;
    // console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS); // Verify contract address
  }

  const { domainId, ownerAddress } = useDomainInfo(domain);

  const tokenId = domainId ? domainId.toNumber() : undefined;
/*

  console.log("Fetched domainId:", domainId);
  console.log("Fetched ownerAddress:", ownerAddress);
  console.log("User Address:", address);
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Domain ID (tokenId):", tokenId);
  console.log("Preparing setReverse with args:", [tokenId]);
*/

  
  const {
    config: config_c,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abiFile.abi,
    functionName: 'setReverse',
    args: tokenId ? [tokenId] : undefined, // Pass tokenId as number
    enabled: !!CONTRACT_ADDRESS && !!tokenId && !!address, // Enable only if all required params are present
  });
  


  const { data, werror, isError, write } = useContractWrite(config_c);

  const { isWriteLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const toast = useToast();

  const isDomainMatched = (domain) => {
    // Check if the domain is an exact match or ends with any of the TLDs
    return config?.DOMAIN_TLDS.some(
      (tld) => domain === tld || domain.endsWith(`.${tld}`)
    );
  };

  const isDisabled =
    !write ||
    isFetching ||
    isTransactionLoading ||
    !CONTRACT_ADDRESS ||
    !tokenId ||
    !address;
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle success and error alerts
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessAlert(true);
    }
    if (isPrepareError || isError) {
      setShowErrorAlert(true);
      const errorMsg = (prepareError || werror)?.message || "An error occurred";
      setErrorMessage(errorMsg);
    }
  }, [isSuccess, isPrepareError, isError, prepareError, werror]);

  // Show alerts using toast
  useEffect(() => {
    function showAlert(title, err) {
      toast({
        title: title,
        description: err,
        status: "warning",
        duration: 4000,
        isClosable: false,
      });
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

  // Fetch domain data
  useEffect(() => {
    setIsFetching(true); // Set fetching to true
    const settings = {
      matic_rpc_url: process.env.NEXT_PUBLIC_MATIC,
      eth_rpc_url: process.env.NEXT_PUBLIC_ETH,
      fvm_rpc_url: process.env.NEXT_PUBLIC_FILECOIN,
      wallet_pvt_key: process.env.NEXT_PUBLIC_PVT_KEY,
    };

    const resolve = new w3d(settings);
    // console.log(resolve);

    if (domain && config && address) {
      resolve
        .getDomain(address, config.DOMAIN_TYPE)
        .then((domainData) => {
          // Changed parameter name to avoid confusion
          setAddrDomain(domainData);
          setIsFetching(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsFetching(false);
        });
    } else {
      setIsFetching(false); // No domain to fetch
    }
  }, [domain, address, config]);

  // Handle transaction loading state
  useEffect(() => {
    if (isWriteLoading) {
      setIsTransactionLoading(true);
    } else {
      setIsTransactionLoading(false);
    }
  }, [isWriteLoading]);

  

  // Conditional rendering based on config loading state
  if (configLoading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xs" />
      </Flex>
    );
  }

  if (!config) {
    return <div>Error loading configuration.</div>;
  }

  if (!isValid) {
    return <div>Please connect to the correct network.</div>;
  }

  return (
    <Flex
      align="center"
      justify="center"
      bg={bg}
      borderRadius="md"
      color={color}
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
          {isValid && isDomainMatched(domain) ? (
            <Stack
              as={Box}
              textAlign={"center"}
              alignItems={"center"}
              justifyContent={"center"}
              spacing={{ base: 2, md: 2 }}
              py={{ base: 10, md: 6 }}
            >
              {isFetching ? (
                <Box padding="6" boxShadow="lg" bg="white">
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={4}
                    spacing="4"
                    skeletonHeight="3"
                  />
                </Box>
              ) : (
                <>
                  {error ? (
                    <p>Error: {error}</p>
                  ) : (
                    <p>
                      <Card
                        direction={{ base: "column", sm: "row" }}
                        overflow="hidden"
                        variant="outline"
                      >
                        <Stack>
                          <Heading size="md">On-chain Reverse Address</Heading>

                          {address === ownerAddress ? (
                            <div>
                              <CardBody>
                                <br />
                                <Card>
                                  <CardBody>
                                    <Flex>
                                      <FaEthereum />
                                      <Box ml="3">
                                        <Text fontWeight="bold">{domain}</Text>
                                        <Text fontSize="sm">
                                          {ownerAddress}
                                        </Text>
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
                                      <Box ml="3">
                                        <Text fontWeight="bold">{address}</Text>
                                        <Text fontSize="sm">{addrDomain}</Text>
                                      </Box>
                                    </Flex>
                                  </CardBody>
                                </Card>
                              </CardBody>

                              <CardFooter>
                                {write && domain !== addrDomain && (
                                  <Button
                                    rightIcon={<FaEthereum />}
                                    colorScheme="yellow"
                                    mt={4}
                                    disabled={isDisabled}
                                    onClick={() => {
                                      if (write) {
                                        setIsTransactionLoading(true); // Start transaction loading
                                        write();
                                      }
                                    }}
                                  >
                                    {isTransactionLoading ? (
                                      "Updating..."
                                    ) : (
                                      <>Reverse to {domain}</>
                                    )}
                                  </Button>
                                )}
                              </CardFooter>
                            </div>
                          ) : (
                            <Alert status="error">
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
          ) : (
            <>{config.NETWORK_ERROR}</>
          )}
        </Box>
      </Container>
    </Flex>
  );
}
