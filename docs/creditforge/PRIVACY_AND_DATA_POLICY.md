# CreditForge Privacy And Data Policy

CreditForge handles developer source code, API keys, deployment metadata, and
security findings. The default product posture is minimal collection, clear
separation of secrets, and no accidental public disclosure.

## Never Store

- Seed phrases.
- Plaintext private keys.
- Full API keys after creation.
- Unredacted signed transactions beyond required operational metadata.
- Provider secrets in source control.

## Store With Care

- Workspace source and generated patches.
- ABI, bytecode hash, compiler metadata, and license status.
- Security reports and admin-power findings.
- Deployment history and verification status.
- RPC request metadata, not sensitive payloads.

## Public Surfaces

Public pages such as `forge.creditchain.org` and `/news` must not expose:

- private workspace source;
- API keys;
- team names unless intentionally public;
- wallet secrets;
- non-public audit findings;
- unpublished deployment plans.

## AI Policy

AI providers receive only the minimum workspace context needed for a task.
Provider calls must be logged at metadata level, with secret redaction and clear
tenant/project boundaries.
