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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { SITE_NAME } from "../configuration/Config";

export const Logo = ({ onToggle, isOpen }: { onToggle: () => void; isOpen: boolean }) => {
  return (
    <HStack>
      <Link
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
          alt={"Logo"}
          objectFit={"cover"}
          src={"/logo.png"}
        />
      </Link>

      <Show above="sm">
        <Text as="kbd">{SITE_NAME}</Text>
      </Show>

      {/* Hamburger menu for small screens */}
      <Show below="sm">
        <IconButton
          onClick={onToggle}
          icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
          variant={"ghost"}
          aria-label={"Toggle Navigation"}
        />
      </Show>
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
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};
