/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import localforage from 'localforage';
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
var w3d = require("@odude/oduderesolve");
import { DOMAIN_TLDS } from "../configuration/Config";
import Notice from "../components/domain/notice";

type DomainTuple = [string, string];

export default function DomainList() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [domainAddr, setDomainAddr] = useState<DomainTuple[]>([]);
  const [error, setError] = useState(""); // Specify the type for error state
  const [isLoading, setIsLoading] = useState(true);
  const domainTlds = DOMAIN_TLDS.map(tld => "." + tld); // Array of TLDs with dot
  const isNetworkValid = useNetworkValidation();

  const setMembershipStatus = (key: string, status: string) => {
    localforage.setItem(key, status);
  };


  const fetchDataIfNetworkValid = () => {
    if (isNetworkValid) {
      setIsLoading(true);

      const settings = {
        matic_rpc_url: process.env.NEXT_PUBLIC_MATIC,
        eth_rpc_url: process.env.NEXT_PUBLIC_ETH,
        fvm_rpc_url: process.env.NEXT_PUBLIC_FILECOIN,
        wallet_pvt_key: process.env.NEXT_PUBLIC_PVT_KEY
      };
      const resolve = new w3d(settings);
      

      let provider = "";
      if (chain) {
        if (chain?.network === "filecoin-mainnet") {
          provider = "fvm";
          // console.log(provider);
        }
      }

      if (address) {
        resolve
          .getDomainList(address, provider)
          .then((data: DomainTuple[]) => {
            // Filter records that end with the specified domain_tld
            const filteredDomainAddr = data.filter((item) =>
              domainTlds.some(tld => item[1].endsWith(tld)) ||
            DOMAIN_TLDS.includes(item[1])
            );
            setDomainAddr(filteredDomainAddr);
          })
          .catch((err: Error) => {
            setError(err.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };

  useEffect(() => {
    fetchDataIfNetworkValid();
  }, [address, chain]);

  useEffect(() => {
    if (domainAddr.length != 0  && address) {
      // Set membership status
     // Use the function to set membership status
     let addr = address?.toString();
     setMembershipStatus(addr, "GOLD");
     console.log("Value is set "+addr);
    };
  }, [domainAddr, address]);



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
            {isNetworkValid ? (
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
                    ) : domainAddr.length === 0 ? ( // Check if the domainAddr array is empty
                      <>No Record Found</> // Display the message when the array is empty
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
