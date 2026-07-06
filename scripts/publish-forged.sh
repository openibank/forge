#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="$(node -p 'process.execPath')"
NPM_BIN="$(dirname "$NODE_BIN")/npm"
TOKEN_FILE="${FORGED_NPM_TOKEN_FILE:-${NPM_TOKEN_FILE:-$HOME/.ssh/.npm-key}}"
PACKAGE_NAME_OVERRIDE="${FORGED_NPM_PACKAGE_NAME:-}"
USERCONFIG=""

if [ ! -x "$NPM_BIN" ]; then
  NPM_BIN="$(command -v npm)"
fi

cleanup() {
  if [ -n "$USERCONFIG" ]; then
    rm -f "$USERCONFIG"
  fi
}
trap cleanup EXIT

if [ -f "$TOKEN_FILE" ]; then
  USERCONFIG="$(mktemp)"
  token="$(tr -d '\r\n[:space:]' < "$TOKEN_FILE")"
  if [ -z "$token" ]; then
    echo "NPM token file is empty: $TOKEN_FILE" >&2
    exit 2
  fi
  {
    printf '%s\n' 'registry=https://registry.npmjs.org/'
    printf '%s%s\n' '//registry.npmjs.org/:_authToken=' "$token"
  } > "$USERCONFIG"
  unset token
  export NPM_CONFIG_USERCONFIG="$USERCONFIG"
  export npm_config_userconfig="$USERCONFIG"
fi

cd "$ROOT_DIR"
NX_NO_CLOUD=true NX_DAEMON=false yarn -s nx build forged --skip-nx-cache

cd "$ROOT_DIR/dist/libs/forged"
chmod +x src/bin/forged.js src/bin/remixd.js

if [ -n "$PACKAGE_NAME_OVERRIDE" ]; then
  node -e "const fs=require('fs'); const p='package.json'; const pkg=JSON.parse(fs.readFileSync(p,'utf8')); pkg.name=process.argv[1]; fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n')" "$PACKAGE_NAME_OVERRIDE"
fi

publish_args=(publish --access public --ignore-scripts --registry https://registry.npmjs.org/)
if [ -n "${FORGED_NPM_OTP:-${NPM_OTP:-}}" ]; then
  publish_args+=(--otp "${FORGED_NPM_OTP:-${NPM_OTP:-}}")
fi

"$NPM_BIN" "${publish_args[@]}"

cd "$ROOT_DIR"
yarn -s bumpVersion:forged
