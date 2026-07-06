# CreditForge Getting Started

CreditForge supports a guest-first workflow for blockchain smart contract work:

1. Open `https://forge.creditchain.org`.
2. Choose a chain. CreditChain is first-class; popular EVM chains are available as adapters.
3. Import a verified address, explorer URL, GitHub repository URL, or template.
4. Reconstruct a Foundry workspace.
5. Ask ForgeAgent to plan a change.
6. Approve workspace writes, then compile and test.
7. Run CreditBeacon before deployment.
8. Simulate deployment, then deploy with a keystore or CI signer.
9. Verify source and enable monitoring/webhooks.

No private keys or seed phrases should be pasted into Forge. Use Foundry
keystore accounts, CI signing, or a wallet flow for deployment.

## CreditStudio Workspaces

The main `forge.creditchain.org` console behaves like a browser IDE:

- open files as tabs, close tabs, and reopen recently closed tabs;
- close and reopen terminal, Beacon, deploy, and agent docks;
- use online sandbox mode for guest work;
- import public GitHub repositories without signup;
- connect a local folder only after browser permission is granted.

Local workspace permission uses the browser File System Access flow. Forge
should not read local files until the user explicitly grants that permission.

## Function Pages

Major Forge functions also have direct pages:

```text
https://forge.creditchain.org/modules/creditrpc
https://forge.creditchain.org/modules/creditsearch
https://forge.creditchain.org/modules/sourcepull
https://forge.creditchain.org/modules/forgeagent
https://forge.creditchain.org/modules/creditbeacon
https://forge.creditchain.org/modules/creditdeploy
https://forge.creditchain.org/modules/credithouse
https://forge.creditchain.org/modules/creditindex
```

## Guest Repositories

Public GitHub repositories can be imported without registration:

```bash
creditforge github import https://github.com/openibank/creditforge --guest
```

Private repositories require one of:

- a fine-grained repo token from private config or CI secrets;
- a GitHub App installation on selected repos;
- an SSH deploy key mounted only in the worker environment.

ForgeAgent should create branches and pull requests, not force-push to a user's
default branch.

## Live Endpoints

```bash
curl https://api.forge.creditchain.org/health
curl https://api.forge.creditchain.org/api/github/setup
curl https://api.forge.creditchain.org/api/chains
curl https://rpc.forge.creditchain.org/v1/dev/creditchain \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```
