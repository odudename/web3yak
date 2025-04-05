import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useURLValidation } from "../../../hooks/validate";
import { useJsonValue } from "../../../hooks/jsonData";
import { generateJson, generatePreview } from "../../../hooks/ipfs";
import TokenURI from "../../../components/TokenURI"; // Adjust the path to the actual location
import { useAccount } from "wagmi";
import { useNetworkValidation } from "../../../hooks/useNetworkValidation";
import Link from "next/link";
import {useDomainInfo} from "../../../hooks/domainInfo";
import useGlobal from "../../../hooks/global";
import HomeButton from "../../../components/HomeButton"; // Home Button

//import updateDatabase from '../../../Reusables/db';
import {
  Icon,
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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  InputLeftElement,
  InputGroup,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  FormErrorMessage,
  CircularProgress,
  Divider,
  Kbd,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

import {
  FaBitcoin,
  FaEthereum,
  FaWallet,
  FaEnvelope,
  FaPhoneAlt,
  FaTwitter,
  FaTelegram,
  FaFacebookSquare,
  FaYoutube,
  FaInstagram,
  FaDiscord,
  FaRightLong,
  FaRightFromBracket,
  FaForward,
  FaExternalLinkAlt,
  FaLink,
} from "react-icons/fa";
import { useLoadConfig } from "../../../hooks/useLoadConfig";

export default function Manage() {
  const { config, configLoading } = useLoadConfig(); // Load configuration
  const { address } = useAccount();
  const router = useRouter();
  const { manage } = router.query;
  const domain = manage ? String(manage).toLowerCase() : "";
  const { isValid } = useNetworkValidation(); // Get the contract address and validation status

  const { ownerAddress } = useDomainInfo(domain);
  const { replaceNullWithEmptyString } = useGlobal();
  const [jsonData, setJsonData] = useState(null); // Initialize jsonData as null
  const [jsonDataNew, setJsonDataNew] = useState(null); // Initialize jsonData as null
  const { getValue } = useJsonValue(jsonData);
  const [claimUrl, setClaimUrl] = useState("http://web3yak.com");
  const [image, setImage] = useState('');
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");
  const [twitter, setTwitter] = useState(" ");
  const [telegram, setTelegram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [facebook, setFacebook] = useState("");
  const [discord, setDiscord] = useState("");
  const [instagram, setInstagram] = useState("");
  const [btc, setBtc] = useState("");
  const [eth, setEth] = useState("");
  const [matic, setMatic] = useState("");
  const [bsc, setBsc] = useState("");
  const [fil, setFil] = useState("");
  const [sol, setSol] = useState("");

  const [web3Url, setWeb3Url] = useState("");
  const [web2Url, setWeb2Url] = useState("");
  const [flag, setFlag] = useState(false);
  const bg=useColorModeValue("white", "gray.700");
  const color=useColorModeValue("gray.700", "whiteAlpha.900");

  const { validateURL } = useURLValidation();
  const handleURLChange = (event) => {
    const inputURL = event.target.value;

    const isValid = validateURL(inputURL);
    // You can perform further actions based on the URL validity
    if (isValid) {
      return true;
    } else {
      return false;
    }
  };

  const isDomainMatched = (domain) => {
    // Check if the domain is an exact match or ends with any of the TLDs
    return config.DOMAIN_TLDS.some(tld => domain === tld || domain.endsWith(`@${tld}`));
  };

  const handleUpload = async () => {
    console.log("Verify record of  " + domain);
    setIsLoading(true);
    if (domain !== "undefined") {
      // console.log(jsonData);

      await genJson();
    }
  };

  async function genJson() {
    //handleSubmit(null);
    // console.log(jsonDataNew);
    const response = await generateJson(jsonDataNew, domain);
    if (response.ok) {
      const responseText = await response.text();

      try {
        const responseObject = JSON.parse(responseText);
        const cidValue = responseObject.link;
       // console.log("https://web3yak.com/ipfs/" + cidValue);
      //  setClaimUrl("https://web3yak.com/ipfs/" + cidValue);
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

  const getLayout = async () => {
    console.log("cid of layout  " + domain);
    console.log(jsonDataNew);
    if (jsonDataNew) {
      const response = await generatePreview(jsonDataNew, domain, "true");
      if (response.ok) {
        const responseText = await response.text();
        console.log(response);
        try {
          const responseObject = JSON.parse(responseText);
          console.log(responseObject);
          const cidValue = responseObject.link;
         const cidUrl = cidValue;
      //  const cidUrl = "https://web3yak.com/ipfs/.....";
          console.log(cidUrl);
          setWeb2Url(cidUrl);

          const updatedJsonData = {
            ...jsonDataNew,
            records: {
              ...jsonDataNew.records,

              50: { type: "web_url", value: cidUrl },
            },
          };
          console.log(web2Url);
          console.log(updatedJsonData);
          setJsonDataNew(updatedJsonData);
        } catch (error) {
          console.log("Error parsing JSON of layout:", error);
        }
      }
    }
    setFlag(false);
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    console.log("Saving record..");

    const array = {
      name: manage,
      description: config.DOMAIN_DESCRIPTION,
      image: image,
      attributes: [
        { trait_type: "domain", value: manage },
        { trait_type: "level", value: "2" },
        { trait_type: "length", value: 8 },
      ],
      records: {
        1: { type: "name", value: profile },
        2: { type: "email", value: email },
        3: { type: "website", value: url },
        4: { type: "phone", value: phone },
        5: { type: "tg_bot", value: "Web3Domain Telegram Bot" },
        6: {
          type: "social",
          value: {
            twitter: twitter,
            telegram: telegram,
            discord: discord,
            youtube: youtube,
            facebook: facebook,
            instagram: instagram,
          },
        },
        7: {
          type: "link",
        },
        8: {
          type: "crypto",
          value: {
            matic: matic,
            fil: fil,
            sol: sol,
            bsc: bsc,
            eth: eth,
          },
        },
        9: { type: "notes", value: notes },
        50: { type: "web_url", value: web2Url },
        51: { type: "web3_url", value: web3Url },
      },
    };

    replaceNullWithEmptyString(array);

    console.log(array);

    setJsonDataNew(array);
    setFlag(true);
  };

  /*
  const handleInsertToDatabase = async () => {


    const mm = {
      title: manage,
      metacritic: "xyy111111111111111111vvvyy",
      plot: "101",
      jp: '',
    };

    // Call the utility function to update the database
    updateDatabase(mm);
  };
*/

  useEffect(() => {
    setIsMainLoading(true);
    const randomNumber = Math.random(); // Generate a random number
    if (domain && config) {
      const url =
        "https://web3yak.com/endpoint/v3/opensea.php?name=" +
        domain +
        "&" +
        randomNumber;
     // console.log(url);
      setImage(config.DOMAIN_IMAGE_URL);
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          setJsonData(json); // Store the json response in the component's state
          setIsMainLoading(false);
         // console.log(json);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchData();
    }
  }, [domain, config]);

  useEffect(() => {
    if (jsonData) {
      var img =
        jsonData?.image && jsonData.image.startsWith("ipfs://")
          ? jsonData.image.replace("ipfs://", "https://web3yak.com/ipfs/")
          : jsonData?.image;
      //console.log(img);
      setImage(jsonData && img);
      setProfile(jsonData && getValue("name"));
      setEmail(jsonData && getValue("email"));
      setPhone(jsonData && getValue("phone"));
      setUrl(jsonData && getValue("website"));
      setTwitter(jsonData && getValue("twitter"));
      setTelegram(jsonData && getValue("telegram"));
      setFacebook(jsonData && getValue("facebook"));
      setYoutube(jsonData && getValue("youtube"));
      setInstagram(jsonData && getValue("instagram"));
      setDiscord(jsonData && getValue("discord"));
      setBtc(jsonData && getValue("btc"));
      setEth(jsonData && getValue("eth"));
      setMatic(jsonData && getValue("matic"));
      setBsc(jsonData && getValue("bsc"));
      setFil(jsonData && getValue("fil"));
      setSol(jsonData && getValue("sol"));
      setNotes(jsonData && getValue("notes"));

      const isValidHost = validateURL(getValue("web3_url"));
      if (isValidHost && getValue("web3_url") != "") {
        //User Website
        setWeb3Url(jsonData && getValue("web3_url"));
        //IPFS website
        setWeb2Url("");
      } else {
        //IPFS URL of Web3Domain
        const isValidIPFS = validateURL(getValue("web_url"));
        if (isValidIPFS) {
          setWeb2Url(jsonData && getValue("web_url"));
        } else {
          if (getValue("web_url") == "") {
            setWeb2Url("");
          } else {
            setWeb2Url(
              jsonData && "https://web3yak.com/ipfs/" + getValue("web_url")
            );
          }
        }
      }

      /*
      const mm = {
        title: manage,
        metacritic: "xyyvzzzzzzvvvvvvyy",
        plot: "101",
        img: img,
        profile :getValue("name"),
        email: getValue("email"),
        website:getValue("website") ,
        notes:getValue("notes"),
        eth:getValue("eth"),
        bsc:getValue("bsc"),
        matic:getValue("matic"),
        btc:getValue("btc"),
        fil:getValue("fil"),
        sol:getValue("sol"),
        twitter:getValue("twitter"),
        telegram:getValue("telegram"),
        youtube:getValue("youtube"),
        instagram:getValue("instagram"),
        facebook:getValue("facebook"),
      };
  
      // Call the utility function to update the database
      updateDatabase(mm);
*/

    }
  }, [jsonData]);

  useEffect(() => {
    async function get_cid_of_layout() {
      if (flag) {
        await getLayout();
      }
    }
    get_cid_of_layout();
  }, [flag]);

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
      minWidth="max-content"
    >
      <Container
        maxW="3xl"
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"center"}
        textAlign="center"
      >
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
              alignItems={"center"}
              justifyContent={"center"}
              spacing={{ base: 2, md: 2 }}
              py={{ base: 10, md: 2 }}
            >
              <Stack>
                <Heading as="h5" size="sm">
                  Blockchain Record
                </Heading>
                <Divider />
                {isMainLoading ? (
                  <Box padding="12" boxShadow="lg" bg="white">
                    <SkeletonCircle size="10" />
                    <SkeletonText
                      mt="4"
                      noOfLines={4}
                      spacing="4"
                      skeletonHeight="3"
                    />
                  </Box>
                ) : (
                  <div>
                    {address == ownerAddress ? (
                      <form onSubmit={handleSubmit}>
                        <Tabs isFitted variant="enclosed">
                          <TabList mb="1em">
                            <Tab>General</Tab>
                            <Tab>Social</Tab>
                            <Tab>Wallet</Tab>
                            <Tab>Notes</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel>
                              <Stack spacing={2}>
                                <FormControl isRequired mt={2}>
                                  <FormLabel>Profile Information</FormLabel>
                                  <Input
                                    type="text"
                                    placeholder="Company / Your name"
                                    size="md"
                                    value={profile}
                                    onChange={(event) =>
                                      setProfile(event.currentTarget.value)
                                    }
                                  />
                                </FormControl>
                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaEnvelope color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="email"
                                      placeholder="Email Address"
                                      size="md"
                                      value={email}
                                      onChange={(event) =>
                                        setEmail(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaPhoneAlt color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="tel"
                                      placeholder="Phone number"
                                      value={phone}
                                      size="md"
                                      onChange={(event) =>
                                        setPhone(event.currentTarget.value)
                                      }
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
                                      placeholder="Website Link"
                                      size="md"
                                      value={url}
                                      onChange={(event) => {
                                        setUrl(event.target.value); // Update email state
                                        handleURLChange(event); // Validate and perform necessary actions
                                      }}
                                    />
                                  </InputGroup>
                                  {url !== "" && (
                                    <FormErrorMessage>
                                      Enter valid website link
                                    </FormErrorMessage>
                                  )}
                                </FormControl>
                              </Stack>
                            </TabPanel>

                            <TabPanel>
                              <Stack spacing={2}>
                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaTwitter color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="url"
                                      placeholder="Twitter Link"
                                      value={twitter}
                                      size="sm"
                                      onChange={(event) =>
                                        setTwitter(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaTelegram color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="url"
                                      placeholder="Telegram Link"
                                      size="sm"
                                      value={telegram}
                                      onChange={(event) =>
                                        setTelegram(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaFacebookSquare color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="url"
                                      placeholder="Facebook Link"
                                      value={facebook}
                                      size="sm"
                                      onChange={(event) =>
                                        setFacebook(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaYoutube color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="url"
                                      placeholder="Youtube Link"
                                      size="sm"
                                      value={youtube}
                                      onChange={(event) =>
                                        setYoutube(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaInstagram color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="url"
                                      placeholder="Instagram Link"
                                      value={instagram}
                                      size="sm"
                                      onChange={(event) =>
                                        setInstagram(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaDiscord color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="url"
                                      placeholder="Discord Link"
                                      value={discord}
                                      size="sm"
                                      onChange={(event) =>
                                        setDiscord(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>
                              </Stack>
                            </TabPanel>

                            <TabPanel>
                              <Stack spacing={3}>
                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaBitcoin color="red.500" />
                                    </InputLeftElement>
                                    <Input
                                      type="text"
                                      placeholder="Bitcoin Wallet Address"
                                      value={btc}
                                      size="sm"
                                      onChange={(event) =>
                                        setBtc(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaEthereum color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="text"
                                      placeholder="Ethereum Wallet Address"
                                      value={eth}
                                      size="sm"
                                      onChange={(event) =>
                                        setEth(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaEthereum color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="text"
                                      placeholder="Polygon Wallet Address"
                                      value={matic}
                                      size="sm"
                                      onChange={(event) =>
                                        setMatic(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaEthereum color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="text"
                                      placeholder="BSC Wallet Address"
                                      value={bsc}
                                      size="sm"
                                      onChange={(event) =>
                                        setBsc(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaWallet color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="text"
                                      placeholder="Filecoin Wallet Address"
                                      value={fil}
                                      size="sm"
                                      onChange={(event) =>
                                        setFil(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>

                                <FormControl>
                                  <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                      <FaWallet color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                      type="text"
                                      placeholder="Solana Wallet Address"
                                      value={sol}
                                      size="sm"
                                      onChange={(event) =>
                                        setSol(event.currentTarget.value)
                                      }
                                    />
                                  </InputGroup>
                                </FormControl>
                              </Stack>
                            </TabPanel>

                            <TabPanel>
                              <Text mb="8px">Extra Notes:</Text>
                              <Textarea
                                value={notes}
                                onChange={(event) =>
                                  setNotes(event.currentTarget.value)
                                }
                                placeholder="Street Address , Bank Account, Some text information"
                                size="sm"
                              />
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                       
                        <Stack direction="row" spacing={2}>
                          <Button
                            size="sm"
                            rightIcon={<FaForward />}
                            colorScheme="teal"
                            type="submit"
                            width="half"
                            mt={4}
                          >
                            {flag ? (
                              <>
                                {" "}
                                <CircularProgress
                                  isIndeterminate
                                  size="24px"
                                />{" "}
                                Saving{" "}
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                          {jsonDataNew != null && !flag ? (
                            <Button
                              size="sm"
                              rightIcon={<FaForward />}
                              colorScheme="green"
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
                                  Submitting{" "}
                                </>
                              ) : (
                                "Verify"
                              )}
                            </Button>
                          ) : (
                            <></>
                          )}

                          {claimUrl != "http://web3yak.com" && !flag ? (
                            <TokenURI domainName={domain} TokenURI={claimUrl} />
                          ) : (
                            <></>
                          )}
                        </Stack>
                      </form>
                    ) : (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>You are not authorized.</AlertTitle>
                      </Alert>
                    )}
                  </div>
                )}
              </Stack>
            </Stack>
          ) : (
            <>{config.NETWORK_ERROR}</>
          )}
        </Box>
      </Container>
    </Flex>
  );
}