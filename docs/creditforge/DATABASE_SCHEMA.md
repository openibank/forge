# CreditForge Database Schema

The initial migration lives at
`infra/postgres/migrations/0001_initial.sql`.

## Identity And Projects

- `users`: account identity.
- `teams`: organization boundary.
- `team_members`: role membership.
- `projects`: developer projects tied to teams and default chains.
- `api_keys`: hashed API keys with prefix, environment, and revocation state.

## RPC

- `chains`: chain metadata, environment keys, capabilities, mainnet flag.
- `rpc_upstreams`: per-chain upstream providers and capability flags.
- `rpc_requests`: request method, status, latency, size, project, API key, chain.
- `rpc_daily_usage`: pre-aggregated quota and dashboard metrics.

## Workspaces And Source

- `workspaces`: CreditStudio workspace state.
- `workspace_files`: editable file content and hashes.
- `workspace_snapshots`: immutable workspace manifests.
- `contracts`: chain/address identity, source status, proxy state, license.
- `contract_sources`: provider, compiler settings, optimizer, metadata.
- `contract_files`: verified imported source files.
- `contract_abis`: ABI JSON and hashes.
- `contract_analysis`: storage layout, selectors, admin powers, risk summary.

## Build, Test, Security, Deploy

- `builds`: sandboxed compile runs.
- `test_runs`: sandboxed test/fuzz runs.
- `security_reports`: normalized CreditBeacon report.
- `security_findings`: report findings with severity and confidence.
- `deployments`: CreditDeploy deployment records.
- `deployment_events`: deployment lifecycle audit log.
- `contract_deployments`: contract-level deployed address records.
- `contract_verifications`: explorer/Sourcify/CreditChain verification status.

## Indexing And Webhooks

- `indexed_blocks`: canonical block ingestion.
- `indexed_transactions`: transaction history.
- `indexed_logs`: logs, topics, decoded data.
- `tokens`: ERC20/ERC721/ERC1155 contract metadata.
- `token_transfers`: ERC20 transfer stream.
- `nft_transfers`: ERC721/ERC1155 transfer stream.
- `address_balances`: token balance snapshots.
- `webhooks`: webhook definitions and HMAC configuration.
- `webhook_deliveries`: attempts, retries, responses, and delivery status.

## AI And Templates

- `ai_sessions`: provider/model session state.
- `ai_messages`: system/user/assistant/tool transcript.
- `ai_tool_calls`: tool inputs, outputs, approval level, status.
- `templates`: CreditHouse registry metadata.
- `template_files`: template source/test/script/readme content.

## Key Indexes

- `contracts(chain_id, address)`
- `api_keys(key_hash)`
- `rpc_requests(project_id, created_at)`
- `rpc_requests(chain_id, method)`
- `workspace_files(workspace_id)`
- `builds(workspace_id, created_at)`
- `test_runs(workspace_id, created_at)`
- `security_reports(workspace_id, created_at)`
- `deployments(project_id, created_at)`
- `indexed_blocks(chain_id, block_number)`
- `indexed_transactions(tx_hash)`
- `indexed_logs(topic0)`
- `webhooks(status)`
- `webhook_deliveries(status)`
