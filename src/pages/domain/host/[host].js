import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {useDomainInfo} from "../../../hooks/domainInfo";
import { useURLValidation } from "../../../hooks/validate";
import { useNetworkValidation } from "../../../hooks/useNetworkValidation";
import { useJsonValue, getParent } from "../../../hooks/jsonData";
import { generateJson, generatePreview } from "../../../hooks/ipfs";
import TokenURI from "../../../components/TokenURI";
import HomeButton from "../../../components/HomeButton"; // Home Button
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import {
  Box,
  Button,
  Container,
  Flex,
  SkeletonText,
  CardHeader,
  Heading,
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
  useBoolean,
  InputGroup,
  Input,
  InputRightElement,
  FormControl,
  FormLabel,
  Switch,
  FormHelperText,
  form,
  Stack,
  CircularProgress,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FaExternalLinkAlt, FaForward, FaLink } from "react-icons/fa";
import { useAccount } from "wagmi";
import { useLoadConfig } from "../../../hooks/useLoadConfig";
export default function Info() {
  const { config, configLoading } = useLoadConfig(); // Load configuration
  const { address } = useAccount();
  const { validateURL } = useURLValidation();
  const { isValid } = useNetworkValidation(); // Get the contract address and validation status
  const router = useRouter();
  const { host } = router.query;
  const domain = host ? String(host).toLowerCase() : "";
  const { ownerAddress } = useDomainInfo(domain);
  const [jsonData, setJsonData] = useState(null); // Initialize jsonData as null
  const { getValue } = useJsonValue(jsonData);
  const [error, setError] = useState("");
  const [claimUrl, setClaimUrl] = useState("http://web3yak.com");
  const [isLoading, setIsLoading] = useState(true);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [flag, setFlag] = useBoolean();
  const [newUrl, setNewUrl] = useState("");
  const [web2Url, setWeb2Url] = useState("");
  const [web3Url, setWeb3Url] = useState("");
  const [visitUrl, setVisitUrl] = useState("");
  const [jsonDataNew, setJsonDataNew] = useState(null); // Initialize jsonDataNew as null
  const [linkLabel1, setLinkLabel1] = useState("");
  const [linkLabel2, setLinkLabel2] = useState("");
  const [linkLabel3, setLinkLabel3] = useState("");
  const [link1, setLink1] = useState("");
  const [link2, setLink2] = useState("");
  const [link3, setLink3] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState("No preview available");
  const textColor = useColorModeValue("gray.800", "white");
  const bg=useColorModeValue("white", "gray.700");

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const isDomainMatched = (domain) => {
    // Check if the domain is an exact match or ends with any of the TLDs
    return config.DOMAIN_TLDS.some(tld => domain === tld || domain.endsWith(`@${tld}`));
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    console.log("Saving record..");

    //console.log(jsonData);

    // Update the jsonDataNew object with the new web3_url value
    const updatedJsonData = {
      ...jsonData,
      records: {
        ...jsonData.records,
        7: {
          type: "link",
          value: {
            [linkLabel1]: link1,
            [linkLabel2]: link2,
            [linkLabel3]: link3,
          },
        },
        20: {
          type: "img",
          value: {
            img1: img1,
            img2: img2,
            img3: img3,
          },
        },
        51: { type: "web3_url", value: newUrl },
      },
    };

    setJsonDataNew(updatedJsonData); // Update the state with the modified jsonData

    //console.log(updatedJsonData);
    setIsLoading(false);
  };

  const handleUpload = async () => {
    console.log("Verify record of  " + domain);
    setIsLoading(true);
    if (domain !== "undefined") {
      //console.log(jsonData);

      await getLayout();
    }
  };

  const preview = async () => {
    console.log("preview record of  " + domain);
    const response = await generatePreview(jsonDataNew, domain, "false");
    // setIsLoading(true);

    if (domain !== "undefined" && response) {
      //console.log(jsonDataNew);
      const responseText = await response.text();
      //console.log(responseText);
      setHtmlPreview(responseText);
      onOpen(); // Open the modal to display the response
    }
  };

  const getLayout = async () => {
    console.log("cid of layout  " + domain);
    const response = await generatePreview(jsonDataNew, domain, "true");
    if (response.ok) {
      const responseText = await response.text();
      try {
        const responseObject = JSON.parse(responseText);
        console.log(responseObject);
        const cidValue = responseObject.cid;
        const cidUrl = responseObject.link;
        setWeb2Url(cidUrl);

        const updatedJsonData = {
          ...jsonDataNew,
          records: {
            ...jsonDataNew.records,

            50: { type: "web_url", value: cidUrl },
          },
        };
        console.log(web2Url);
        //console.log(updatedJsonData);
        setJsonDataNew(updatedJsonData);

        await genJson(updatedJsonData);
      } catch (error) {
        console.log("Error parsing JSON of layout:", error);
      }
    }
  };
  async function genJson(updatedJsonData) {
    //handleSubmit(null);
    console.log(updatedJsonData);
    const response = await generateJson(updatedJsonData, domain);
    if (response.ok) {
      const responseText = await response.text();

      try {
        const responseObject = JSON.parse(responseText);
        const cidValue = responseObject.link;
      //  console.log("https://ipfs.io/ipfs/" + cidValue);
      //  setClaimUrl("https://ipfs.io/ipfs/" + cidValue);
        console.log(cidValue);
        setClaimUrl(cidValue);
        setIsLoading(false);
      } catch (error) {
        console.log("Error parsing JSON:", error);
      }
    } else {
      console.log("Error generating JSON.");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsMainLoading(true); // Set isLoading to true whenever the effect runs

    if (domain, config) {
      const randomNumber = Math.random();
      const url =
        "https://web3yak.com/endpoint/v3/opensea.php?name=" +
        domain +
        "&" +
        randomNumber;
      console.log(url);
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          setJsonData(json); // Store the json response in the component's state
          setIsMainLoading(false);
          console.log(json);
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchData();
    }
  }, [domain, config]);

  useEffect(() => {
    if (flag) {
    //  console.log("flag on");
    } else {
    //  console.log("flag close");
      setNewUrl("");
    }
  }, [flag]);

  // Use another useEffect to set webUrl
  useEffect(() => {
    // console.log(jsonData);
    if (jsonData) {
      var web2_url = getValue("web_url");
      //console.log(web2_url);
      var web3_url = getValue("web3_url");
      //console.log(web3_url);
      setWeb2Url(web2_url);
      setWeb3Url(web3_url);

      const parentNumber = getParent(jsonData, "link");
      //console.log("Parent Number of 'link' type record:", parentNumber);

      const linkData =
        jsonData.records &&
        jsonData.records[parentNumber] &&
        jsonData.records[parentNumber].value;

      if (linkData) {
        let i = 1; // Initialize the index variable

        // Loop through the keys and values in the "value" object
        for (const key in linkData) {
          if (key !== "") {
            // Skip empty keys
            if (i === 1) {
              setLinkLabel1(key);
              setLink1(linkData[key]);
            } else if (i === 2) {
              setLinkLabel2(key);
              setLink2(linkData[key]);
            } else if (i === 3) {
              setLinkLabel3(key);
              setLink3(linkData[key]);
            }

            i++; // Increment the index variable
          }
        }
      }

      const imgParentNumber = getParent(jsonData, "img");
      //console.log("Parent Number of 'link' type record:", parentNumber);

      const imgLinkData =
        jsonData.records &&
        jsonData.records[imgParentNumber] &&
        jsonData.records[imgParentNumber].value;
      if (imgLinkData) {
        setImg1(imgLinkData.img1);
        setImg2(imgLinkData.img2);
        setImg3(imgLinkData.img3);
      }
    }
  }, [jsonData,getValue]);

  useEffect(() => {
    // Call genJson whenever jsonDataNew changes
    console.log(jsonDataNew);
  }, [jsonDataNew]);

  useEffect(() => {
    const isValid = validateURL(web3Url);

    if (isValid) {
      console.log("Valid URL " + web3Url);
      setVisitUrl(web3Url);
    } else {
      if (validateURL(web2Url)) {
        setVisitUrl(web2Url);
      }
    }
    //console.log(visitUrl);
  }, [visitUrl, web3Url, web2Url, validateURL]);

  if (!config) {
    return <div>Error loading configuration.</div>;
  }

  return (
    <Flex
      align="center"
      justify="center"
      bg={bg}
      borderRadius="md"
      color={textColor}
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
        <Container maxW={"3xl"} alignItems={"center"} justifyContent={"center"}>
  
<HomeButton domain={domain} />

          <Box
            textAlign="center"
            alignContent={"center"}
            borderRadius="lg"
            p={{ base: 5, lg: 2 }}
            bgSize={"lg"}
            maxH={"80vh"}
          >
            {isValid && isDomainMatched(domain) ? (
              <Stack
                as={Box}
                textAlign={"center"}
                spacing={{ base: 2, md: 2 }}
                py={{ base: 10, md: 6 }}
              >
                {isMainLoading ? (
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
                        {address == ownerAddress ? (
                          <form onSubmit={handleSubmit}>
                            <Tabs isFitted variant="enclosed">
                              <TabList mb="1em">
                                <Tab>General</Tab>
                                <Tab>Image</Tab>
                                <Tab>Link</Tab>
                              </TabList>
                              <TabPanels>
                                <TabPanel>
                                  <Stack spacing={2}>
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
                                          jsonData?.image &&
                                          jsonData.image.startsWith("ipfs://")
                                            ? jsonData.image.replace(
                                                "ipfs://",
                                                "https://ipfs.io/ipfs/"
                                              )
                                            : jsonData?.image || config.DOMAIN_IMAGE_URL
                                        }
                                        alt={jsonData?.name}
                                      />

                                      <Stack>
                                        <CardBody>
                                          <Text mb="4px">Redirect to:</Text>
                                          <InputGroup>
                                            <Input
                                              value={visitUrl}
                                              placeholder="No website defined!"
                                              size="sm"
                                              disabled={true}
                                            />
                                            {web3Url != null && (
                                              <InputRightElement width="1rem">
                                                <Link
                                                  href={`${visitUrl}`}
                                                  passHref
                                                >
                                                  <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    <FaExternalLinkAlt mx="2px" />
                                                  </a>
                                                </Link>
                                              </InputRightElement>
                                            )}
                                          </InputGroup>
                                          <br />

                                          <FormControl
                                            display="flex"
                                            alignItems="center"
                                          >
                                            <FormLabel
                                              htmlFor="change-url"
                                              mb="0"
                                            >
                                              Turn on Redirects to own link
                                            </FormLabel>
                                            <Switch
                                              id="change-url"
                                              onChange={() => {
                                                setFlag.toggle();
                                                //handleFlagChange();
                                              }}
                                              isChecked={flag}
                                            />
                                          </FormControl>

                                          {flag && (
                                            <FormControl mt={2}>
                                              <FormLabel>
                                                Your New Website URL
                                              </FormLabel>
                                              <Input
                                                type="url"
                                                placeholder="http://"
                                                size="md"
                                                value={newUrl}
                                                onChange={(event) =>
                                                  setNewUrl(
                                                    event.currentTarget.value
                                                  )
                                                }
                                              />
                                              <FormHelperText>
                                                IPFS & http URL both are
                                                supported.
                                              </FormHelperText>
                                            </FormControl>
                                          )}
                                        </CardBody>
                                      </Stack>
                                    </Card>
                                  </Stack>
                                </TabPanel>
                                <TabPanel>
                                  <Stack spacing={2}>
                                    <FormControl>
                                      <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                          <FaLink color="gray.300" />
                                        </InputLeftElement>
                                        <Input
                                          type="url"
                                          placeholder="Image Link 1"
                                          value={img1}
                                          size="sm"
                                          onChange={(event) =>
                                            setImg1(event.currentTarget.value)
                                          }
                                          isDisabled={flag}
                                        />
                                      </InputGroup>
                                    </FormControl>

                                    <FormControl>
                                      <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                          <FaLink color="gray.300" />
                                        </InputLeftElement>
                                        <Input
                                          type="url"
                                          placeholder="Image Link 2"
                                          size="sm"
                                          value={img2}
                                          onChange={(event) =>
                                            setImg2(event.currentTarget.value)
                                          }
                                          isDisabled={true}
                                        />
                                      </InputGroup>
                                    </FormControl>

                                    <FormControl>
                                      <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                          <FaLink color="gray.300" />
                                        </InputLeftElement>
                                        <Input
                                          type="url"
                                          placeholder="Image Link 3"
                                          value={img3}
                                          size="sm"
                                          onChange={(event) =>
                                            setImg3(event.currentTarget.value)
                                          }
                                          isDisabled={true}
                                        />
                                      </InputGroup>
                                    </FormControl>
                                  </Stack>
                                </TabPanel>
                                <TabPanel>
                                  <Stack spacing={2}>
                                    <FormControl>
                                      <Text mb="8px">Link No.1</Text>
                                      <InputGroup>
                                        <Input
                                          type="text"
                                          placeholder="Label-1"
                                          value={linkLabel1}
                                          size="sm"
                                          onChange={(event) =>
                                            setLinkLabel1(
                                              event.currentTarget.value
                                            )
                                          }
                                          isDisabled={flag}
                                        />
                                        <InputRightElement pointerEvents="none">
                                          <FaLink color="gray.300" />
                                        </InputRightElement>
                                        <Input
                                          ml="1"
                                          type="url"
                                          placeholder="Label-1 Link"
                                          value={link1}
                                          size="sm"
                                          onChange={(event) =>
                                            setLink1(event.currentTarget.value)
                                          }
                                          isDisabled={flag}
                                        />
                                      </InputGroup>
                                    </FormControl>
                                    <FormControl>
                                      <Text mb="8px">Link No.2</Text>
                                      <InputGroup>
                                        <Input
                                          type="text"
                                          placeholder="Label-2"
                                          value={linkLabel2}
                                          size="sm"
                                          onChange={(event) =>
                                            setLinkLabel2(
                                              event.currentTarget.value
                                            )
                                          }
                                          isDisabled={flag}
                                        />
                                        <InputRightElement pointerEvents="none">
                                          <FaLink color="gray.300" />
                                        </InputRightElement>
                                        <Input
                                          ml="1"
                                          type="url"
                                          placeholder="Label-2 Link"
                                          value={link2}
                                          size="sm"
                                          onChange={(event) =>
                                            setLink2(event.currentTarget.value)
                                          }
                                          isDisabled={flag}
                                        />
                                      </InputGroup>
                                    </FormControl>

                                    <FormControl>
                                      <Text mb="8px">Link No.3</Text>
                                      <InputGroup>
                                        <Input
                                          type="text"
                                          placeholder="Label-3"
                                          value={linkLabel3}
                                          size="sm"
                                          onChange={(event) =>
                                            setLinkLabel3(
                                              event.currentTarget.value
                                            )
                                          }
                                          isDisabled={flag}
                                        />
                                        <InputRightElement pointerEvents="none">
                                          <FaLink color="gray.300" />
                                        </InputRightElement>
                                        <Input
                                          ml="1"
                                          type="url"
                                          placeholder="Label-3 Link"
                                          value={link3}
                                          size="sm"
                                          onChange={(event) =>
                                            setLink3(event.currentTarget.value)
                                          }
                                          isDisabled={flag}
                                        />
                                      </InputGroup>
                                    </FormControl>
                                  </Stack>
                                </TabPanel>
                              </TabPanels>
                            </Tabs>

                            {address == ownerAddress ? (
                              <Stack direction="row" spacing={2}>
                                <Modal
                                  isOpen={isOpen}
                                  onClose={onClose}
                                  size="full"
                                >
                                  <ModalOverlay />
                                  <ModalContent
                                    maxW="80vw" // Set maximum width to 100vw (viewport width)
                                    maxH="80vh" // Set maximum height to 100vh (viewport height)
                                  >
                                    <ModalBody>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: htmlPreview,
                                        }}
                                      ></div>
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={onClose}
                                      >
                                        Close
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>

                                <Button
                                  size="sm"
                                  rightIcon={<FaForward />}
                                  colorScheme="teal"
                                  type="submit"
                                  width="half"
                                  mt={4}
                                >
                                  Save
                                </Button>

                                {jsonDataNew != null ? (
                                  <Stack direction="row" spacing={2}>
                                    {flag === false && (
                                      <Button
                                        size="sm"
                                        rightIcon={<FaForward />}
                                        colorScheme="red"
                                        width="half"
                                        mt={4}
                                        onClick={() => preview()}
                                      >
                                        Preview
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      rightIcon={<FaForward />}
                                      colorScheme="pink"
                                      width="half"
                                      mt={4}
                                      onClick={() => handleUpload()}
                                    >
                                      {isLoading ? (
                                        <>
                                          {" "}
                                          <CircularProgress
                                            isIndeterminate
                                            size="24px"
                                          />{" "}
                                          Preparing
                                        </>
                                      ) : (
                                        "Prepare"
                                      )}
                                    </Button>
                                  </Stack>
                                ) : (
                                  <></>
                                )}

                                {claimUrl != "http://web3yak.com" ? (
                                  <TokenURI
                                    domainName={domain}
                                    TokenURI={claimUrl}
                                  />
                                ) : (
                                  <></>
                                )}
                              </Stack>
                            ) : (
                              <>Not authorized</>
                            )}
                          </form>
                        ) : (
                          <Alert status="error">
                            <AlertIcon />
                            <AlertTitle>You are not authorized.</AlertTitle>
                          </Alert>
                        )}
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
      </Box>
    </Flex>
  );
}
