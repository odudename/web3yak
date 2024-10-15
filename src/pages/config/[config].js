import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Spinner, Box, Text } from "@chakra-ui/react"; // Import Chakra UI components
import { OTHER_DOMAIN } from "../../configuration/Config";

const ConfigPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [newConfig, setNewConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { config } = router.query;

  useEffect(() => {
    const handleCreateFile = async () => {
      if (OTHER_DOMAIN === "false") {
        // If OTHER_DOMAIN is "false", ignore everything and redirect to front page
        router.push("/");
        return;
      }

      if (config) {
        try {
          const response = await axios.get(`/api/create-config?config=${config}`);
          setMessage(response.data.message);

          if (response.data.message === "Configuration Loaded") {
            setNewConfig(config);

            // Set the cookie as a session cookie (no 'max-age' or 'expires' attribute)
            document.cookie = `newConfig=${config}; path=/`;

            if (OTHER_DOMAIN === "true") {
              // Force full page reload to apply new configuration
              window.location.href = "/";
            }
          }
        } catch (error) {
          console.error("Error creating file:", error);
          setError('No Online Configuration file found.');
        } finally {
          setIsLoading(false); // Stop loading after request is done
        }
      } else {
        setIsLoading(false); // Stop loading if no config
      }
    };

    handleCreateFile();
  }, [config]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
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
            <Text fontSize="lg" fontWeight="bold" color="red.500">
              Error: {error}
            </Text>
          ) : (
            <Text fontSize="lg" fontWeight="bold">
              {message}
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

export default ConfigPage;
