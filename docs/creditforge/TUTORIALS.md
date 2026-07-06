# CreditForge Tutorials

The in-app guide at `https://forge.creditchain.org/learn` includes one tutorial
for every core Forge section:

- CreditRPC: call CreditChain and a public EVM chain from one gateway.
- CreditSearch: find verified source from address, explorer, or repository.
- SourcePull: reconstruct a Foundry project from verified source.
- CreditStudio: patch a contract and run Foundry tests.
- ForgeAgent: let the agent add a feature with approvals.
- CreditBeacon: turn static analysis into a deployment decision.
- CreditDeploy: simulate, deploy, verify, and monitor.
- CreditHouse: start from a production-ready template.
- CreditIndex: expose indexed events through APIs and webhooks.

Run the local lifecycle smoke tutorial:

```bash
./scripts/creditchain-lifecycle-smoke.sh
cd examples/creditchain-lifecycle
forge test -vv
```

The tutorial contract is intentionally small and dependency-free so developers
can see the full compile, test, chain smoke, bytecode-check, and explorer-link
loop without exposing secrets.

