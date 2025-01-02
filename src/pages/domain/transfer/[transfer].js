import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { isValidEthAddress } from "../../../hooks/validate";
import { FaEthereum, FaGreaterThan } from "react-icons/fa";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abiFile from "../../../abiFile.json";
import useDomainInfo from "../../../hooks/domainInfo";
import { useNetworkValidation } from "../../../hooks/useNetworkValidation";
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
  Input,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useLoadConfig } from "../../../hooks/useLoadConfig";
import HomeButton from "../../../components/HomeButton"; // Home Button



export default function Info() {
  const { config, configLoading } = useLoadConfig(); // Load configuration
  const { address } = useAccount();
  const router = useRouter();
  const { transfer } = router.query;
  const domain = transfer ? String(transfer).toLowerCase() : "";
  const [addrDomain, setAddrDomain] = useState(null); // Initialize jsonData as null
  const [domainAddr, setDomainAddr] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isValid, contractAddress } = useNetworkValidation(); // Get the contract address and validation status
  const [to, setTo] = useState("");
  const [eth, setEth] = useState("");
  const [flag, setFlag] = useState(false);
  var CONTRACT_ADDRESS = ""; // No contract found
  if (contractAddress) {
    CONTRACT_ADDRESS = contractAddress;
  }
  const { domainId, ownerAddress } = useDomainInfo(domain);
  const toast = useToast();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const bg=useColorModeValue("white", "gray.700");
  const color=useColorModeValue("gray.700", "whiteAlpha.900");

  const isDomainMatched = (domain) => {
    // Check if the domain is an exact match or ends with any of the TLDs
    return config.DOMAIN_TLDS.some(tld => domain === tld || domain.endsWith(`@${tld}`));
  };

  const {
    config: config_c,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abiFile.abi,
    functionName: "transferFrom",
    args: [address, to, domainId],
    enabled: { flag },
  });

  //console.log(address+" - "+" - "+ eth+" - "+domainId);
  const { data, werror, isError, write } = useContractWrite(config_c);
  // console.log(config);

  const { isWriteLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (domainId && config) {
      setIsLoading(false);
      // console.log(domainId.toNumber());
    }
  }, [domain, domainId, config]);

  useEffect(() => {
    if (to) {
      // setIsLoading(false);
      console.log(to);
      write && write();
    }
  }, [to]);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessAlert(true);
    }
    if (isPrepareError || isError) {
      setShowErrorAlert(true);
      const errorMessage =
        (prepareError || werror)?.message || "An error occurred";
      setErrorMessage(errorMessage);
    }
  }, [isSuccess, isPrepareError, isError, prepareError, werror]);

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
      showAlert("Success", "Successfully transferred to wallet address");
      setShowSuccessAlert(false); // Reset the state
    }
    if (showErrorAlert) {
      if (eth != "") {
        showAlert("Error", errorMessage);
        setShowErrorAlert(false); // Reset the state
      }
    }
  }, [showSuccessAlert, showErrorAlert, errorMessage, eth]);

  const handleTransfer = async () => {
    console.log("Handle transfer called with eth:", eth);
    setFlag(false);
    setTo(eth);
    console.log(domainId.toNumber());

    if (isValidEthAddress(eth)) {
      console.log("Valid Ethereum address detected:", eth);
      setFlag(true);
    } else {
      console.log("Invalid Ethereum address detected:", eth);
      setShowErrorAlert(true);
      setFlag(false);
      setErrorMessage("Invalid Ethereum Address");
    }

    
    write && write();


  };

  if (!config) {
    return <div>Error loading configuration.</div>;
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
              {isLoading ? (
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
                    <>
                      <Card
                        direction={{ base: "column", sm: "row" }}
                        overflow="hidden"
                        variant="outline"
                      >
                        <Stack>
                          <Heading size="md">Transfer Name</Heading>

                          {address == ownerAddress ? (
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
                                <Text fontWeight="bold">To</Text>

                                <Card>
                                  <CardBody>
                                    <Flex>
                                      <Box ml="3">
                                        <Input
                                          focusBorderColor="lime"
                                          variant="outline"
                                          placeholder="Wallet address Eg. 0x....."
                                          size="sm"
                                          htmlSize={50}
                                          width="auto"
                                          value={eth}
                                          onChange={(event) =>
                                            setEth(event.currentTarget.value)
                                          }
                                        />
                                      </Box>
                                    </Flex>
                                  </CardBody>
                                </Card>
                              </CardBody>

                              <CardFooter>
                                {domain != addrDomain && !isSuccess && (
                                  <Button
                                    rightIcon={<FaEthereum />}
                                    colorScheme="teal"
                                    mt={4}
                                    size="sm"
                                    disabled={isLoading}
                                    onClick={() => {
                                      handleTransfer();
                                    }} // Ensure write function is available before calling
                                  >
                                    {isLoading ? (
                                      "Transferring ..."
                                    ) : (
                                      <>Transfer</>
                                    )}
                                  </Button>
                                )}

                                {isSuccess && (
                                  <>
                                    &nbsp;
                                    <Button
                                      variant="solid"
                                      colorScheme="yellow"
                                      size="sm"
                                    >
                                      <Link href={`/domain/info/${domain}`}>
                                        Check Status
                                      </Link>
                                    </Button>
                                  </>
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
                    </>
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
