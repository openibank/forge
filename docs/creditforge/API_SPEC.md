# CreditForge API Spec

Base local API URL: `http://127.0.0.1:8080`

## Health

`GET /health`

```json
{ "service": "creditforge-api", "status": "ok", "version": "0.1.0" }
```

## Projects And Keys

`POST /api/projects`

```json
{ "name": "Treasury Token", "chain_slug": "creditchain-testnet" }
```

`GET /api/projects`

`GET /api/projects/:id`

`POST /api/projects/:id/api-keys`

```json
{ "name": "Local test key" }
```

Response includes `secret_once`. The full key must never be shown again after
creation. Production storage must persist only `key_hash` and `key_prefix`.

`GET /api/projects/:id/usage`

## Contract Search And Import

`POST /api/contracts/search`

```json
{
  "query": "0x000000000000000000000000000000000000cF01",
  "chain_slug": "creditchain-testnet"
}
```

Search inputs include EVM address, transaction hash, explorer URL, GitHub URL,
npm package, contract name, ABI, bytecode, function selector, event signature,
and natural-language query.

Ranking order:

1. Exact verified source with matching bytecode.
2. Sourcify full match.
3. Explorer verified source.
4. GitHub official protocol repository.
5. npm official package.
6. Similar source match.
7. Decompiled approximation.

`POST /api/contracts/import`

Returns workspace ID, source status, license, project format, files, and
diagnostics.

`GET /api/contracts/:id`

`GET /api/contracts/:id/source`

`GET /api/contracts/:id/abi`

`GET /api/contracts/:id/analysis`

## Workspaces

`POST /api/workspaces`

```json
{ "project_id": "00000000-0000-0000-0000-000000000001", "name": "Imported USDC Fork" }
```

`GET /api/workspaces`

`GET /api/workspaces/:id`

`GET /api/workspaces/:id/files`

`PUT /api/workspaces/:id/files`

`POST /api/workspaces/:id/snapshot`

`POST /api/workspaces/:id/compile`

`POST /api/workspaces/:id/test`

`POST /api/workspaces/:id/security-scan`

## ForgeAgent

`POST /api/workspaces/:id/ai/chat`

```json
{ "message": "Add a treasury fee and write tests." }
```

`POST /api/workspaces/:id/ai/patch`

`GET /api/ai/sessions/:id`

Tool categories:

- workspace: read, write, patch, list files.
- build: compile, test, fuzz, gas estimate.
- security: Slither, storage layout, access control, upgradeability.
- deploy: simulate, deploy, verify.
- generation: docs, frontend SDK.

`GET /api/agents/capabilities`

Returns the machine-readable ForgeAgent loop, tool capability names, approval
levels, risk classes, and non-negotiable safety rules for AI clients.

## Deployments

`POST /api/workspaces/:id/deploy/simulate`

`POST /api/workspaces/:id/deploy`

`POST /api/deployments/:id/verify`

`GET /api/deployments`

`GET /api/deployments/:id`

Deployment requests to mainnet or production require explicit human approval.

## RPC Gateway

Base local RPC URL: `http://127.0.0.1:8081`

`POST /v1/:apiKey`

`POST /v1/:apiKey/:chain`

`POST /v1/:apiKey/custom/:chainId`

Example:

```json
{ "jsonrpc": "2.0", "id": 1, "method": "eth_chainId", "params": [] }
```

Supported chain slugs:

- `creditchain-mainnet`
- `creditchain-testnet`
- `ethereum`
- `polygon`
- `base`
- `arbitrum`
- `optimism`
- `bsc`
- `custom/:chainId`

## Webhooks

`POST /api/webhooks`

`GET /api/webhooks`

`GET /api/webhooks/:id`

`DELETE /api/webhooks/:id`

`GET /api/webhooks/:id/deliveries`

`POST /api/webhooks/:id/test`

Webhook types include address activity, mined transaction, dropped transaction,
contract event, token transfer, NFT transfer, new block, security alert,
contract upgrade, admin function called, large transfer, and custom ABI event.

## Growth And News

`GET /api/growth/plans`

Returns the free-first builder plan, pro team plan, and enterprise cloud plan.

`GET /api/news/sources`

Returns the public news sources used by the News Center. The web News Center at
`/news` fetches, normalizes, caches, and attributes RSS feed items without
copying full articles.
