# CreditChain Networks

CreditChain network metadata lives in:

- `libs/forge/creditchain-config/src/lib/networks.ts`
- `apps/forge-ide/.env.example`
- WalletConnect helpers: `apps/forge-ide/src/app/plugins/walletconnect/utils/chains.ts`

Canonical source of truth: [docs.creditchain.org/networks.json](https://docs.creditchain.org/networks.json) and [Argos testnet docs](https://docs.creditchain.org/networks/argos-testnet/).

## Configured Networks

| Network | Chain ID | RPC URL | Explorer | Currency | Notes |
| --- | ---: | --- | --- | --- | --- |
| CreditChain Testnet (Argos) | `2026042404` (`0x78c2f424`) | `https://testnet.creditchain.org` (also `https://argos.creditchain.org`) | `https://scan.creditchain.org` | `CCC` | **Active / default.** Genesis `0xcbb0f12e2a67c07a59218baefb4eb8211d9867b52b716fb190e4df12628042c9`. Faucet: `https://faucet.creditchain.org/testnet`. Explorer API: `https://api-testnet.creditchain.org` |
| CreditChain Mainnet (Argos) | `2026042405` (`0x78c2f425`) | _(empty — launch gated; `https://rpc.creditchain.org` returns `mainnet_launch_gated`)_ | _(none until launch)_ | `CCC` | **Planned only — NOT launched.** Do not offer as connectable (`isDefault: false`, empty RPC). |
| Local CreditChain Devnet | `31337` | `http://127.0.0.1:8545` | `http://127.0.0.1:4000` | `CCC` | Local Anvil/Hardhat/dev node |

## Production / connectability rules

- Only networks with `status: active` in `networks.json` may be offered as connectable.
- Argos testnet is the default CreditChain network in Forge.
- Argos mainnet remains planned: keep empty RPC / clear notes; never set `isDefault`.
- Confirm verification API request path/query format against Forge verify callers (`https://api-testnet.creditchain.org`).

## Wallet Add Flow

The home tab uses `wallet_addEthereumChain` with values from `CREDITCHAIN_NETWORKS`. Prefer adding **CreditChain Testnet**; skip mainnet until launch (empty `rpcUrl`).
