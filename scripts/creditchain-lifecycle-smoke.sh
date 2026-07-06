#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXAMPLE_DIR="$ROOT_DIR/examples/creditchain-lifecycle"
RPC_URL="${CREDITCHAIN_RPC_URL:-${CREDITCHAIN_MAINNET_RPC_URL:-https://rpc.creditchain.org}}"
SCAN_URL="${CREDITCHAIN_SCAN_URL:-https://scan.creditchain.org}"
BROWSER_URL="${CREDITCHAIN_BROWSER_URL:-https://browser.creditchain.org}"
CONTRACT_ADDRESS="${CREDITFORGE_CONTRACT_ADDRESS:-}"

if ! command -v cast >/dev/null 2>&1; then
  echo "cast is required. Install Foundry: https://book.getfoundry.sh/getting-started/installation" >&2
  exit 2
fi

if ! command -v forge >/dev/null 2>&1; then
  echo "forge is required. Install Foundry: https://book.getfoundry.sh/getting-started/installation" >&2
  exit 2
fi

echo "== CreditForge lifecycle local tests =="
(cd "$EXAMPLE_DIR" && forge test -q)

echo
echo "== CreditChain RPC =="
echo "rpc: $RPC_URL"
chain_id="$(cast chain-id --rpc-url "$RPC_URL")"
block_number="$(cast block-number --rpc-url "$RPC_URL")"
client_version="$(cast rpc --rpc-url "$RPC_URL" web3_clientVersion | tr -d '"')"
echo "chainId: $chain_id"
echo "blockNumber: $block_number"
echo "clientVersion: $client_version"

echo
echo "== CreditChain explorers =="
scan_status="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 "$SCAN_URL")"
browser_status="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 "$BROWSER_URL")"
echo "scan: $SCAN_URL status=$scan_status"
echo "browser: $BROWSER_URL status=$browser_status"

if [ -n "$CONTRACT_ADDRESS" ]; then
  echo
  echo "== Contract bytecode =="
  code="$(cast code "$CONTRACT_ADDRESS" --rpc-url "$RPC_URL")"
  if [ "$code" = "0x" ]; then
    echo "No bytecode found at $CONTRACT_ADDRESS on chain $chain_id"
    exit 1
  fi

  echo "address: $CONTRACT_ADDRESS"
  echo "bytecodeBytes: $(( (${#code} - 2) / 2 ))"
  echo "scanLink: $SCAN_URL/address/$CONTRACT_ADDRESS"
  echo "browserLink: $BROWSER_URL/address/$CONTRACT_ADDRESS"
else
  echo
  echo "Set CREDITFORGE_CONTRACT_ADDRESS=0x... to verify a deployed contract bytecode lifecycle."
fi
