#!/bin/bash

set -e
SHA=`git rev-parse --short --verify HEAD`
PAGES_REPO="${FORGE_BETA_PAGES_REPO:-git@github.com:openibank/forge-beta.git}"
PAGES_BRANCH="${FORGE_PAGES_BRANCH:-gh-pages}"

# this gh action is used to deploy the Forge beta build to GitHub Pages
mkdir -p dist/apps/remix-ide/.github/workflows
cp apps/remix-ide/ci/gh-actions-deploy.yml dist/apps/remix-ide/.github/workflows

cd dist/apps/remix-ide

git init
git checkout -b "$PAGES_BRANCH"
git config user.name "$COMMIT_AUTHOR"
git config user.email "$COMMIT_AUTHOR_EMAIL"

echo "# Automatic build" > README.md
echo "Built Forge beta from \`$SHA\`. See https://github.com/openibank/forge/ for details." >> README.md
echo "To use an offline copy, download \`forge-beta-$SHA.zip\`." >> README.md

zip -r forge-beta-$SHA.zip .
git add .
git commit -m "Built Forge beta from {$SHA}."

git push -f "$PAGES_REPO" "$PAGES_BRANCH"
