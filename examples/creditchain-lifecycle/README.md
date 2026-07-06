# CreditChain Smart Contract Lifecycle Example

This Foundry workspace is intentionally small and dependency-free. It proves the
CreditForge loop against CreditChain without requiring private-key disclosure.

## Local Compile And Test

```bash
cd examples/creditchain-lifecycle
forge test -vv
forge build
```

## Read-Only CreditChain Smoke

From the repository root:

```bash
./scripts/creditchain-lifecycle-smoke.sh
```

The script reads chain ID, block height, client version, `scan.creditchain.org`,
and `browser.creditchain.org`. If `CREDITFORGE_CONTRACT_ADDRESS` is set, it also
checks bytecode at that address and prints scan/browser links.

## Testnet Deployment Policy

CreditForge never asks users to paste seed phrases or raw private keys. Use a
Foundry keystore account or a secure CI signing policy.

Example with a Foundry account:

```bash
export CREDITCHAIN_TESTNET_RPC_URL="https://testnet.creditchain.org"
export CREDITFORGE_FOUNDRY_ACCOUNT="your-foundry-keystore-account"

forge create \
  --rpc-url "$CREDITCHAIN_TESTNET_RPC_URL" \
  --account "$CREDITFORGE_FOUNDRY_ACCOUNT" \
  --constructor-args "0x000000000000000000000000000000000000BEEF" \
  src/CreditForgeLifecycle.sol:CreditForgeLifecycle
```

After deployment:

```bash
export CREDITFORGE_CONTRACT_ADDRESS="0x..."
./scripts/creditchain-lifecycle-smoke.sh
```
