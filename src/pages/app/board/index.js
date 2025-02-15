import React from 'react';
import { useLoadConfig } from "../../../hooks/useLoadConfig";
import {
    Box,
    Container,
    Flex,
    Heading,
    Stack,
    useColorModeValue,
    Spinner
  } from "@chakra-ui/react";
const Board = () => {
      const { config, configLoading } = useLoadConfig(); // Load configuration
      const bg=useColorModeValue("white", "gray.700");
      const color=useColorModeValue("gray.700", "whiteAlpha.900"); 
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
        <>
        <Flex
          align="center"
          justify="center"
          bg={bg}
          borderRadius="md"
          color={color}
          shadow="base"
          width="100%" // Ensure the Flex container takes full width
        >
          <Box
            textAlign="center"
            alignContent={"center"}
            borderRadius="lg"
            p={{ base: 2, lg: 1 }}
            bgSize={"lg"}
            maxH={"80vh"}
            width="100%" // Ensure the Box takes full width
          >
            <Container
              maxW={"100%"} // Set the maximum width to 100%
              width="100%" // Ensure the container takes full width
              alignItems={"center"}
              justifyContent={"center"}
              py={{ base: 40, md: 32 }} // Increase the padding on the y-axis
            >
              <Stack
                as={Box}
                textAlign={"center"}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 20, md: 16 }}
              >
        <div>
            <h1>Hello</h1>
        </div>
        </Stack>    
        </Container>
        </Box>
        </Flex>
        </>
    );
};

export default Board;