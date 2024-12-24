import { ThemingProps } from '@chakra-ui/react'
import { polygon} from '@wagmi/chains'

export const SITE_NAME = 'ODude Name Service'
export const SITE_DESCRIPTION = 'ODude Name Service'
export const SITE_URL = 'https://www.odude.com/'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = { initialColorMode: THEME_INITIAL_COLOR }

export const SOCIAL_MEDIUM = '' //Leave it blank if no values
export const SOCIAL_TWITTER = 'odudename'
export const SOCIAL_GITHUB = 'odudename'
export const SOCIAL_LINKEDIN = ''
export const SOCIAL_DISCORD = ''

//Network Configuration. Supports single chain only.
export const NETWORKS = [polygon]; //polygon, filecoin, polygonMumbai 
export const NETWORK_ERROR = "Unsupported Blockchain Network" //Change network name as required

//Domain Information. It only supports single domain name. 
export const DOMAIN_TLDS = ['odude']; // Array of TLDs
export const DOMAIN_IMAGE_URL = 'https://web3domain.org/endpoint/nft/default.jpg' //Image path starts with ipfs:// or https://
export const DOMAIN_NETWORK_CHAIN = 137 //137 for polygon, 314 for filecoin, 80001 for mumbai, 11155111 for sepolia
export const DOMAIN_DESCRIPTION = 'ODude Name service'
export const DOMAIN_TYPE = "W3D" //W3D for polygon, FVM for Filecoin net
export const DOMAIN_TITLE = "Join our ODude Community" //Title above the search input field. 
export const DOMAIN_PLACEHOLDER = "Search for a name" //Placeholder for search input field 

//Admin wallet address of TLD mentioned at DOMAIN_TLD
export const ADMIN_WALLET = "0xaa481F8d2d966e5fCC0446fA459F5d580AE5ea9f" //ETH wallet address 

export const PROJECT_ID="2cb7b50126c5f7da8bc2dc5cfef00896" //https://cloud.walletconnect.com/sign-in


//Bulletin board at front page
export const NOTICE_TITLE = "Bulletin board"
export const NOTICE_NON_MEMBER = "Only the .odude name holder can view bulletin board."

//Banner at front page
export const DOMAIN_BANNER = "https://web3domain.org/studio/wp-content/uploads/2024/12/odude200x50.png" //290x80 size

//Configuration should match with the chain specified at NETWORKS
//Leave TOKEN_CONTRACT_ADDRESS to blank for default ETH payment
//export const TOKEN_CONTRACT_ADDRESS="0x76174204db0bC7c3C817ce5b16C6Ef3900434B02" //ERC20 EVM Token contract wallet address
export const TOKEN_SYMBOL= "$MATIC" //Token symbol name eg. DOGE
export const TOKEN_PRICE = "1" //Token price to mint
export const TOKEN_DECIMAL = "18" //Decimal places of TOKEN_CONTRACT_ADDRESS or TOKEN_SYMBOL
export const TOKEN_CONTRACT_ADDRESS=""

export const OTHER_DOMAIN="true" //This will load other domain configuration at your application. 
export const FAVICON="/odude_favicon.ico";
export const LOGO="/odude_logo.png";


// Menu

export const NAV_ITEMS = [
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
          label: "OpenSea",
          subLabel: "OpenSea.io",
          href: "https://opensea.io/collection/odudename?search[sortAscending]=false&search[sortBy]=CREATED_DATE",
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
  
  