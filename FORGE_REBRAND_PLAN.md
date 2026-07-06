# Forge Rebrand Plan

Forge is the CreditChain-native smart contract development cloud, forked from Ethereum Remix.

## Branding Rules

User-facing names:

- Remix IDE -> Forge
- Remix Project -> Forge Project
- Ethereum Remix -> Forge by CreditChain
- remix.ethereum.org -> forge.creditchain.org

Internal names to keep during phase 1:

- `@remix-project/*`
- `@remixproject/*`
- `remix-ide`
- `remix-lib`
- `remix-plugin`
- `remix-solidity`
- `RemixUi*` component and package symbols

Keeping these internals stable lets Forge continue to pull upstream Remix changes without breaking the monorepo.

## Primary Identity

- Product: Forge
- Alias: CreditForge
- Domain: https://forge.creditchain.org
- Repository: https://github.com/openibank/forge
- Organization: OpeniBank / CreditChain
- Positioning: AI-native smart contract studio for CreditChain

## Product Pillars

1. CreditChain-native EVM development
2. Verified contract search and import
3. AI-assisted Solidity engineering
4. Secure audit, test, deployment, and verification
5. Contract Passport and trust-score infrastructure

## Phase 1 Scope

- Browser title, metadata, splash, favicon, top bar, and home tab say Forge.
- Add a Forge logo placeholder that can be replaced by final brand assets.
- Add CreditChain network config placeholders.
- Add CreditChain template group and first native template.
- Add docs and env placeholders.
- Do not recursively rename internal Remix packages.

## Out Of Scope For Phase 1

- Renaming Nx projects and package namespaces.
- Rewriting all non-English translations.
- Replacing every historical Remix doc reference.
- Deploying backend services.
- Real CreditChain chain IDs/RPC/explorer values until infrastructure confirms them.
