# CreditChain Networks

CreditChain network metadata lives in:

- `libs/forge/creditchain-config/src/lib/networks.ts`
- `apps/remix-ide/.env.example`

The current values are placeholders and must be confirmed before public launch.

## Configured Networks

| Network | Chain ID | RPC URL | Explorer | Currency | Notes |
| --- | ---: | --- | --- | --- | --- |
| CreditChain Mainnet | `777777` | `https://rpc.creditchain.org` | `https://scan.creditchain.org` | `CDC` | Placeholder production values |
| CreditChain Testnet | `777778` | `https://testnet-rpc.creditchain.org` | `https://testnet-scan.creditchain.org` | `tCDC` | Placeholder testnet values |
| Local CreditChain Devnet | `31337` | `http://127.0.0.1:8545` | `http://127.0.0.1:4000` | `tCDC` | Local Anvil/Hardhat/dev node |

## Required Before Production

- Confirm final chain IDs.
- Confirm RPC endpoints and rate-limit policy.
- Confirm explorer URLs.
- Confirm faucet URL.
- Confirm verification API URL and request format.
- Confirm native token names and symbols.
- Confirm deployment gas policy and any enterprise compliance rules.

## Wallet Add Flow

The home tab uses `wallet_addEthereumChain` with values from `CREDITCHAIN_NETWORKS`. When final endpoints are confirmed, update the config file once and the UI will inherit the new values.
