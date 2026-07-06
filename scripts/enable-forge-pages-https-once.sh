#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HOSTNAME="${FORGE_PAGES_HOSTNAME:-forge.creditchain.org}"
ZONE_NAME="${FORGE_ZONE_NAME:-creditchain.org.}"
REPO="${FORGE_GITHUB_REPO:-openibank/openibank.github.io}"
PAGES_REPO_DIR="${FORGE_PAGES_REPO_DIR:-${FORGE_GITHUB_PAGES_REPO_DIR:-$ROOT_DIR/../openibank.github.io}}"
PAGES_BRANCH="${FORGE_PAGES_BRANCH:-main}"
PAGES_PATH="${FORGE_PAGES_PATH:-/}"

token_from_remote() {
  for repo_dir in "$PAGES_REPO_DIR" "$ROOT_DIR"; do
    git -C "$repo_dir" remote get-url origin 2>/dev/null | sed -nE 's#https://([^@]+)@github.com/.*#\1#p'
  done | sed -n '1p'
}

GITHUB_TOKEN_VALUE="${FORGE_GITHUB_TOKEN:-${GITHUB_TOKEN:-$(token_from_remote)}}"

if [ -z "$GITHUB_TOKEN_VALUE" ]; then
  echo "GitHub token unavailable. Set FORGE_GITHUB_TOKEN or use an authenticated origin remote." >&2
  exit 2
fi

echo "== Forge Pages HTTPS enable check =="
echo "host: $HOSTNAME"

if command -v aws >/dev/null 2>&1; then
  zone_id="$(
    aws route53 list-hosted-zones-by-name \
      --dns-name "$ZONE_NAME" \
      --query "HostedZones[?Name=='$ZONE_NAME'].Id | [0]" \
      --output text 2>/dev/null | sed 's#/hostedzone/##' || true
  )"
  if [ -n "$zone_id" ] && [ "$zone_id" != "None" ]; then
    record_types="$(
      aws route53 list-resource-record-sets \
        --hosted-zone-id "$zone_id" \
        --query "ResourceRecordSets[?Name=='$HOSTNAME.'].Type" \
        --output text
    )"
    echo "Route 53 record types: ${record_types:-none}"
    if printf '%s\n' "$record_types" | grep -Eq '(^|[[:space:]])(A|AAAA)([[:space:]]|$)'; then
      echo "Refusing to enable HTTPS: authoritative A/AAAA records exist for $HOSTNAME." >&2
      echo "Use only a CNAME to openibank.github.io for this subdomain." >&2
      exit 2
    fi
  else
    echo "Could not discover hosted zone for $ZONE_NAME; continuing with GitHub Pages check only."
  fi
fi

pages_json="$(mktemp)"
response_json=""
trap 'rm -f "$pages_json" "$response_json"' EXIT
curl -sS \
  -H "Authorization: Bearer $GITHUB_TOKEN_VALUE" \
  -H 'Accept: application/vnd.github+json' \
  -H 'X-GitHub-Api-Version: 2022-11-28' \
  "https://api.github.com/repos/$REPO/pages" > "$pages_json"

status="$(node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('$pages_json','utf8')); console.log(p.status || '')")"
cname="$(node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('$pages_json','utf8')); console.log(p.cname || '')")"
https_enforced="$(node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('$pages_json','utf8')); console.log(String(!!p.https_enforced))")"

echo "GitHub Pages status: $status"
echo "GitHub Pages cname: $cname"
echo "HTTPS enforced: $https_enforced"

if [ "$cname" != "$HOSTNAME" ]; then
  echo "Refusing to enable HTTPS: GitHub Pages cname is '$cname', expected '$HOSTNAME'." >&2
  exit 2
fi

if [ "$https_enforced" = "true" ]; then
  echo "HTTPS is already enforced."
  exit 0
fi

response_json="$(mktemp)"
http_status="$(
  curl -sS -o "$response_json" -w '%{http_code}' \
    -X PUT \
    -H "Authorization: Bearer $GITHUB_TOKEN_VALUE" \
    -H 'Accept: application/vnd.github+json' \
    -H 'X-GitHub-Api-Version: 2022-11-28' \
    "https://api.github.com/repos/$REPO/pages" \
    -d "{\"source\":{\"branch\":\"$PAGES_BRANCH\",\"path\":\"$PAGES_PATH\"},\"cname\":\"$HOSTNAME\",\"https_enforced\":true}"
)"

if [ "$http_status" = "204" ]; then
  echo "HTTPS enforcement enabled."
  exit 0
fi

echo "HTTPS enforcement not enabled. GitHub returned HTTP $http_status:"
sed -n '1,120p' "$response_json"
echo
echo "If the message says the certificate does not exist yet, wait for GitHub Pages certificate provisioning and run this command once later."
exit 1
