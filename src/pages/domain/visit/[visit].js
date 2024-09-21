import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Spinner,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  Progress,
} from "@chakra-ui/react";
import useDomainInfo from "../../../hooks/domainInfo"; // Correct hook import

// Helper function to transform IPFS CIDs into proper URLs
const transformIpfsUrl = (url) => {
  // Only replace "ipfs://" if the URL starts with it
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return url; // Return the original URL if it's not an IPFS URL
};

const VisitPage = () => {
  const [webUrl, setWebUrl] = useState(""); // Stores the URL to redirect
  const [isLoading, setIsLoading] = useState(true); // Ensure it's true initially
  const [isRedirect, setIsRedirect] = useState(false); // Redirect state
  const [redirectType, setRedirectType] = useState(""); // Type of redirection (IPFS, HTTP, or invalid)
  const [countdown, setCountdown] = useState(15); // Countdown from 15

  const router = useRouter(); // Router to access query params
  const { visit } = router.query; // Get the 'visit' param from the URL
  const domain = visit ? String(visit).toLowerCase() : ""; // Ensure domain is in lowercase
  const { oldUri } = useDomainInfo(domain); // Use custom hook to fetch domain info


// Function to fetch and process JSON data from oldUri via the proxy
const getJson = async (url) => {
  try {
    setIsLoading(true); // Set loading to true when starting to fetch data
    const web2Url = transformIpfsUrl(url);

    console.log("Fetching JSON via proxy for:", web2Url);

    // Use the Next.js API route as a proxy to avoid CORS issues
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(web2Url)}`);

    // Check for a valid response
    if (!response.ok) {
      throw new Error('Failed to fetch JSON via proxy');
    }

    const json = await response.json();

    console.log("Fetched JSON data:", json);
    processJson(json);
  } catch (error) {
    console.error("Error fetching JSON via proxy:", error);
    setRedirectType("Invalid"); // Mark as invalid
  }
};


  // Function to process the fetched JSON data
  const processJson = (jsonData) => {
    let web_url = "";
    let web3_url = "";
  
    // Extract Web3 URL (field "51") and Web2 URL (field "50") from the "records" object
    if (jsonData?.records?.["51"]?.value) {
      web3_url = jsonData.records["51"].value;
    }
  
    if (jsonData?.records?.["50"]?.value) {
      const cidOrUrl = jsonData.records["50"].value;
  
      if (cidOrUrl.startsWith("http")) {
        web_url = cidOrUrl; // If it's a valid HTTP URL, use it directly
      } else {
        web_url = `https://ipfs.io/ipfs/${cidOrUrl}`; // Convert CID to IPFS URL
      }
    }
  
    console.log("Determined Web3 URL:", web3_url);
    console.log("Determined Web2 URL:", web_url);
  
    if (web3_url || web_url) {
      // If we have a valid URL, set it and redirect accordingly
      setWebUrl(web3_url || web_url); 
      setRedirectType(web3_url ? "IPFS" : "HTTP");
      setIsRedirect(true); // Start the redirect process
    } else {
      // No valid URL found, set redirect type to invalid and trigger redirect
      console.log("No valid URL found, triggering fallback.");
      setRedirectType("Invalid");
      setIsRedirect(true); // Trigger redirect even with invalid URLs
    }
    
    // Do not stop loading, as loading will continue until redirection happens
  };
  
// Effect to fetch JSON data when oldUri is available
useEffect(() => {
  if (oldUri) {
    console.log("Old URI:", oldUri); // Debugging: log oldUri
    getJson(oldUri); // Fetch JSON data from oldUri
  } else {
    console.log("No oldUri found, redirecting to info page.");
    setRedirectType("Invalid");
    setIsRedirect(true); // Trigger redirect even if oldUri is missing
  }
}, [oldUri]);

  // Effect to handle URL redirection if webUrl is available
  useEffect(() => {
    console.log("Redirect :"+webUrl);
    if (webUrl && isRedirect) {
      console.log("Redirecting to URL:", webUrl);
     
      setTimeout(() => {
        window.location.assign(webUrl); // Redirect after timeout
      }, 500); // A slight delay to ensure UI updates
     
    }
  }, [webUrl, isRedirect]);

// Effect to handle URL redirection or fallback to info page
useEffect(() => {
  if (isRedirect) {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      if (webUrl) {
        console.log("Redirecting to:", webUrl);
        window.location.assign(webUrl); // Redirect to webUrl when countdown reaches 0
      } else {
        console.log("Redirecting to info page for domain:", domain);
        router.replace(`/domain/info/${domain}`); // Redirect to info page if no valid URL
      }
    }, 15000); // Redirect after 15 seconds

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }
}, [isRedirect, router, domain, webUrl]);


return (
  <Flex align="center" justify="center" minH="80vh" bg="gray.50">
    <Box textAlign="center" p={5} maxW="md" borderRadius="md" bg="white" shadow="md">
      {isLoading ? (
        <>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <br />
          {redirectType === "IPFS" ? (
            <p>Redirecting to IPFS Link... ({countdown})</p>
          ) : redirectType === "HTTP" ? (
            <p>Redirecting to HTTP Link... ({countdown})</p>
          ) : (
            <p>Processing... ({countdown})</p>
          )}
          <Progress value={(15 - countdown) * 100 / 15} size="xs" mt={3} />
          <br />
          <Link href={webUrl || `/domain/info/${domain}`} isExternal>
            {webUrl ? "Opening..." : "Go to Info Page"} <ExternalLinkIcon mx="2px" />
          </Link>
        </>
      ) : redirectType === "Invalid" ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{domain} : Invalid Link</AlertTitle>
        </Alert>
      ) : null}
    </Box>
  </Flex>
);

};

export default VisitPage;
