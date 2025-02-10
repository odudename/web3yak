// src/pages/domain/mint/[mint].js

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { useLoadConfig } from "../../../hooks/useLoadConfig";
import { generateJson } from "../../../hooks/ipfs";
import { useDomainValidation } from "../../../hooks/validate";
import useGlobal from "../../../hooks/global";
import {useDomainInfo} from "../../../hooks/domainInfo";
import { useNetworkValidation } from "../../../hooks/useNetworkValidation";
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
} from "@chakra-ui/react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";
import { ExternalLinkIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";

export default function Info() {
  const { config, configLoading } = useLoadConfig(); // Load configuration
  const { isValid, contractAddress } = useNetworkValidation(); // Get the contract address and validation status

  const { isValidDomain, validateDomain } = useDomainValidation();

  const uniqueId = Math.round(Date.now() * Math.random()).toString();
  const { address, connector, isConnected } = useAccount();
  const [ethBalance, setEthBalance] = useState("0.00"); // State to store the ETH balance

  const router = useRouter();
  const { mint } = router.query;
  const domain = mint ? String(mint).toLowerCase() : "";
  const { isValidDomainName, showToast, getErcBalance } = useGlobal();
  const [domainName, setDomainName] = useState("odude");
  const [claimId, setClaimId] = useState(uniqueId); // Using claimId state instead of claim_id variable
  const [claimTransferTo, setClaimTransferTo] = useState(
    "0x8D714B10B719c65B878F2Ed1436A964E11fA3271"
  );

  const [claimUrl, setClaimUrl] = useState('');
  const [erc20, setErc20] = useState(false); // Only for ERC20 token
  const [allow, setAllow] = useState(false); // Allow for minting
  const [valid, setValid] = useState(false); // Check for domain validation
  const [ercBalance, setErcBalance] = useState("0.00"); // ERC Balance
  const [allowanceBalance, setAllowanceBalance] = useState("0.00"); // ERC Balance
  const [isApprovalNeeded, setIsApprovalNeeded] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(''); // Can be 'pending', 'approved', 'failed'

  const toast = useToast();

  // State for overrides
  const [overrides, setOverrides] = useState('');

  // Update claimUrl and overrides when config, domain, or erc20 changes
  useEffect(() => {
    if (config) {
      setClaimUrl(`https://web3domain.org/endpoint/temp_json.php?domain=${domain}&image=${config.DOMAIN_IMAGE_URL}`);
      setOverrides(erc20 ? {} : { value: ethers.utils.parseEther(config.TOKEN_PRICE || "0") });
    }
  }, [config, domain, erc20]);

  // Prepare contract write for 'claim' function
  const {
    config: claimConfig,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contractAddress || undefined,
    abi: abiFile.abi,
    functionName: "claim",
    args: [claimId, domainName, claimUrl, claimTransferTo],
    overrides,
    enabled: isValid && !configLoading && !!contractAddress && !!claimId && !!domainName && !!claimUrl && !!claimTransferTo,
  });

  const { data: claimData, error: claimError, isError: isClaimError, write: claimWrite } = useContractWrite(claimConfig);

  const { isLoading: isClaimLoading, isSuccess: isClaimSuccess } = useWaitForTransaction({
    hash: claimData?.hash,
  });

  // Read allowance for ERC20 token
  const { data: allowance, isError: AllowanceError } = useContractRead({
    address: config?.TOKEN_CONTRACT_ADDRESS || undefined,
    abi: ercabi.abi,
    functionName: "allowance",
    args: [address || "0x0000000000000000000000000000000000000000", contractAddress || "0x0000000000000000000000000000000000000000"],
    enabled: isValid && !configLoading && !!config?.TOKEN_CONTRACT_ADDRESS && !!address && !!contractAddress,
  });

  // Prepare contract write for 'approve' function
  const {
    config_c: approveConfig,
  } = usePrepareContractWrite({
    address: config?.TOKEN_CONTRACT_ADDRESS || undefined,
    abi: ercabi.abi,
    functionName: "approve",
    args: [contractAddress || "0x0000000000000000000000000000000000000000", ethers.utils.parseUnits(config?.TOKEN_PRICE || "0", config?.TOKEN_DECIMAL || 18)],
    enabled: isApprovalNeeded && isValid && !configLoading && !!config?.TOKEN_CONTRACT_ADDRESS,
  });

  const {
    write: approveWrite,
    data: approvalData, // Rename to avoid conflict
    isLoading: isApprovalLoading, // Custom name for loading status
    isError: isApprovalError, // Custom name for error status
    error: approvalError, // Custom error name
  } = useContractWrite(approveConfig);

  const handleApproval = () => {
    if (isApprovalNeeded && approveWrite) {
      console.log('Approval required');
      approveWrite(); // Perform the token approval
      setApprovalStatus('pending'); // Mark as pending after initiating the approval
    } else {
      console.log("Approval not required");
    }
  };

  // Handle errors from 'claim' function
  useEffect(() => {
    if (isClaimError && claimError) {
      console.error("Claim Error:", claimError.message);
      showAlert("Minting failed: " + claimError.message);
    } else if (!isClaimError) {
      console.log('No error in claim');
    }
  }, [isClaimError, claimError]);

  // Handle mint success
  useEffect(() => {
    if (isClaimSuccess) {
      showAlert("Successfully minted your domain!");
    }
  }, [isClaimSuccess]);

  // Show alerts using toast
  function showAlert(err) {
    toast({
      title: "Notice",
      description: err,
      status: "warning",
      duration: 4000,
      isClosable: true,
    });
  }

  // Handle approval status updates
  useEffect(() => {
    if (approvalData?.hash) {
      console.log(`Transaction hash: ${approvalData.hash}`);
      setApprovalStatus('approved'); // Approval successful
    }

    if (isApprovalError && approvalError) {
      console.error('Approval error:', approvalError.message);
      setApprovalStatus('failed'); // Approval failed
      showAlert("Approval failed: " + approvalError.message);
    }

    if (isApprovalLoading) {
      setApprovalStatus('pending'); // Transaction still pending
    }

  }, [approvalData, isApprovalError, approvalError, isApprovalLoading]);

  // Update allowance balance when allowance data changes
  useEffect(() => {
    if (AllowanceError) {
      console.error("Error fetching allowance:", AllowanceError);
    } else if (allowance === undefined) {
      console.log("Allowance returned undefined.");
    } else {
      console.log("Allowance:", allowance.toString());
      const humanReadableAllowance = ethers.utils.formatUnits(allowance, config?.TOKEN_DECIMAL || 18);
      setAllowanceBalance(humanReadableAllowance);
    }
  }, [AllowanceError, allowance, approvalStatus, isClaimSuccess, config]);

  // Determine if approval is needed based on allowance
  useEffect(() => {
    if (allowance !== undefined && config?.TOKEN_PRICE !== undefined && config?.TOKEN_DECIMAL !== undefined) {
      const requiredAmount = ethers.utils.parseUnits(config.TOKEN_PRICE, config.TOKEN_DECIMAL);
      const userAllowance = ethers.BigNumber.from(allowance);
      if (userAllowance.lt(requiredAmount)) {
        setIsApprovalNeeded(true);
      } else {
        setIsApprovalNeeded(false);
      }
    }
  }, [allowance, approvalStatus, isClaimSuccess, config]);

  // Validate domain and set ERC20 usage
  useEffect(() => {
    if(domain && config) {
      if (isValidDomainName(domain)) {
        setValid(true);
      }

      if (config.TOKEN_CONTRACT_ADDRESS) {
        setErc20(true);
      }
    }
  }, [domain, config, isValidDomainName]);

  // Fetch ERC20 balance if needed
  useEffect(() => {
    if (valid && erc20 && config?.TOKEN_CONTRACT_ADDRESS && address) {
      const fetchBalance = async () => {
        try {
          const balance = await getErcBalance(config.TOKEN_CONTRACT_ADDRESS, address);
          console.log("ERC20 Balance:", balance);
          const roundedBalance = parseFloat(balance).toFixed(3);
          setErcBalance(roundedBalance);
        } catch (error) {
          console.error("Error fetching ERC20 balance:", error);
        }
      };
      fetchBalance();
    }
  }, [valid, address, approvalStatus, isClaimSuccess, erc20, config, getErcBalance]);

  // Fetch ETH balance
  useEffect(() => {
    const fetchEthBalance = async () => {
      if (address && typeof window !== "undefined" && (window).ethereum) { // Ensure window.ethereum is available
        try {
          const provider = new ethers.providers.Web3Provider((window).ethereum);
          const rawBalance = await provider.getBalance(address);
          const formattedBalance = ethers.utils.formatEther(rawBalance);
          const roundedBalance = parseFloat(formattedBalance).toFixed(3);
          setEthBalance(roundedBalance);
        } catch (error) {
          console.error("Error fetching ETH balance:", error);
        }
      }
    };

    fetchEthBalance(); // Fetch balance when the component mounts or when the address changes
  }, [address, isClaimSuccess]);

  // Check if sufficient balance is available
  useEffect(() => {
    if (erc20) {
      console.log("Check balance for ERC20");
      if (parseFloat(ercBalance) < parseFloat(config?.TOKEN_PRICE || "0")) {
        console.log("Insufficient TOKEN balance: " + ercBalance);
        setAllow(false);
      } else {
        setAllow(true);
        console.log("TOKEN balance OK: " + ercBalance);
      }
    } else {
      console.log("Check balance for ETH");
      if (parseFloat(ethBalance) < parseFloat(config?.TOKEN_PRICE || "0")) {
        console.log("Insufficient ETH balance: " + ethBalance);
        setAllow(false);
      } else {
        setAllow(true);
        console.log("ETH balance OK: " + ethBalance);
      }
    }
  }, [address, ethBalance, erc20, ercBalance, approvalStatus, isClaimSuccess, isApprovalNeeded, config]);

  // Handle minting
  const handleMint = async () => {
    setDomainName(domain);
    setClaimId(uniqueId); // Update claimId state
    setClaimTransferTo(address || "0x0000000000000000000000000000000000000000"); // Update claimTransferTo state
    setClaimUrl(`https://web3domain.org/endpoint/temp_json.php?domain=${domain}&image=${config?.DOMAIN_IMAGE_URL || ""}`);

    if (!isPrepareError && claimWrite) {
      console.log(`To: ${address} \n URL: ${claimUrl}`);
      claimWrite();
    } else {
      showAlert("Preparation for minting failed.");
    }
  };

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
          {isValid ? (
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
                  src={config?.DOMAIN_IMAGE_URL}
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
                          (!isClaimSuccess && !isApprovalNeeded ? (
                            <Button
                              variant="solid"
                              colorScheme="blue"
                              onClick={handleMint}
                              isLoading={isClaimLoading}
                            >
                              Mint
                            </Button>
                          ) : null)}
                        {domainName === "odude" && !isApprovalNeeded && (
                          <Button
                            variant="solid"
                            colorScheme="yellow"
                            onClick={handleMint}
                          >
                            Configure Domain
                          </Button>
                        )}

                        {isClaimSuccess && (
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
                            <Divider />
                          </div>
                        )}

                        {isClaimSuccess && (
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
                      <Tag size="sm" variant="solid" colorScheme="teal">
                        Check balance/network
                      </Tag>
                    )}

                    {isApprovalNeeded && allow && (
                      <>
                        <Button variant="solid" colorScheme="green" onClick={handleApproval} isLoading={isApprovalLoading}>
                          Approve {config?.TOKEN_SYMBOL || "Token"}
                        </Button>
                        <div>
                          <Divider />
                          <Tag size="sm" variant="solid" colorScheme="teal">
                            {approvalStatus}
                          </Tag>
                        </div>
                      </>
                    )}
                  </CardBody>

                  <CardFooter>
                    {erc20 ? (
                      <Grid templateColumns="repeat(3, 1fr)" gap={10}>
                        <GridItem w="100%" h="20" border="1px" borderColor="blue.200">
                          <Stat>
                            <StatLabel>{config?.TOKEN_SYMBOL}</StatLabel>
                            <StatNumber>{ercBalance}</StatNumber>
                            <StatHelpText>Balance</StatHelpText>
                          </Stat>
                        </GridItem>
                        <GridItem w="100%" h="20" border="1px" borderColor="red.100">
                          <Stat colorScheme="teal">
                            <StatLabel>{config?.TOKEN_SYMBOL}</StatLabel>
                            <StatNumber>{config?.TOKEN_PRICE}</StatNumber>
                            <StatHelpText>Required Fee</StatHelpText>
                          </Stat>
                        </GridItem>
                        <GridItem w="100%" h="20" border="1px" borderColor="green.100">
                          <Stat>
                            <StatLabel>{config?.TOKEN_SYMBOL}</StatLabel>
                            <StatNumber>{allowanceBalance}</StatNumber>
                            <StatHelpText>Approved Fee</StatHelpText>
                          </Stat>
                        </GridItem>
                      </Grid>
                    ) : (
                      <>
                        <Grid templateColumns="repeat(2, 1fr)" gap={10}>
                          <GridItem w="100%" h="20" border="1px" borderColor="blue.100">
                            <Stat>
                              <StatLabel>ETH</StatLabel>
                              <StatNumber>{ethBalance}</StatNumber>
                              <StatHelpText>Balance</StatHelpText>
                            </Stat>
                          </GridItem>
                          <GridItem w="100%" h="20" border="1px" borderColor="red.100">
                            <Stat>
                              <StatLabel>ETH</StatLabel>
                              <StatNumber>{config?.TOKEN_PRICE}</StatNumber>
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
