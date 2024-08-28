import React from "react";

import Search from "../../components/domain/Search";
import {DOMAIN_TITLE} from "../../configuration/Config";
import {
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
export default function SearchPage() {
  return (
    <>
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
          <Container
            maxW={"3xl"}
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
                <Heading as="h2" fontSize="2xl" my={1}>
                  {DOMAIN_TITLE}
                </Heading>
                <p>
                  <Search />
                </p>
              </div>
            </Stack>
          </Container>
        </Box>
      </Flex>
    </>
  );
}
