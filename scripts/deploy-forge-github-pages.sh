#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PAGES_REPO_DIR="${FORGE_PAGES_REPO_DIR:-${FORGE_GITHUB_PAGES_REPO_DIR:-$ROOT_DIR/../openibank.github.io}}"
DIST_DIR="${FORGE_DIST_DIR:-$ROOT_DIR/dist/apps/forge-ide}"
HOSTNAME="${FORGE_PAGES_HOSTNAME:-forge.creditchain.org}"
BUILD="${FORGE_BUILD:-0}"

if [ "$BUILD" = "1" ]; then
  (cd "$ROOT_DIR" && yarn -s build:production)
fi

if [ ! -d "$DIST_DIR" ]; then
  echo "Build artifact not found at $DIST_DIR. Run yarn build:production first or set FORGE_BUILD=1." >&2
  exit 2
fi

if [ ! -d "$PAGES_REPO_DIR/.git" ]; then
  echo "Pages repo not found at $PAGES_REPO_DIR. Clone openibank/openibank.github.io first or set FORGE_PAGES_REPO_DIR." >&2
  exit 2
fi

if [ "${FORGE_PAGES_SKIP_REMOTE_CHECK:-0}" != "1" ]; then
  remote_url="$(git -C "$PAGES_REPO_DIR" remote get-url origin 2>/dev/null || true)"
  case "$remote_url" in
    *openibank.github.io*) ;;
    *)
      echo "Refusing to deploy: $PAGES_REPO_DIR origin does not look like openibank.github.io." >&2
      echo "Set FORGE_PAGES_SKIP_REMOTE_CHECK=1 to override." >&2
      exit 2
      ;;
  esac
fi

# Source maps are useful during local development, but they add hundreds of
# megabytes to the Pages artifact and are not required by the production app.
rsync -a --delete --exclude='.git/' --exclude='*.map' "$DIST_DIR/" "$PAGES_REPO_DIR/"
find "$PAGES_REPO_DIR" -path "$PAGES_REPO_DIR/.git" -prune -o -type f -name '*.map' -delete

printf '%s\n' "$HOSTNAME" > "$PAGES_REPO_DIR/CNAME"
touch "$PAGES_REPO_DIR/.nojekyll"
cat > "$PAGES_REPO_DIR/README.md" <<EOF
# Forge

Static Forge production build for https://${HOSTNAME}.

Source repository: https://github.com/openibank/forge
Deployment repository: https://github.com/openibank/openibank.github.io
EOF

git -C "$PAGES_REPO_DIR" add -A
if git -C "$PAGES_REPO_DIR" diff --cached --quiet; then
  echo "No Pages deployment changes to commit."
else
  git -C "$PAGES_REPO_DIR" commit -m "Deploy Forge to ${HOSTNAME}"
  git -C "$PAGES_REPO_DIR" push origin HEAD
fi

echo "Forge Pages artifact is published from $PAGES_REPO_DIR."
