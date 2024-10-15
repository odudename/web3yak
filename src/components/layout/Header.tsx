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
  Spinner
} from "@chakra-ui/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Logo } from "../../Reusables/helper";
import { useLoadConfig } from '../../hooks/useLoadConfig';
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
  const { config, configLoading } = useLoadConfig();

  // Move all hook calls to the top level of the component
  const bg = useColorModeValue("gray.50", "gray.900");
  const color = useColorModeValue("gray.700", "gray.200");
  const borderBottomColor = useColorModeValue("white", "gray.900");

  // Handle case where config is still loading or not available
  const navItems: Array<NavItem> = config?.NAV_ITEMS ?? [];

  // If loading, show a loading state for the header
  if (configLoading) {
    return (<Spinner size="xs" />);
  }

  // If config is missing or failed to load
  if (!config) {
    return <div>Error loading configuration.</div>;
  }

  return (
    <Flex
      as="header"
      className={className}
      bg={bg}
      color={color}
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
      borderBottomColor={borderBottomColor}
      zIndex={9999}
    >
      <Flex flex={{ base: 2 }} justify={{ base: "center", md: "start" }}>
        <Logo onToggle={onToggle} isOpen={isOpen} />
        <Flex display={{ base: "none", md: "flex" }} ml={10}>
          <DesktopNav navItems={navItems} />
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
        <MobileNav navItems={navItems} />
      </Collapse>
    </Flex>
  );
}

const DesktopNav = ({ navItems }: { navItems: Array<NavItem> }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const linkHoverBackgroundColor = useColorModeValue("blue.200", "blue.900");

  return (
    <Stack direction={"row"} spacing={8}>
      {navItems.map((navItem) => (
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

const MobileNav = ({ navItems }: { navItems: Array<NavItem> }) => {
  return (
    <Stack
      position="absolute" // Add absolute positioning
      top="60px" // Adjust this based on your header's height
      left="0"
      width="50%" // Ensure the menu takes full width of the screen
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
      zIndex={99} // Ensure the menu is on top of other elements
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  const textColor = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleToggle = (e: React.MouseEvent) => {
    if (children) {
      e.preventDefault(); // Only prevent default if there are children (dropdown)
      onToggle(); // Toggle the submenu
    }
  };

  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        onClick={handleToggle} // Toggle submenu only if children exist
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={textColor}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      {children && (
        <Collapse in={isOpen} animateOpacity>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={"solid"}
            borderColor={borderColor}
            align={"start"}
          >
            {children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
};
