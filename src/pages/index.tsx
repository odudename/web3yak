import type { NextPage } from "next";
import React from "react";
import {DOMAIN_TITLE,DOMAIN_BANNER} from "../configuration/Config";
import Search from "../components/domain/Search";
import { Image,Center } from '@chakra-ui/react'
import PrivateNotice from "../components/message/PrivateNotice";

// Import debounce from lodash
import {
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";


const Home: NextPage = () => {
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
    bgSize={"lg"}
    maxH={"80vh"}
  >
    <Container maxW={"5xl"} alignItems={"center"} justifyContent={"center"}>
      <Center>
        <Image src={DOMAIN_BANNER} alt="Banner" />
      </Center>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 4, md: 6 }}  // Adjusted spacing to reduce margin
        py={{ base: 10, md: 4 }}  // Adjusted padding to reduce vertical space
      >
        <Flex align="center" justify="space-between" width="100%">
          <Box flex="1" />
          <Heading as="h3" size="md" fontSize="20px">
            {DOMAIN_TITLE}
          </Heading>
          <Box flex="1" textAlign="right">
            <PrivateNotice />
          </Box>
        </Flex>
        <div>
          <Search />
        </div>
      </Stack>
    </Container>
  </Box>
</Flex>

  );
};

export default Home;
