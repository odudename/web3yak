import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
var w3d = require("@odude/odudename");
import Link from "next/link";
import useDomainInfo from "../../../hooks/domainInfo";
import { useURLValidation } from "../../../hooks/validate";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
//import updateDatabase from '../../../Reusables/db';
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
  Kbd,
  ButtonGroup,
  IconButton,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { useAccount } from "wagmi";
import { DOMAIN_DESCRIPTION, DOMAIN_IMAGE_URL, DOMAIN_TLDS } from "../../../configuration/Config";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons"; // Assuming this is how ExternalLinkIcon is imported in your project

export default function Info() {
  const { address } = useAccount();
  const { validateURL } = useURLValidation();
  const router = useRouter();
  const { info } = router.query;
  const { ownerAddress } = useDomainInfo(info);
  const [jsonData, setJsonData] = useState(null); // Initialize jsonData as null
  const [domainAddr, setDomainAddr] = useState(null);
  const [error, setError] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const isDomainMatched = (domain) => {
    // Check if the domain is an exact match or ends with any of the TLDs
    return DOMAIN_TLDS.some(tld => domain === tld || domain.endsWith(`.${tld}`));
  };

  //copy /@username
  const primaryDomain = window.location.origin;
  //console.log(primaryDomain);
  const { onCopy: onCopyPrimaryDomain, value: primaryDomainValue } =
    useClipboard(primaryDomain + "/@" + info);

  const enlarge = async () => {
    onOpen(); // Open the modal to display the response
  };

  useEffect(() => {
    setValue(primaryDomain);
    setIsLoading(true); // Set isLoading to true whenever the effect runs
    const settings = {
      matic_rpc_url: process.env.NEXT_PUBLIC_MATIC,
      eth_rpc_url: process.env.NEXT_PUBLIC_ETH,
      fvm_rpc_url: process.env.NEXT_PUBLIC_FILECOIN,
      wallet_pvt_key: process.env.NEXT_PUBLIC_PVT_KEY
    };

    const resolve = new w3d(settings);

    // console.log(resolve.SmartContractAddress); //Polygon Mainnet contract address
    // console.log(resolve.fvm_SmartContractAddress);  //Filecoin

    if (info) {
      const randomNumber = Math.random();
      const url =
        "https://web3domain.org/endpoint/v2/index.php?domain=" +
        info +
        "&" +
        randomNumber;
      //console.log(url);
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          setJsonData(json); // Store the json response in the component's state
          // console.log(json);
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchData();

      resolve
        .getAddress(info, "ETH")
        .then((address) => {
          setDomainAddr(address);
          setValue(address);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [info, primaryDomain, setValue]);

  // Use another useEffect to set webUrl
  useEffect(() => {
    var web_url = "";
    var web3_url = "";
    if (jsonData!=null) {
      if (jsonData.web3 !== "") {
        // If the '51' property exists in jsonData.records and its value is not empty
        // Set web3_url
        web3_url = jsonData.web3;
      }

      if (jsonData.web2 !== "" && jsonData.web2 != null) {
        // console.log(jsonData);
        if (jsonData.web2 != "https://ipfs.io/ipfs/null") {
          if (jsonData.web2.startsWith("https://")) {
            web_url = jsonData.web2;
          } else {
            web_url = "https://ipfs.io/ipfs/" + jsonData.web2;
          }
        }
      }

      if (web3_url !== "") {
        setWebUrl(web3_url);
        // console.log(web3_url);
      } else if (web_url !== "") {
        setWebUrl(web_url);
        // console.log(web_url);
      }
    }
  }, [jsonData]);

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
        p={{ base: 2, lg: 1 }}
        bgSize={"lg"}
        maxH={"80vh"}
      >
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/domain/search">Search</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">{info}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Container maxW={"3xl"} alignItems={"center"} justifyContent={"center"}>
          <Kbd>{info}</Kbd>
          <Stack
            as={Box}
            textAlign={"center"}
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
                  <>Error: {error}</>
                ) : (
                  <>
                    {domainAddr !== null ? (
                      <Card
                        direction={{ base: "column", sm: "row" }}
                        overflow="hidden"
                        variant="outline"
                        align="center"
                      >
                        <Image
                          ml={2}
                          boxSize="150px"
                          src={
                            jsonData?.img &&
                            jsonData.img.startsWith("ipfs://")
                              ? `https://${jsonData.img.replace(
                                  "ipfs://",
                                  ""
                                )}.ipfs.nftstorage.link/`
                              : jsonData?.img || DOMAIN_IMAGE_URL
                          }
                          alt={jsonData?.img}
                          onClick={() => enlarge()}
                        />

                        <Stack>
                          <CardBody>
                            <Heading size="md">{jsonData?.domain}</Heading>

                            <Modal isOpen={isOpen} onClose={onClose}>
                              <ModalOverlay />
                              <ModalContent>
                                <ModalCloseButton />
                                <ModalBody>
                                  <Image
                                    ml={2}
                                    src={
                                      jsonData?.img &&
                                      jsonData.img.startsWith("ipfs://")
                                        ? `https://${jsonData.img.replace(
                                            "ipfs://",
                                            ""
                                          )}.ipfs.nftstorage.link/`
                                        : jsonData?.img || DOMAIN_IMAGE_URL
                                    }
                                    alt={jsonData?.name}
                                  />
                                </ModalBody>
                              </ModalContent>
                            </Modal>

                            <Text py="2">{jsonData?.description}</Text>
                            <br />

                            <ButtonGroup size="sm" isAttached variant="outline">
                              <Button onClick={onCopy}>{domainAddr}</Button>
                              <IconButton
                                aria-label="Copy"
                                icon={<FaCopy />}
                                onClick={onCopy}
                              />
                            </ButtonGroup>
                            <br />
                            {validateURL(webUrl) && webUrl != "" && (
                              <ButtonGroup
                                size="sm"
                                isAttached
                                variant="outline"
                              >
                                <Button onClick={onCopyPrimaryDomain}>
                                  {primaryDomain}/@{info}
                                </Button>
                                <IconButton
                                  aria-label="Copy"
                                  icon={<FaCopy />}
                                  onClick={onCopyPrimaryDomain}
                                />
                              </ButtonGroup>
                            )}
                          </CardBody>

                          <CardFooter>
                            {address == ownerAddress && isDomainMatched(info) ? (
                              <Stack direction="row" spacing="1">
                                <Button
                                  size="sm"
                                  variant="solid"
                                  colorScheme="blue"
                                >
                                  <Link href={`/domain/reverse/${info}`}>
                                    Address
                                  </Link>
                                </Button>

                                <Button
                                  size="sm"
                                  variant="solid"
                                  colorScheme="yellow"
                                >
                                  <Link href={`/domain/manage/${info}`}>
                                    Record
                                  </Link>
                                </Button>

                                <Button
                                  size="sm"
                                  variant="solid"
                                  colorScheme="pink"
                                >
                                  <Link href={`/domain/transfer/${info}`}>
                                    Transfer
                                  </Link>
                                </Button>
                                <br />
                                <Button
                                  size="sm"
                                  variant="solid"
                                  colorScheme="teal"
                                >
                                  <Link href={`/domain/host/${info}`}>
                                    Host
                                  </Link>
                                </Button>

                                <Button
                                  size="sm"
                                  variant="solid"
                                  colorScheme="red"
                                >
                                  <Link href={`/domain/image/${info}`}>
                                    Image
                                  </Link>
                                </Button>
                              </Stack>
                            ) : (
                              <></>
                            )}

                            {validateURL(webUrl) && webUrl != "" && (
                              <Link href={`${webUrl}`} passHref>
                                <a target="_blank" rel="noopener noreferrer">
                                  <Button
                                    size="sm"
                                    variant="solid"
                                    colorScheme="green"
                                    rightIcon={<FaExternalLinkAlt />}
                                    ml="1"
                                  >
                                    Visit
                                  </Button>
                                </a>
                              </Link>
                            )}
                          </CardFooter>
                        </Stack>
                      </Card>
                    ) : (
                      <Card align="center">
                        <CardHeader>
                          <Heading size="md">Register {info}</Heading>
                        </CardHeader>
                        <CardBody>
                          <Text>{DOMAIN_DESCRIPTION}</Text>
                        </CardBody>
                        <CardFooter>
                          <div>
                            <Button size="sm" colorScheme="teal">
                              {" "}
                              <Link href={`/domain/mint/${info}`}>Start</Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </Flex>
  );
}
