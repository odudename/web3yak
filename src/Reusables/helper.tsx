import React, { ReactNode } from "react";
import {
  Image,
  chakra,
  HStack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Show,
   Hide
} from "@chakra-ui/react";
import {
  SITE_NAME
} from "../configuration/Config";


export const Logo = (props: any) => {
  return (
    <HStack>
      <>
        <Image
          width={8}
          height={8}
          alt={"Login Image"}
          objectFit={"cover"}
          src={"/logo.png"}
        />
       <Show above='sm'> <Text as="kbd">{SITE_NAME}</Text></Show>
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
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
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
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};