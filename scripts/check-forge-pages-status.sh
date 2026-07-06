#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HOSTNAME="${FORGE_PAGES_HOSTNAME:-forge.creditchain.org}"
ZONE_NAME="${FORGE_ZONE_NAME:-creditchain.org.}"
REPO="${FORGE_GITHUB_REPO:-openibank/openibank.github.io}"
PAGES_REPO_DIR="${FORGE_PAGES_REPO_DIR:-${FORGE_GITHUB_PAGES_REPO_DIR:-$ROOT_DIR/../openibank.github.io}}"

token_from_remote() {
  for repo_dir in "$PAGES_REPO_DIR" "$ROOT_DIR"; do
    git -C "$repo_dir" remote get-url origin 2>/dev/null | sed -nE 's#https://([^@]+)@github.com/.*#\1#p'
  done | sed -n '1p'
}

GITHUB_TOKEN_VALUE="${FORGE_GITHUB_TOKEN:-${GITHUB_TOKEN:-$(token_from_remote)}}"

github_api() {
  if [ -z "$GITHUB_TOKEN_VALUE" ]; then
    echo "GitHub token unavailable. Set FORGE_GITHUB_TOKEN or use an authenticated origin remote." >&2
    return 2
  fi
  curl -sS \
    -H "Authorization: Bearer $GITHUB_TOKEN_VALUE" \
    -H 'Accept: application/vnd.github+json' \
    -H 'X-GitHub-Api-Version: 2022-11-28' \
    "https://api.github.com/repos/$REPO/pages"
}

echo "== Forge Pages DNS status =="
echo "host: $HOSTNAME"
echo

echo "Resolver CNAME:"
dig "$HOSTNAME" CNAME +short || true
echo

echo "Resolver A records, expected to resolve through openibank.github.io:"
dig "$HOSTNAME" A +short || true
echo

echo "Resolver AAAA records, expected to resolve through openibank.github.io:"
dig "$HOSTNAME" AAAA +short || true
echo

if command -v aws >/dev/null 2>&1; then
  echo "Route 53 authoritative record sets:"
  zone_id="$(
    aws route53 list-hosted-zones-by-name \
      --dns-name "$ZONE_NAME" \
      --query "HostedZones[?Name=='$ZONE_NAME'].Id | [0]" \
      --output text 2>/dev/null | sed 's#/hostedzone/##' || true
  )"
  if [ -n "$zone_id" ] && [ "$zone_id" != "None" ]; then
    aws route53 list-resource-record-sets \
      --hosted-zone-id "$zone_id" \
      --query "ResourceRecordSets[?Name=='$HOSTNAME.']" \
      --output json
  else
    echo "Could not discover hosted zone for $ZONE_NAME."
  fi
else
  echo "AWS CLI unavailable; skipping Route 53 authoritative check."
fi
echo

echo "GitHub Pages API:"
github_api | sed -n '1,120p' || true
echo

echo "HTTP status:"
curl -I --max-time 20 "http://$HOSTNAME" 2>&1 | sed -n '1,30p' || true
echo

echo "HTTPS status:"
curl -I --max-time 20 "https://$HOSTNAME" 2>&1 | sed -n '1,40p' || true
