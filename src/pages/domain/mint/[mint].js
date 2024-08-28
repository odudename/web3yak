import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { generateJson } from "../../../hooks/ipfs";
import { useDomainValidation } from "../../../hooks/validate";
import useGlobal from "../../../hooks/global";
import useDomainInfo from "../../../hooks/domainInfo";
import {
  useNetworkValidation,
  checkContract,
} from "../../../hooks/useNetworkValidation";
import Notice from "../../../components/domain/notice";
import abiFile from "../../../abiFile.json";
import ercabi from "../../../erc20abi.json";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";
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
  Divider,
  SkeletonCircle,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Kbd,
  Tag,
  fadeConfig,
} from "@chakra-ui/react";

import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";

import { ExternalLinkIcon, ChevronRightIcon } from "@chakra-ui/icons"; // Assuming this is how ExternalLinkIcon is imported in your project
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

import { Grid, GridItem } from "@chakra-ui/react";

import {
  DOMAIN,
  DOMAIN_IMAGE_URL,
  DOMAIN_NETWORK_CHAIN,
  DOMAIN_DESCRIPTION,
  NETWORK_ERROR,
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_SYMBOL,
  TOKEN_PRICE,
  TOKEN_DECIMAL,
  DOMAIN_PRICE_SYMBOL,
} from "../../../configuration/Config";

const CONTRACT_ADDRESS = checkContract();

export default function Info() {
  const { isValidDomain, validateDomain } = useDomainValidation(); // Use the correct variable names
  const isNetworkValid = useNetworkValidation();
  const uniqueId = Math.round(Date.now() * Math.random()).toString();
  const { address, connector, isConnected } = useAccount();
  const [ethBalance, setEthBalance] = useState("0.00"); // State to store the ETH balance

  const router = useRouter();
  const { mint } = router.query;
  const domain = mint ? String(mint).toLowerCase() : "";
  const { isValidDomainName, showToast } = useGlobal();
  const [domainName, setDomainName] = useState("odude");
  const [claimId, setClaimId] = useState(uniqueId); // Using claimId state instead of claim_id variable
  const [claimTransferTo, setClaimTransferTo] = useState(
    "0x8D714B10B719c65B878F2Ed1436A964E11fA3271"
  );
  //console.log(domain);
  const [claimUrl, setClaimUrl] = useState(
    "https://web3domain.org/endpoint/temp_json.php?domain=" +
      domain +
      "&image=" +
      DOMAIN_IMAGE_URL
  );
  const [erc20, setErc20] = useState(false); //Only for ERC20 token
  const [allow, setAllow] = useState(false); //Allow for minting
  const [valid, setValid] = useState(false); //Check for domain validation
  const [ercBalance, setErcBalance] = useState("0.00"); //ERC Balance
  const [allowanceBalance, setAllowanceBalance] = useState("0.00"); //ERC Balance
  const [isApprovalNeeded, setIsApprovalNeeded] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(''); // Can be 'pending', 'approved', 'failed'

  // Conditional Overrides
  const overrides = erc20
    ? {} // Empty object for ERC20 (no ETH required)
    : { value: ethers.utils.parseEther(TOKEN_PRICE) }; // Using ETH

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abiFile.abi,
    functionName: "claim",
    args: [claimId, domainName, claimUrl, claimTransferTo],
    overrides, // Apply conditional overrides
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });


  const { AllowanceError, data: allowance } = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ercabi.abi,
    functionName: "allowance",
    args: [address, CONTRACT_ADDRESS],
});

const { getErcBalance } = useGlobal(); // Initialize hooks

  //console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
  //console.log("Address:", address);
  //console.log("TOKEN_CONTRACT_ADDRESS:", TOKEN_CONTRACT_ADDRESS);
  
  //console.log( allowance.toString());

  // Prepare contract write for approval only if needed
  const { config: approveConfig } = usePrepareContractWrite({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ercabi.abi,
    functionName: "approve",
    args: [CONTRACT_ADDRESS, ethers.utils.parseUnits(TOKEN_PRICE, TOKEN_DECIMAL)], // Approve the token price
    enabled: isApprovalNeeded, // Only enable if approval is needed
  });

  const {
    write: approveWrite,
    data: approvalData, // Rename to avoid conflict
    isLoading: isApprovalLoading, // Custom name for loading status
    isError: isApprovalError, // Custom name for error status
    error: approvalError, // Custom error name
  } = useContractWrite(approveConfig);

  const handleApproval = () => {
    if (isApprovalNeeded) {
      console.log('Approval required');
      approveWrite(); // Perform the token approval
      setApprovalStatus('pending'); // Mark as pending after initiating the approval

    }
    else
    {
      console.log("Approval not required");
    }
  };

  useEffect(() => {
    if (isError) {
console.log(error);
    }
    else
    {
      console.log('No error');
    }
  }, [isError, data, error]); // Execute only when `allow` is true

  const handleMint = async () => {
    // console.log("hello " + domain);

    setDomainName(domain);
    setClaimId(uniqueId); // Update claimId state
    setClaimTransferTo(address); // Update claimTransferTo state
    setClaimUrl("https://web3domain.org/endpoint/temp_json.php?domain=" +domain +"&image=" +DOMAIN_IMAGE_URL);

    if (!isPrepareError) {
      console.log("To: "+address + " \n URL: "+claimUrl);
      write();
    } else {
      // console.log(prepareError);
      showAlert("Domain is prepared to get minted.");
    }
  };

  const toast = useToast();
  function showAlert(err) {
    toast({
      title: "Notice",
      description: err,
      status: "warning",
      duration: 4000,
      isClosable: false,
    });
  }


  useEffect(() => {
    // If a transaction hash is available, update the status
    if (approvalData?.hash) {
      console.log(`Transaction hash: ${approvalData.hash}`);
      setApprovalStatus('approved'); // Approval successful
    }

    // If there's an error, mark as failed
    if (isApprovalError) {
      console.error('Approval error:', approvalError?.message);
      setApprovalStatus('failed'); // Approval failed
    }

    // If it's still loading, keep the status pending
    if (isApprovalLoading) {
      setApprovalStatus('pending'); // Transaction still pending
    }
  }, [approvalData, isApprovalLoading, isApprovalError, approvalError]);

  useEffect(() => {
  
   if (AllowanceError) {
      console.error("Error fetching allowance:", AllowanceError);
    } else if (allowance === undefined) {
      console.log("Allowance returned undefined.");
    } else {
      console.log("Allowance:", allowance.toString());
      const humanReadableAllowance = ethers.utils.formatUnits(allowance, TOKEN_DECIMAL);
      setAllowanceBalance(humanReadableAllowance);
    }
  }, [AllowanceError, allowance,approvalStatus,isSuccess]);
  
    // Check if approval is needed and set state accordingly
    useEffect(() => {
      if (allowance < TOKEN_PRICE) {
        setIsApprovalNeeded(true);
      } else {
        setIsApprovalNeeded(false);
      }
    }, [allowance, approvalStatus, isSuccess]);

  // Validate domain and set "allow" state
  useEffect(() => {
    if (isValidDomainName(domain)) {
      setValid(true);
    }

    if (TOKEN_CONTRACT_ADDRESS != "") {
      setErc20(true);
    }
  }, [domain, isValidDomainName]); // Include dependencies to ensure the effect runs only when these change

  // Conditionally use the hooks and execute the logic
  useEffect(() => {
    if (valid && erc20) {
      
      // You can also get ERC balance if needed
      const fetchBalance = async () => {
        const balance = await getErcBalance(TOKEN_CONTRACT_ADDRESS, address);
        console.log("ERC20 Balance:", balance);
        const roundedBalance = parseFloat(balance).toFixed(3);
        setErcBalance(roundedBalance);
      };
      fetchBalance();
    }
  }, [valid, address, approvalStatus, isSuccess, erc20]); // Execute only when `allow` is true

  useEffect(() => {
    const fetchEthBalance = async () => {
      if (address) {
        // Create a provider using the default Ethereum provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Fetch the balance for the connected wallet
        const rawBalance = await provider.getBalance(address);
        const formattedBalance = ethers.utils.formatEther(rawBalance);

        // Convert to 2 decimal places
        const roundedBalance = parseFloat(formattedBalance).toFixed(3);

        setEthBalance(roundedBalance); // Store the formatted balance with 2 decimal places
      }
    };

    fetchEthBalance(); // Fetch balance when the component mounts or when the address changes
  }, [address,isSuccess]); // Ensure useEffect reruns if the address changes

  useEffect(() => {
    if (erc20) {
      console.log("check balance for erc20");
         //Check if sufficient ETH balance
         if (ercBalance < TOKEN_PRICE) {
          console.log("Insufficient TOKEN balance: " + ercBalance);
          setAllow(false);
        } else {
          setAllow(true);
          console.log("TOKEN balance OK: " + ercBalance);
        }
    } else {
      //Check if sufficient ETH balance
      if (ethBalance < TOKEN_PRICE) {
        console.log("Insufficient ETH balance: " + ethBalance);
        setAllow(false);
      } else {
        setAllow(true);
        console.log("ETH balance OK: " + ethBalance);
      }
    }
  }, [address, ethBalance, erc20, ercBalance, approvalStatus,isSuccess, isApprovalNeeded]); // Execute only when `allow` is true

  return (
    <>
      <Flex
        align="center"
        justify="center"
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="md"
        color={useColorModeValue("gray.700", "whiteAlpha.900")}
        shadow="base"
      >
        <Box
          textAlign="center"
          alignContent={"center"}
          borderRadius="lg"
          p={{ base: 5, lg: 2 }}
          bgSize={"lg"}
          maxH={"80vh"}
        >
          {isNetworkValid ? (
            <Container
              maxW={"3xl"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Breadcrumb
                spacing="8px"
                separator={<ChevronRightIcon color="gray.500" />}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <BreadcrumbLink href="/domain/search">
                    Domain Search
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <BreadcrumbLink href="#">{domain}</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

              <Kbd>{domain}</Kbd>

              <Card
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
                mt="1"
              >
                <Image
                  objectFit="cover"
                  maxW={{ base: "100%", sm: "200px" }}
                  src={DOMAIN_IMAGE_URL}
                  alt={domain}
                />

                <Stack>
                  <CardBody>
                    <Heading size="md">
                      <div>Mint Domain</div>
                    </Heading>

               

                    {valid && allow ? (
                      <>
                        {domainName !== "odude" &&
                          (!isSuccess && !isApprovalNeeded ? (
                            <Button
                              variant="solid"
                              colorScheme="blue"
                              onClick={() => handleMint()}
                            >
                              {isLoading ? "Minting..." : "Mint"}
                            </Button>
                          ) : null)}
                        {domainName === "odude" && !isApprovalNeeded && (
                          <Button
                            variant="solid"
                            colorScheme="yellow"
                            onClick={() => handleMint()}
                          >
                            Configure Domain
                          </Button>
                        )}


{isSuccess && (
                <div>
                  <Alert
                    status="success"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="100px"
                  >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                    Successfully minted your NFT!
                    </AlertTitle>
                
                  </Alert>
                  <Divider/>
                </div>
              )}

                        {isSuccess && (
                          <div>
                            &nbsp;
                            <Button variant="solid" colorScheme="yellow">
                              <Link href={`/domain/manage/${domain}`}>
                                Manage Domain
                              </Link>
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <Tag size="sm" variant="solid" colorScheme="teal">Check balance/network </Tag>
                    )}

                    { isApprovalNeeded && allow && (
                      <>
                     <Button  variant="solid" colorScheme="green" onClick={handleApproval}>Approve {TOKEN_SYMBOL}</Button>
                     <div>
                     <Divider />
                     <Tag size="sm" variant="solid" colorScheme="teal">  {approvalStatus} </Tag>
      </div></>
                    )
}
                  </CardBody>

                  <CardFooter>
                    {erc20 ? (
                      <Grid templateColumns="repeat(3, 1fr)" gap={10}>
                        <GridItem w="100%" h="20" border='1px' borderColor='blue.200'>
                          <Stat>
                            <StatLabel>{TOKEN_SYMBOL}</StatLabel>
                            <StatNumber >{ercBalance}</StatNumber>
                            <StatHelpText>Balance</StatHelpText>
                          </Stat>
                        </GridItem>
                        <GridItem w="100%" h="20" border='1px' borderColor="red.100">
                          <Stat  colorScheme='teal'>
                            <StatLabel>{TOKEN_SYMBOL}</StatLabel>
                            <StatNumber>{TOKEN_PRICE}</StatNumber>
                            <StatHelpText>Required Fee</StatHelpText>
                          </Stat>
                        </GridItem>
                        <GridItem w="100%" h="20" border='1px' borderColor="green.100">
                          <Stat>
                            <StatLabel>{TOKEN_SYMBOL}</StatLabel>
                            <StatNumber>{allowanceBalance}</StatNumber>
                            <StatHelpText>Approved Fee</StatHelpText>
                          </Stat>
                        </GridItem>
                      </Grid>
                    ) : (
                      <>
                        <Grid templateColumns="repeat(2, 1fr)" gap={10}>
                          <GridItem w="100%" h="20" border='1px' borderColor="blue.100">
                            <Stat>
                              <StatLabel>{TOKEN_SYMBOL}</StatLabel>
                              <StatNumber>{ethBalance}</StatNumber>
                              <StatHelpText>Balance</StatHelpText>
                            </Stat>
                          </GridItem>
                          <GridItem w="100%" h="20" border='1px' borderColor="red.100">
                            <Stat>
                              <StatLabel>{TOKEN_SYMBOL}</StatLabel>
                              <StatNumber>{TOKEN_PRICE}</StatNumber>
                              <StatHelpText>Required Fee</StatHelpText>
                            </Stat>
                          </GridItem>
                        </Grid>
                    
                      </>
                    )}
                  </CardFooter>
                </Stack>
              </Card>
            </Container>
          ) : (
            <Notice />
          )}
        </Box>
      </Flex>
    </>
  );
}
