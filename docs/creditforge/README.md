# CreditForge Consolidation

CreditForge is now consolidated into the Forge monorepo as the CreditChain
product, infrastructure, and API blueprint for the rebranded IDE.

The standalone `/Users/wenyan/ClaudeProjects/creditforge` prototype contributed:

- product, architecture, API, privacy, security, and go-to-market docs;
- CreditChain and EVM network metadata;
- ForgeAgent tool, approval, and safety policy definitions;
- source import, license, admin-power, and deployment checklist helpers;
- CreditHouse starter templates for CreditChain smart contracts;
- a dependency-free Foundry lifecycle example;
- Route 53, nginx, and Maple deployment automation for `forge.creditchain.org`.

## Monorepo Locations

- Forge IDE: `apps/remix-ide`
- CreditChain config and SDK helpers: `libs/forge/creditchain-config`
- Forge local daemon package: Nx project `forged`, published as `@creditchain/forged`
- Workspace templates: `libs/remix-ws-templates/src/templates`
- Template selector UI: `apps/remix-ide/src/app/plugins/templates-selection`
- Lifecycle example: `examples/creditchain-lifecycle`
- GitHub Pages deploy script: `scripts/deploy-forge-github-pages.sh`
- Maple deploy script: `scripts/deploy-forge-maple.sh`
- DNS script: `scripts/route53-upsert-forge-suite.sh`
- Static nginx config: `infra/forge/nginx/forge.creditchain.org.conf`
- Route 53 Terraform: `infra/forge/terraform/route53-forge.tf`

## Local Forge Build

```bash
cd /Users/wenyan/ClaudeProjects/forge
source ~/.nvm/nvm.sh
nvm use 20.19.0
NX_NO_CLOUD=true NX_DAEMON=false yarn -s nx build remix-ide --configuration=development
```

Production build:

```bash
yarn -s build:production
```

## Public Deployment

Forge is intended to publish the IDE at:

- `https://forge.creditchain.org`

Service hostnames used by config and DNS helpers:

- `https://api.forge.creditchain.org`
- `https://rpc.forge.creditchain.org`
- `https://ai.forge.creditchain.org`
- `https://indexer.forge.creditchain.org`

Route 53 helper:

```bash
./scripts/route53-upsert-forge-suite.sh
```

GitHub Pages deployment:

```bash
yarn deploy:forge:pages
```

The Pages deploy publishes `dist/apps/remix-ide` into
`/Users/wenyan/ClaudeProjects/openibank.github.io`, commits it, and pushes the
`main` branch for `forge.creditchain.org`.

Forge daemon package:

```bash
yarn nx build forged
cd dist/libs/forged
npm publish --access public
```

The public command is `forged`; `remixd` remains as a compatibility alias.

GitHub Pages status and HTTPS helpers:

```bash
yarn pages:forge:status
yarn pages:forge:enable-https
```

`pages:forge:enable-https` is intentionally single-shot. Run it only if HTTPS is
disabled after a future custom-domain change and GitHub has issued the
certificate.

Maple/nginx helper, run on the deployment host:

```bash
FORGE_BUILD=1 ./scripts/deploy-forge-maple.sh
```

The deploy helper builds `dist/apps/remix-ide`, installs a versioned static
release under `/var/www/forge-creditchain`, writes a `CNAME`, renders nginx from
`infra/forge/nginx/forge.creditchain.org.conf`, and reloads nginx.

## Lifecycle Example

```bash
./scripts/creditchain-lifecycle-smoke.sh
cd examples/creditchain-lifecycle
forge test -vv
forge build
```

The smoke script compiles/tests the example, reads CreditChain RPC state from
`https://rpc.creditchain.org`, and checks `scan.creditchain.org` plus
`browser.creditchain.org`.
