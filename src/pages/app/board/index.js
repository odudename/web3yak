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
        >
          <Box
            textAlign="center"
            alignContent={"center"}
            borderRadius="lg"
            p={{ base: 2, lg: 1 }}
            bgSize={"lg"}
            maxH={"80vh"}
          >
            <Container
              maxW={"xl"}
              alignItems={"center"}
              justifyContent={"center"}
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