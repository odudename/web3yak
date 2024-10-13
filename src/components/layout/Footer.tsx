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
import { useLoadConfig } from "../../hooks/useLoadConfig";
import { NetworkStatus } from "../NetworkStatus";
import { Logo, SocialButton } from "../../Reusables/helper";

interface Props {
  className?: string;
}

export function Footer(props: Props) {
  const { config, configLoading } = useLoadConfig();
  const textAlign = useBreakpointValue({ base: "center", md: "left" });
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("green.200", "green.900");
  const bg=useColorModeValue("gray.50", "gray.900");
  const color=useColorModeValue("gray.700", "gray.200")
    // If loading, show a loading state for the header
    if (configLoading) {
      return <div>Loading...</div>;
    }
  
    // If config is missing or failed to load
    if (!config) {
      return <div>Error loading configuration.</div>;
    }
  const className = props.className ?? "";
  return (
    <Box
      bg={bg}
      color={color}
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
          {config.SITE_DESCRIPTION}
        </Text>
        <Link
          hideBelow="md"
          href={"/"}
          textAlign={textAlign as any}
          fontFamily={"heading"}
          color={textColor}
          _hover={{
            textDecoration: "none",
            color: {textColor},
            bg: {hoverBg},
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
          {config.SOCIAL_TWITTER && config.SOCIAL_TWITTER !== undefined && (
            <SocialButton
              label={"Twitter"}
              href={`https://twitter.com/${config.SOCIAL_TWITTER}`}
            >
              <FaTwitter />
            </SocialButton>
          )}

          {config.SOCIAL_MEDIUM && config.SOCIAL_MEDIUM !== undefined && (
            <SocialButton
              label={"Medium"}
              href={`https://medium.com/${config.SOCIAL_MEDIUM}`}
            >
              <FaMedium />
            </SocialButton>
          )}

          {config.SOCIAL_GITHUB && config.SOCIAL_GITHUB !== undefined && (
            <SocialButton
              label={"Github"}
              href={`https://github.com/${config.SOCIAL_GITHUB}`}
            >
              <FaGithub />
            </SocialButton>
          )}

          {config.SOCIAL_DISCORD && config.SOCIAL_DISCORD !== undefined && (
            <SocialButton
              label={"Discord"}
              href={`https://discord.com/channels/${config.SOCIAL_DISCORD}`}
            >
              <FaDiscord />
            </SocialButton>
          )}

          {config.SOCIAL_LINKEDIN && config.SOCIAL_LINKEDIN !== undefined && (
            <SocialButton
              label={"LinkedIn"}
              href={`https://www.linkedin.com/in/${config.SOCIAL_LINKEDIN}`}
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
