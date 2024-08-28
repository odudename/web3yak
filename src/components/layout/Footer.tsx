import React from "react";
import {
  Box,
  Container,
  Link,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaMedium,
  FaTwitter,
} from "react-icons/fa";
import {
  SITE_DESCRIPTION,
  SOCIAL_GITHUB,
  SOCIAL_LINKEDIN,
  SOCIAL_MEDIUM,
  SOCIAL_TWITTER,
  SOCIAL_DISCORD,
} from "../../configuration/Config";
import { NetworkStatus } from "../NetworkStatus";
import { Logo, SocialButton } from "../../Reusables/helper";

interface Props {
  className?: string;
}

export function Footer(props: Props) {
  const className = props.className ?? "";
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      pos="fixed"
      w="full"
      borderTop="1px"
      borderTopWidth="small"
      borderTopStyle="solid"
      borderTopColor="white"
      bottom={0}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text as="samp" hideBelow="md">
          {SITE_DESCRIPTION}
        </Text>
        <Link
          hideBelow="md"
          href={"/"}
          textAlign={useBreakpointValue({ base: "center", md: "left" })}
          fontFamily={"heading"}
          color={useColorModeValue("gray.800", "white")}
          _hover={{
            textDecoration: "none",
            color: useColorModeValue("gray.800", "white"),
            bg: useColorModeValue("green.200", "green.900"),
          }}
        >
             <Image
          width={8}
          height={8}
          alt={"Login Image"}
          objectFit={"cover"}
          src={"/logo.png"}
        />
        </Link>
        <Stack direction={"row"} spacing={6}>
          {SOCIAL_TWITTER && SOCIAL_TWITTER !== undefined && (
            <SocialButton
              label={"Twitter"}
              href={`https://twitter.com/${SOCIAL_TWITTER}`}
            >
              <FaTwitter />
            </SocialButton>
          )}

          {SOCIAL_MEDIUM && SOCIAL_MEDIUM !== undefined && (
            <SocialButton
              label={"Medium"}
              href={`https://medium.com/${SOCIAL_MEDIUM}`}
            >
              <FaMedium />
            </SocialButton>
          )}

          {SOCIAL_GITHUB && SOCIAL_GITHUB !== undefined && (
            <SocialButton
              label={"Github"}
              href={`https://github.com/${SOCIAL_GITHUB}`}
            >
              <FaGithub />
            </SocialButton>
          )}

          {SOCIAL_DISCORD && SOCIAL_DISCORD !== undefined && (
            <SocialButton
              label={"Discord"}
              href={`https://discord.com/channels/${SOCIAL_DISCORD}`}
            >
              <FaDiscord />
            </SocialButton>
          )}

          {SOCIAL_LINKEDIN && SOCIAL_LINKEDIN !== undefined && (
            <SocialButton
              label={"LinkedIn"}
              href={`https://www.linkedin.com/in/${SOCIAL_LINKEDIN}`}
            >
              <FaLinkedin />
            </SocialButton>
          )}
        </Stack>
      </Container>
      <Box position="absolute" bottom={2} right={2} hideBelow="md">
        <NetworkStatus />
      </Box>
    </Box>
  );
}
