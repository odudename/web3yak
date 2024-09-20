# FVM Web3Yak dApp
## _Become a Web3 Name provider_

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