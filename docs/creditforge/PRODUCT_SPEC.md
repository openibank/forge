# CreditForge Product Spec

## Vision

CreditForge makes CreditChain the easiest EVM-compatible chain to build on. It
turns any verified smart contract, repository, ABI, bytecode, or natural-language
product idea into a secure, testable, deployable, verifiable, monitored EVM app.

CreditForge is not a Remix clone, a Foundry web UI, an RPC provider, or an AI
chatbot. It is an integrated smart contract engineering cloud.

## Personas

- Protocol founder: wants to modify a verified contract, understand admin powers,
  and deploy safely to CreditChain testnet/mainnet.
- Smart contract engineer: wants Foundry-grade build/test workflows in the
  browser with GitHub import/export.
- Security reviewer: wants source provenance, license status, admin-risk and
  upgradeability visibility, normalized findings, and deployment blockers.
- App developer: wants RPC keys, webhooks, indexed APIs, ABIs, SDK clients, and
  read/write contract panels.
- CreditChain operator: wants more developers shipping verified, monitored,
  CreditChain-native contracts.

## Primary Workflow

1. Create project.
2. Create API key.
3. Import contract by address, URL, ABI, bytecode, GitHub, npm, or query.
4. Show source status: verified source, public bytecode, decompiled
   approximation, open-source license, restricted license, unknown license.
5. Reconstruct a Foundry workspace.
6. Explain architecture, admin powers, proxy risk, and license risk.
7. Patch code through ForgeAgent.
8. Compile and test in a sandbox.
9. Run CreditBeacon security checks.
10. Simulate deployment.
11. Require explicit approval for deployment and all mainnet actions.
12. Verify source and monitor deployed contract.

## Pages

- Overview: projects, API usage, RPC health, deployments, security status.
- CreditStudio: file tree, Monaco editor, terminal, agent, findings, deploy panel.
- CreditSearch: universal search/import for source, ABI, bytecode, selectors.
- CreditRPC: keys, routes, quotas, upstream health, logs, latency, errors.
- CreditBeacon: reports, findings, blockers, admin powers, upgrade risk.
- CreditDeploy: deployments, verification, ABI, read/write, events, upgrades.
- CreditHouse: templates, protocol library, one-click workspace creation.
- Webhooks: event subscriptions, deliveries, retries, HMAC signatures.
- Settings: team, billing placeholder, keys, audit log.
- News Center: live market/news signal aggregation, hot topics, and AI-agent
  builder actions.

## MVP Scope

- Monorepo and local dev scripts.
- Forge IDE shell with Monaco.
- Rust Axum API endpoint scaffold.
- Rust RPC gateway route scaffold.
- PostgreSQL schema.
- CreditChain config and SDK packages.
- SourcePull manifest model and license classifier.
- ForgeAgent tool registry and safety rules.
- CreditBeacon report shape.
- CreditDeploy checklist model.
- CreditHouse starter templates.
- Machine-readable ForgeAgent capability manifest.
- Free-first growth plans.
- News Center and market-intelligence page.
- Route 53 DNS automation for `forge.creditchain.org`.

## Roadmap

- Phase 1: persist projects/API keys and hash keys.
- Phase 2: implement RPC proxy, quota, method policy, cache, logging, failover.
- Phase 3: implement Etherscan-compatible and Sourcify source import.
- Phase 4: persist workspaces and support zipped Foundry exports.
- Phase 5: run Foundry compile/test in Docker.
- Phase 6: add ForgeAgent provider abstraction and tool executor.
- Phase 7: integrate Slither, Foundry fuzzing, and AI review.
- Phase 8: add wallet-based CreditChain testnet deployment and verification.
- Phase 9: expand CreditHouse templates and CreditChain standard library.
- Phase 10: add indexing, webhooks, and event monitoring.
- Public launch: publish `forge.creditchain.org`, expand news intelligence,
  start developer acquisition through templates, docs, and free testnet RPC.
