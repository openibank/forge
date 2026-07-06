#!/usr/bin/env bash
set -euo pipefail

PAGES_TARGET="${FORGE_PAGES_DNS_TARGET:-openibank.github.io}"
SERVICE_TARGET="${FORGE_DNS_TARGET:-${CREDITFORGE_DNS_TARGET:-maple3.duckdns.org}}"
IDE_NAME="${FORGE_IDE_DNS_NAME:-forge.creditchain.org}"
SERVICE_NAMES=(
  api.forge.creditchain.org
  rpc.forge.creditchain.org
  ai.forge.creditchain.org
  indexer.forge.creditchain.org
)

if [ "${FORGE_SKIP_IDE_DNS:-0}" != "1" ]; then
  echo "== UPSERT $IDE_NAME CNAME $PAGES_TARGET =="
  FORGE_DNS_NAME="$IDE_NAME" \
  FORGE_DNS_TARGET="$PAGES_TARGET" \
  FORGE_DNS_TYPE=CNAME \
    "$(dirname "$0")/route53-upsert-forge.sh"
fi

for name in "${SERVICE_NAMES[@]}"; do
  echo "== UPSERT $name CNAME $SERVICE_TARGET =="
  FORGE_DNS_NAME="$name" \
  FORGE_DNS_TARGET="$SERVICE_TARGET" \
  FORGE_DNS_TYPE=CNAME \
    "$(dirname "$0")/route53-upsert-forge.sh"
done
