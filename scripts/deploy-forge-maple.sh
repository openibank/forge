#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SITE_NAME="${FORGE_SITE_NAME:-forge.creditchain.org.conf}"
DEPLOY_ROOT="${FORGE_DEPLOY_ROOT:-/var/www/forge-creditchain}"
NGINX_AVAILABLE="${FORGE_NGINX_AVAILABLE:-/etc/nginx/sites-available}"
NGINX_ENABLED="${FORGE_NGINX_ENABLED:-/etc/nginx/sites-enabled}"
ACME_ROOT="${FORGE_ACME_ROOT:-/var/www/_acme}"
CERT_NAME="${FORGE_CERT_NAME:-creditchain.org}"
CERT_DOMAINS=(
  -d creditchain.org
  -d www.creditchain.org
  -d docs.creditchain.org
  -d scan.creditchain.org
  -d browser.creditchain.org
  -d forge.creditchain.org
  -d api.forge.creditchain.org
  -d rpc.forge.creditchain.org
  -d ai.forge.creditchain.org
  -d indexer.forge.creditchain.org
)

SUDO=()
if [ "$(id -u)" -ne 0 ]; then
  SUDO=(sudo)
fi

require() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "$1 is required on the deployment host" >&2
    exit 2
  }
}

escape_sed() {
  printf '%s' "$1" | sed 's/[\/&]/\\&/g'
}

require nginx
require rsync
if [ "${FORGE_EXPAND_CERT:-0}" = "1" ]; then
  require certbot
fi
if [ "${FORGE_BUILD:-1}" = "1" ]; then
  require yarn
fi

echo "== Forge Maple deploy =="
echo "repo: $ROOT_DIR"

echo "== 1/6 build =="
if [ "${FORGE_BUILD:-1}" = "1" ]; then
  (
    cd "$ROOT_DIR"
    NX_NO_CLOUD=true NX_DAEMON=false NX_PARALLEL=2 MINIFIER_PARALLEL=2 NODE_ENV=production yarn -s build:production
  )
else
  echo "Skipping build. Set FORGE_BUILD=1 to build before deployment."
fi

if [ ! -f "$ROOT_DIR/dist/apps/forge-ide/index.html" ]; then
  echo "Missing dist/apps/forge-ide/index.html. Build Forge before deployment." >&2
  exit 2
fi

SHA="$(cd "$ROOT_DIR" && git rev-parse --short --verify HEAD 2>/dev/null || date +%Y%m%d%H%M%S)"
RELEASE_DIR="$DEPLOY_ROOT/releases/$SHA"
CURRENT_DIR="$DEPLOY_ROOT/current"

echo "== 2/6 install release $SHA =="
"${SUDO[@]}" install -d -m 0755 "$DEPLOY_ROOT/releases" "$ACME_ROOT"
"${SUDO[@]}" rm -rf "$RELEASE_DIR"
"${SUDO[@]}" install -d -m 0755 "$RELEASE_DIR"
"${SUDO[@]}" rsync -a --delete "$ROOT_DIR/dist/apps/forge-ide/" "$RELEASE_DIR/"
printf 'forge.creditchain.org\n' | "${SUDO[@]}" tee "$RELEASE_DIR/CNAME" >/dev/null
"${SUDO[@]}" ln -sfn "$RELEASE_DIR" "$CURRENT_DIR"

echo "== 3/6 install nginx site =="
"${SUDO[@]}" install -d -m 0755 "$NGINX_AVAILABLE" "$NGINX_ENABLED"
rendered_site="$(mktemp)"
sed \
  -e "s/__FORGE_WEB_ROOT__/$(escape_sed "$CURRENT_DIR")/g" \
  "$ROOT_DIR/infra/forge/nginx/forge.creditchain.org.conf" > "$rendered_site"
"${SUDO[@]}" install -m 0644 "$rendered_site" "$NGINX_AVAILABLE/$SITE_NAME"
rm -f "$rendered_site"
"${SUDO[@]}" ln -sfn "$NGINX_AVAILABLE/$SITE_NAME" "$NGINX_ENABLED/$SITE_NAME"

echo "== 4/6 nginx syntax check before cert =="
"${SUDO[@]}" nginx -t
if [ "${FORGE_EXPAND_CERT:-0}" = "1" ]; then
  "${SUDO[@]}" systemctl reload nginx
fi

echo "== 5/6 certificate =="
if [ "${FORGE_EXPAND_CERT:-0}" = "1" ]; then
  "${SUDO[@]}" certbot certonly \
    --non-interactive \
    --webroot -w "$ACME_ROOT" \
    --cert-name "$CERT_NAME" \
    --expand \
    --keep-until-expiring \
    "${CERT_DOMAINS[@]}"
else
  echo "Skipping certbot by default. Set FORGE_EXPAND_CERT=1 after DNS points at this host."
fi

echo "== 6/6 reload nginx =="
"${SUDO[@]}" nginx -t
"${SUDO[@]}" systemctl reload nginx

echo "Forge is installed at $CURRENT_DIR and served as https://forge.creditchain.org."
