# CreditForge Agent Protocol

CreditForge exposes a workflow that AI agents can use without guessing local
project structure or bypassing safety policy.

## Agent Loop

1. Understand the request.
2. Inspect source, ABI, license, proxy, and admin powers.
3. Plan minimal changes.
4. Patch workspace files.
5. Compile in a sandbox.
6. Run tests and fuzzing.
7. Run CreditBeacon.
8. Simulate deployment.
9. Request human approval where required.
10. Deploy, verify, monitor, and generate docs.

## Machine-Readable Surfaces

- `GET /api/agents/capabilities`
- `GET /api/templates`
- `POST /api/contracts/search`
- `POST /api/contracts/import`
- `GET /api/workspaces/:id/files`
- `PUT /api/workspaces/:id/files`
- `POST /api/workspaces/:id/compile`
- `POST /api/workspaces/:id/test`
- `POST /api/workspaces/:id/security-scan`
- `POST /api/workspaces/:id/deploy/simulate`
- `GET /api/chains`
- `GET /api/github/setup`
- `POST /api/github/repositories/import`
- `GET /learn`
- `GET /lifecycle`
- `GET /modules/:slug`
- `./scripts/creditchain-lifecycle-smoke.sh`

## Approval Levels

- `never`: read-only or safe analysis.
- `workspace-write`: writes files inside a workspace sandbox.
- `human-testnet-approval`: deploys to a testnet after explicit approval.
- `explicit-mainnet-approval`: production/mainnet action; approval is required
  every time.

## Non-Negotiable Safety

- Never request seed phrases.
- Never log private keys.
- Never read local directories without explicit browser/user permission.
- Never silently add privileged roles.
- Never hide mint, freeze, blacklist, pause, upgrade, or treasury powers.
- Always disclose source status and license status.
- Always disclose proxy and upgradeability risk.
- Always block mainnet deployment until explicit human approval.

## Real Chain Smoke

Agents can verify CreditChain availability without touching secrets:

```bash
./scripts/creditchain-lifecycle-smoke.sh
```

This performs local Foundry tests, reads chain ID/block height/client version,
checks scan/browser availability, and optionally verifies deployed bytecode when
`CREDITFORGE_CONTRACT_ADDRESS` is provided.
