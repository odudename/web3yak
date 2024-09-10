import React from "react";
import {
  Text,
  Flex,
  useColorModeValue,
  Spacer,
  Box,
  Collapse,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Logo } from "../../Reusables/helper";
import { SITE_NAME } from "../../configuration/Config";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons"; // Import icons

interface Props {
  className?: string;
}

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export function Header(props: Props) {
  const className = props.className ?? "";
  const { isOpen, onToggle } = useDisclosure(); // Manage the mobile menu state here

  return (
    <Flex
      as="header"
      className={className}
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      opacity={1}
      px={4}
      py={2}
      mb={8}
      pos="sticky"
      w="full"
      alignItems="center"
      borderBottom="1px"
      borderBottomWidth="small"
      borderBottomStyle="solid"
      borderBottomColor="white"
    >
      <Flex flex={{ base: 2 }} justify={{ base: "center", md: "start" }}>
        <Logo onToggle={onToggle} isOpen={isOpen} />
        <Flex display={{ base: "none", md: "flex" }} ml={10}>
          <DesktopNav />
        </Flex>
      </Flex>

      <Spacer />

      <Flex alignItems="center" gap={4}>
        <ConnectButton
          accountStatus={{
            smallScreen: "address",
            largeScreen: "full",
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: false,
          }}
        />
        <ThemeSwitcher />
      </Flex>

      {/* Mobile navigation controlled by isOpen */}
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Flex>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const linkHoverBackgroundColor = useColorModeValue("blue.200", "blue.900");

  return (
    <Stack direction={"row"} spacing={8}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"md"}
                fontWeight={500}
                color={linkColor}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                  bg: linkHoverBackgroundColor,
                }}
              >
                <Text as="samp">
                  <Text as="b">{navItem.label}</Text>
                </Text>
              </Link>
            </PopoverTrigger>
            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      position="absolute"  // Add absolute positioning
      top="60px"           // Adjust this based on your header's height
      left="0"
      width="50%"         // Ensure the menu takes full width of the screen
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
      zIndex={99}          // Ensure the menu is on top of other elements
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};


const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigation on toggle
    onToggle();
  };

  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        onClick={(e) => !children && e.preventDefault()} // Only navigate if no children
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={useColorModeValue("gray.600", "gray.200")}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
            onClick={handleToggle} // Toggle submenu without navigating
          />
        )}
      </Flex>

      {/* Submenu collapse */}
      <Collapse in={isOpen} animateOpacity>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};


const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/",
    children: [
      {
        label: "ODude",
        subLabel: "ODude.com",
        href: "https://odude.com",
      },
      {
        label: "Web3Domain",
        subLabel: "Web3Domain.org",
        href: "https://web3domain.org",
      },
    ],
  },
  {
    label: "Names",
    href: "/list",
  },
];
