#!/bin/bash

set -e
SHA=`git rev-parse --short --verify HEAD`
PAGES_REPO="${FORGE_PAGES_REPO:-git@github.com:openibank/forge.git}"
PAGES_BRANCH="${FORGE_PAGES_BRANCH:-gh-pages}"

# this gh action is used to deploy the Forge build to GitHub Pages
mkdir -p dist/apps/forge-ide/.github/workflows
cp apps/forge-ide/ci/gh-actions-deploy.yml dist/apps/forge-ide/.github/workflows/gh-actions-deploy.yml

cd dist/apps/forge-ide

git init
git checkout -b "$PAGES_BRANCH"
git config user.name "$COMMIT_AUTHOR"
git config user.email "$COMMIT_AUTHOR_EMAIL"

echo "forge.creditchain.org" > CNAME

echo "# Automatic build" > README.md
echo "Built Forge from \`$SHA\`. See https://github.com/openibank/forge/ for details." >> README.md
echo "To use an offline copy, download \`forge-$SHA.zip\`." >> README.md

zip -r forge-$SHA.zip .
git add .
git commit -m "Built Forge from {$SHA}."

git push -f "$PAGES_REPO" "$PAGES_BRANCH"
