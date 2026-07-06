# Forge Roadmap

## Phase 0: Repo Setup

- Push fork to `github.com/openibank/forge`.
- Set default branch to `forge/main`.
- Add upstream remote `remix-upstream` pointing to `remix-project-org/remix-project`.
- Keep small, reviewable feature branches such as `forge/rebrand`, `forge/creditchain-network`, and `forge/ai-agent`.

## Phase 1: Safe Rebrand

- Replace visible Remix branding with Forge.
- Keep Remix internals stable.
- Add Forge logo placeholder and app metadata.
- Add CreditChain network config and docs.
- Add first CreditChain-native templates.
- Validate the web build.

## Phase 2: CreditChain Network Integration

- Confirm CreditChain mainnet/testnet chain IDs.
- Add wallet-add and network-switch flows.
- Add explorer, faucet, verification API, and gas policy metadata.
- Add deployment registry output under `deployments/<network>/<address>.json`.

## Phase 3: Contract Search And Import

- Build `forge-api`.
- Support CreditChain explorer API, Etherscan-compatible APIs, Sourcify, GitHub, and npm sources.
- Import verified source, ABI, compiler settings, optimizer settings, constructor arguments, and proxy metadata.
- Generate clean Foundry and Hardhat workspaces.

## Phase 4: Forge Copilot And Forge Sentinel

- Add CreditChain-focused AI prompts.
- Explain contracts, identify admin risk, generate tests, generate deployment scripts, and suggest safe refactors.
- Add patch preview and explicit user confirmation before any deployment-related action.

## Phase 5: Audit, Test, Deploy, Verify

- Run Solidity compiler, static analyzer, Slither, and Foundry tests.
- Simulate deployment.
- Deploy to CreditChain.
- Verify contracts automatically.
- Publish Contract Passport metadata.

## Phase 6: Developer Cloud

- User accounts, team workspaces, deployment history, API keys, billing, plugin marketplace, App Registry, and enterprise compliance modules.
