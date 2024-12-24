import React, { ReactNode } from "react";
import {
  Image,
  chakra,
  HStack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Show,
  IconButton,
  Link,
  useBreakpointValue,
  Spinner
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useLoadConfig } from "../hooks/useLoadConfig";

export const Logo = ({ onToggle, isOpen }: any) => {
  const { config, configLoading } = useLoadConfig();

  // Hook calls must be unconditional
  const textAlign = useBreakpointValue({ base: "center", md: "left" });
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("green.200", "green.900");

  // If loading, show a loading state for the header
  if (configLoading) {
    return (<Spinner size="xs" />);
  }
  // If config is missing or failed to load
  if (!config) {
    return <div>Error loading configuration.</div>;
  }

  return (
    <HStack>
      <>
        <Link
          href={"/#1.60"}
          textAlign={textAlign as any}
          fontFamily={"heading"}
          color={textColor}
          _hover={{
            textDecoration: "none",
            color: textColor,
            bg: hoverBg, // This is now using the hook outside of JSX
          }}
        >
          <Image
            width={8}
            height={8}
            alt={"Login Image"}
            objectFit={"cover"}
            src={config.LOGO}
          />
        </Link>
        <Show above="sm">
          <Text as="kbd">{config.SITE_NAME}</Text>
        </Show>

        {/* Display hamburger icon on small screens */}
        <Show below="sm">
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Show>
      </>
    </HStack>
  );
};

export const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  // Unconditionally declare hooks
  const bg = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const hoverBg = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  return (
    <chakra.button
      bg={bg}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      target={"_blank"}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: hoverBg, // Using hoverBg outside of JSX
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};
