# CreditForge Implementation Plan

## Phase 0: Repository Scaffold

- Monorepo structure.
- Forge IDE shell.
- Rust Axum API shell.
- Rust RPC gateway shell.
- Worker shells.
- PostgreSQL migration.
- Docker Compose for Postgres and Redis.
- Shared config, SDK, prompt, importer, analyzer, and deployment packages.

Acceptance: `npm run typecheck` and `cargo check --workspace` pass.

## Phase 1: CreditKeys And Dashboard

- Persist teams, users, projects, API keys.
- Hash API keys.
- Show API key only once.
- Add usage dashboard and quota placeholders.

Acceptance: create/list project and create/revoke API key against Postgres.

## Phase 2: CreditRPC

- Authenticate API keys.
- Add method allow/deny policy.
- Add rate limiting and quotas.
- Route to CreditChain nodes and fallback providers.
- Cache safe methods.
- Record latency, errors, request volume.

Acceptance: JSON-RPC methods proxy through `/v1/:apiKey/:chain` with usage logs.

## Phase 3: CreditSearch And SourcePull

- Etherscan-compatible adapter.
- Sourcify adapter.
- Blockscout adapter.
- GitHub/npm metadata adapter.
- Verified source ranking.
- Foundry workspace reconstruction.
- License warnings and source status UI.

Acceptance: import a verified contract into a compileable Foundry workspace when
metadata and dependencies are available.

## Phase 4: CreditStudio

- Workspace persistence.
- Monaco editor save.
- File tree operations.
- Terminal logs.
- Zip export.
- GitHub import/export placeholder.

Acceptance: create workspace, edit files, snapshot, export zip.

## Phase 5: Foundry Worker

- Docker sandbox.
- `forge build`.
- `forge test`.
- Artifact capture.
- Dependency cache policy.
- Log redaction.

Acceptance: API can compile and test a workspace through worker jobs.

## Phase 6: ForgeAgent

- Provider abstraction.
- Tool-calling executor.
- Approval gates.
- Read/write/patch/compile/test loop.
- Contract explanation and test generation.

Acceptance: agent patches a workspace, compiles, tests, and summarizes risks.

## Phase 7: CreditBeacon

- Slither adapter.
- Foundry fuzzing.
- Admin power analysis.
- Proxy upgrade analysis.
- Risk scoring.
- Founder/operator summary.

Acceptance: normalized security report with findings and blockers appears in UI.

## Phase 8: CreditDeploy

- Testnet deployment simulation.
- Wallet signing flow.
- Constructor arg UI.
- Verification adapters.
- Deployment dashboard.

Acceptance: deploy to CreditChain testnet after explicit approval.

## Phase 9: CreditHouse

- Expand template library.
- One-click workspace creation.
- CreditChain standard contracts.
- Template security and admin-risk metadata.

Acceptance: templates create workspaces with source, tests, scripts, and README.

## Phase 10: CreditIndex And Webhooks

- Block/log ingestion.
- ERC20/ERC721/ERC1155 indexing.
- Address activity.
- Webhook triggers.
- HMAC delivery.
- Retries and logs.

Acceptance: address activity webhook fires from indexed events with delivery log.
