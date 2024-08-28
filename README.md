# Web3Domain Launchpad
## _Become a Web3Domain provider_

[![N|Solid](https://web3domain.org/studio/wp-content/uploads/banner.jpg)](https://web3domain.org/studio/)


Empower your own website by selling subdomains. Integrate your domain into our ecosystem, offering every domain user access to all the features that Web3Domain provides.

## Features

- Optimal opportunity to earn through memberships by allowing users to obtain subdomains of your Web3 primary domain.
- Earn immediately upon domain minting.
- Set the price, image, and description for your subdomain at your discretion.
- Optionally restrict minting to yourself, saving on commission fees.
- All Web3Domains are NFTs, sellable on opensea.io.

## Installation

This project requires [Node.js](https://nodejs.org/) to run.

### Fork the Repository and Make Changes before Deployment

**Specify environment variables. If for local development, create a file `.env.local`. Leave variables blank if not required but do not delete or remove any keys.**

```sh
NEXT_PUBLIC_MATIC=get_rpc_url_for_polygon_and_do_not_remove_me_if_not_required
NEXT_PUBLIC_ETH=get_rpc_url_for_ethereum_and_do_not_remove_me_if_not_required
NEXT_PUBLIC_FILECOIN=https://api.node.glif.io/rpc/v1
NEXT_PUBLIC_INFURA_KEY=get_key_from_infura
NEXT_PUBLIC_ALCHEMY_KEY=get_key_from_alchemy_or_leave_it_as_it_is
NEXT_PUBLIC_PASSWORD=keep_any_secure_password_for_admin
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://.........
NEXT_PUBLIC_PVT_KEY=24dac.....any_blank_unused_wallet_private_key.......858888
```

**Modify the Web3Domain Studio configuration file**
>Edit the file src\configuration\Config.tsx.
>Change values to suit your requirements. Leave variables blank if not needed, but don't delete any keys.

```sh
import { ThemingProps } from '@chakra-ui/react'
import { polygon} from '@wagmi/chains'

export const SITE_NAME = '.Dude Name'
export const SITE_DESCRIPTION = 'ODude MEME Name Service'
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
export const NETWORK_ERROR = "Unsupported Blockchain Network or Domain Name !" //Change network name as required

//Domain Information. It only supports single domain name. 
export const DOMAIN_TLD = 'dude' //primary domain name without dot (.)
export const DOMAIN_IMAGE_URL = 'https://web3domain.org/endpoint/nft/dude.jpg' //Image path starts with ipfs:// or https://
export const DOMAIN_NETWORK_CHAIN = 137 //137 for polygon, 314 for filecoin, 80001 for mumbai, 11155111 for sepolia
export const DOMAIN_DESCRIPTION = '.dude MEME Name service by ODude.com'
export const DOMAIN_TYPE = "W3D" //W3D for polygon, FVM for Filecoin net
export const DOMAIN_TITLE = ".dude" //Title above the search input field. 
export const DOMAIN_PLACEHOLDER = "Search for a .dude" //Placeholder for search input field 

//Admin wallet address of TLD mentioned at DOMAIN_TLD
export const ADMIN_WALLET = "0xbed79816b54E75eD54BF217333342C8d271b3b6f" //ETH wallet address 

//Bulletin board at front page
export const NOTICE_TITLE = "Bulletin board"
export const NOTICE_NON_MEMBER = "Only the .dude name holder can view bulletin board."

//Banner at front page
export const DOMAIN_BANNER = "https://odude.com/odude400x100.png" //290x80 size

//Configuration should match with the chain specified at NETWORKS
//Leave TOKEN_CONTRACT_ADDRESS to blank for default ETH payment
//export const TOKEN_CONTRACT_ADDRESS="0x76174204db0bC7c3C817ce5b16C6Ef3900434B02" //ERC20 EVM Token contract wallet address
export const TOKEN_SYMBOL= "$MATIC" //Token symbol name eg. DOGE
export const TOKEN_PRICE = "1" //Token price to mint
export const TOKEN_DECIMAL = "18" //Decimal places of TOKEN_CONTRACT_ADDRESS or TOKEN_SYMBOL
export const TOKEN_CONTRACT_ADDRESS=""

```

**Modify or Update RPC Provider**
>Modify the file src\configuration\Web3.tsx.
>Switch between Alchemy or Infura provider.
>Comment out the unused import.
>Use or replace alchemyProvider / infuraProvider as needed. Default is Alchemy. 

**Update Header Menu Links**
>Modify the file /src/components/layout/Header.tsx
>Change labels, sublabels, and links as needed.


**Change Logo**

* Overwrite the files `logo.png` and `favicon.ico` under the `/public/` folder.

**Deploy to your server**

```
npm install
```

## License
MIT
**Free Software**