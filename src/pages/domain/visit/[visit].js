import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useJsonValue } from "../../../hooks/jsonData";
import { useURLValidation } from "../../../hooks/validate";
import useDomainInfo from "../../../hooks/domainInfo";
import { ExternalLinkIcon } from '@chakra-ui/icons';
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
  Spinner,
  Link
} from "@chakra-ui/react";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const transformIpfsUrl = (url) => {
  if (url && url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    return url;
  }
}

const UserProfilePage = () => {
  const [visitUrl, setVisitUrl] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [jsonData1, setJsonData1] = useState(null);
  const { validateURL } = useURLValidation();
  //const { getValue } = useJsonValue(jsonData);
  const router = useRouter();
  const { visit } = router.query;
  const domain = visit ? String(visit).toLowerCase() : "";
  const { oldUri } = useDomainInfo(domain);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirect, setIsRedirect] = useState(true);

  useEffect(() => {

  const getJson = async (url) => {

    //console.log("****** " + url);
    console.log("........" + transformIpfsUrl(url));

    const fetchData = async () => {
      try {
        var web2_url = transformIpfsUrl(url);
        const response = await fetch(web2_url);
        const json = await response.json();
        // setJsonData(json); // Store the json response in the component's state
        //setIsLoading(false);
        processJson(json);
        // console.log(json);
      } catch (error) {
        console.log("error", error);
        setIsLoading(false);
      }
    };
    await fetchData();

  }
  getJson();
}, [url]);

  const processJson = async (jsonData) => {
    var web_url = "";
    var web3_url = "";

    if (jsonData?.records?.hasOwnProperty("51") && jsonData.records["51"].value !== "") {
      web3_url = jsonData.records["51"].value;
    }

    if (jsonData?.records?.hasOwnProperty("50") && jsonData.records["50"].value !== "") {
      if (jsonData.records["50"].value != "https://ipfs.io/ipfs/null") {
        if (jsonData.records["50"].value.startsWith("https://")) {
          web_url = jsonData.records["50"].value;
        } else {
          web_url = "https://ipfs.io/ipfs/" + jsonData.records["50"].value;
        }
      }
    }

    if (web3_url !== "") {
      setWebUrl(web3_url);
      console.log(web3_url);
    } else if (web_url !== "") {
      setWebUrl(web_url);
      console.log(web_url);
    }
    else {
      console.log("no web3_url. Route to info page.");
      setIsRedirect(false);
      router.replace(`/domain/info/${domain}`);
    }

    console.log(jsonData);
  }


  useEffect(() => {

    if (webUrl) {
      window.location.assign(webUrl);
      console.log("Ready to redirect: " + webUrl);
    }
    else {
      console.log("no ready");
    }
  }, [webUrl]);

  useEffect(() => {

    console.log(oldUri);

    if (oldUri) {
      getJson(oldUri);
    }
    else {
      console.log("oldUri is null");
      setIsLoading(false);
    }

  }, [oldUri, getJson]);

  useEffect(() => {
    if (isRedirect) {
      const timer = setTimeout(() => {
        router.replace(`/domain/info/${domain}`);
      }, 15000);

      // Cleanup the timer on component unmount or when isRedirect changes
      return () => clearTimeout(timer);
    }
  }, [isRedirect, router, domain]);

  return (
    <div>
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

              {oldUri == null ?
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>{domain}</AlertTitle>
                </Alert>
                :
                <>  {isRedirect ? (
                  <>
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    /><br />
                    <Link href={webUrl} isExternal>
                      Opening... <ExternalLinkIcon mx='2px' />
                    </Link></>
                )
                  :
                  (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle>{domain} : Invalid Link</AlertTitle>
                    </Alert>
                  )
                }</>
              }
            </>
          )}
        </Box>
      </Flex>
    </div>
  );
};

export default UserProfilePage;
