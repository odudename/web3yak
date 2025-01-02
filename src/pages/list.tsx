/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import localforage from "localforage";
import {
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  Spinner,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useNetworkValidation } from "../hooks/useNetworkValidation";
import { useLoadConfig } from "../hooks/useLoadConfig";
import Notice from "../components/domain/notice";
type DomainTuple = [string, string];

export default function DomainList() {
  const { config, configLoading } = useLoadConfig(); // Load configuration
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [domainAddr, setDomainAddr] = useState<DomainTuple[]>([]);
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);
  const { isValid, contractAddress } = useNetworkValidation(); // Get the contract address and validation status


  const setMembershipStatus = (key: string, status: string) => {
    localforage.setItem(key, status);
  };

  // Moved w3d import inside useEffect to ensure config is loaded first
  useEffect(() => {
    // Ensure that config and the network are valid before proceeding
    if (config && isValid && address && chain) {
      setIsLoading(true);
  
      const settings = {
        matic_rpc_url: process.env.NEXT_PUBLIC_MATIC,
        eth_rpc_url: process.env.NEXT_PUBLIC_ETH,
        fvm_rpc_url: process.env.NEXT_PUBLIC_FILECOIN,
        wallet_pvt_key: process.env.NEXT_PUBLIC_PVT_KEY,
      };
  
      // Dynamically load w3d once the config is available
      const w3d = require("@odude/oduderesolve");
      const resolve = new w3d(settings);
  
      let provider = "";
      if (chain?.network === "filecoin-mainnet") {
        provider = "fvm";
      }
  
      // Fetch the domain list if the user has an address
      resolve
        .getDomainList(address, provider)
        .then((data: DomainTuple[]) => {
          const filteredDomainAddr = data.filter((item) => {
            const domain = item[1]; // Original domain string
            const tlds = config.DOMAIN_TLDS; // List of TLDs from config
  
            // Check for valid exact match or email-like domain
            return (
              tlds.includes(domain) || // Exact match
              tlds.some((tld: string) => domain.endsWith(`@${tld}`)) // Email-like match
            );
          });
          setDomainAddr(filteredDomainAddr);
        })
        .catch((err: any) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [config, isValid, address, chain]);
  
  
  

  useEffect(() => {
    if (domainAddr.length !== 0 && address) {
      const addr = address?.toString();
      setMembershipStatus(addr, "GOLD");
      console.log("Value is set " + addr);
    }
  }, [domainAddr, address]);

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

  return (
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
      >
        <Container
          maxW="container.sm"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Stack
            as={Box}
            textAlign={"center"}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 10, md: 1 }}
          >
            {isValid ? (
              <div>
                <NextSeo title="My Name List" />
                <Heading as="h3" fontSize="xl" my={4}>
                  My Name List
                </Heading>

                {isLoading ? (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                ) : (
                  <>
                    {error ? (
                      <>Error: {error}</>
                    ) : domainAddr.length === 0 ? (
                      <>No Record Found</>
                    ) : (
                      <SimpleGrid
                        columns={{ sm: 2, md: 4 }}
                        spacing="8"
                        p="1"
                        textAlign="center"
                        rounded="lg"
                      >
                        {domainAddr.map((item, index) => (
                          <Box
                            _hover={{ boxShadow: "lg" }}
                            boxShadow="dark-lg"
                            p="3"
                            rounded="md"
                            key={index}
                          >
                            <Link href={`/domain/info/${item[1]}`}>
                              {item[1]}
                            </Link>
                          </Box>
                        ))}
                      </SimpleGrid>
                    )}
                  </>
                )}
              </div>
            ) : (
              <Notice />
            )}
          </Stack>
        </Container>
      </Box>
    </Flex>
  );
}
