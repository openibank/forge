# CreditForge Security Model

## Source And License Truth

CreditForge must never imply that deployed contract source is always public. EVM
bytecode is public, but human-readable Solidity/Vyper source is available only
when verified or published by an explorer, Sourcify, Blockscout, GitHub, npm,
CreditChain explorer, or another source provider.

Every imported contract has a source status:

- public bytecode
- verified source code
- decompiled approximation
- open-source licensed source
- source visible but license-restricted
- unknown license

License must be shown before fork, copy, modification, or redeployment. Unknown,
BUSL, AGPL, restrictive, or `UNLICENSED` source can be analyzed, but
modification and redeployment must surface warnings.

## API Keys

- Key formats: `cc_test_...` and `cc_live_...`.
- Full API key is shown only once after creation.
- Persist only a secure hash and prefix.
- Separate test and live keys.
- Support rotation, revocation, quota, method allow/deny policy, and audit logs.

## Secrets

- Never ask for seed phrases.
- Never log private keys.
- Never persist private keys in plaintext.
- Signed transaction logging must be metadata-only.
- Mainnet signing must use wallet signing, multisig, or explicit encrypted
  signing policy controlled by the user.

## Sandbox

Builds, tests, fuzzing, scanner runs, and AI-modified code execution are outside
the API process.

MVP sandbox:

- Docker runtime.
- Workspace-only mount.
- No host filesystem access.
- No network by default.
- CPU, memory, and wall-clock limits.
- Dependency fetch allowed only by explicit policy.
- Log redaction.
- Artifact capture.
- Cleanup after job.

Future sandbox:

- Firecracker or another microVM runtime.
- Per-job identity, network egress policy, and signed artifact provenance.

## ForgeAgent Safety

ForgeAgent is tool-driven and approval-aware.

Rules:

- Never hide privileged functions.
- Never silently add mint authority.
- Never silently add blacklist/freeze authority.
- Never silently add upgrade admin.
- Never silently change token economics.
- Never silently alter fee recipients.
- Never deploy to mainnet without explicit user confirmation.
- Always explain owner/admin powers before deployment.
- Always explain upgradeability risk.
- Always distinguish verified source from decompiled source.

## Deployment Approvals

Before deployment, CreditDeploy shows:

- chain
- contract name
- compiler version
- constructor args
- admin address
- treasury address
- proxy admin
- mint authority
- pause/freeze authority
- upgrade authority
- license status
- security score
- test result
- estimated gas
- verification target

Mainnet and production deployment require explicit approval every time.

## Abuse Protection

CreditRPC must support per-project limits, team quotas, method allow/deny lists,
request logging, upstream failover, signed transaction metadata redaction, and
abuse detection for high-risk methods.
