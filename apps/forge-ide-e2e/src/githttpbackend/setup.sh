#!/bin/bash
set -e

cd /tmp/
rm -rf git/bare.git
rm -rf git/bare2.git
rm -rf git
mkdir -p git
cd git

git config --global user.name "ci-bot"
git config --global user.email "ci-bot@creditchain.org"

git clone --bare https://github.com/openibank/forge bare.git
git clone --bare https://github.com/openibank/forge bare2.git
