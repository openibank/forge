# AWS DNS For `forge.creditchain.org`

CreditForge is designed to publish the Forge IDE at `forge.creditchain.org`,
the API at `api.forge.creditchain.org`, the RPC gateway at
`rpc.forge.creditchain.org`, and AI/indexer services at
`ai.forge.creditchain.org` and `indexer.forge.creditchain.org`.

## Current Automation

Use the Route 53 helper for the whole Forge suite:

```bash
./scripts/route53-upsert-forge-suite.sh
```

By default the suite keeps the IDE on GitHub Pages and service subdomains on
Maple:

- `forge.creditchain.org CNAME openibank.github.io`
- `api.forge.creditchain.org CNAME maple3.duckdns.org`
- `rpc.forge.creditchain.org CNAME maple3.duckdns.org`
- `ai.forge.creditchain.org CNAME maple3.duckdns.org`
- `indexer.forge.creditchain.org CNAME maple3.duckdns.org`

For the GitHub Pages-hosted IDE, only the `forge.creditchain.org` record should
point to GitHub Pages. You can repair that record directly with:

```bash
FORGE_DNS_NAME=forge.creditchain.org \
FORGE_DNS_TARGET=openibank.github.io \
FORGE_DNS_TYPE=CNAME \
./scripts/route53-upsert-forge.sh
```

Do not add authoritative `A` or `AAAA` records for `forge.creditchain.org` while
it is hosted by GitHub Pages. Resolver `A` and `AAAA` answers are expected
because DNS follows the `openibank.github.io` CNAME.

Optional overrides:

```bash
export FORGE_DNS_NAME="forge.creditchain.org"
export FORGE_ZONE_NAME="creditchain.org."
export FORGE_HOSTED_ZONE_ID="Z..."
export FORGE_AWS_PROFILE="your-profile"
export FORGE_DNS_TYPE="CNAME"
export FORGE_DNS_TTL="300"
export FORGE_PAGES_DNS_TARGET="openibank.github.io"
export FORGE_DNS_TARGET="maple3.duckdns.org"
```

Terraform equivalent:

```bash
terraform -chdir=infra/forge/terraform init
terraform -chdir=infra/forge/terraform apply \
  -var forge_zone_id="Z..." \
  -var forge_dns_target="your-hosting-target.example.com"
```

## Safety

- Do not commit AWS credentials.
- Do not print access keys in logs.
- Use IAM permissions scoped to Route 53 record changes for `creditchain.org`.
- Prefer a CNAME to a managed hosting target for the first public launch.
- Use CloudFront or an ALB when production TLS, WAF, and origin routing are ready.

## Credential Check

Before changing DNS, verify:

```bash
aws sts get-caller-identity
aws route53 list-hosted-zones-by-name --dns-name creditchain.org.
```

If you use SSO or a named profile:

```bash
aws login
export FORGE_AWS_PROFILE="your-profile"
```

## Maple Subdomains

For Maple-hosted CreditForge services, use the same NuwaMail/CreditChain
subdomain strategy:

- `api.forge.creditchain.org CNAME maple3.duckdns.org`
- `rpc.forge.creditchain.org CNAME maple3.duckdns.org`
- `ai.forge.creditchain.org CNAME maple3.duckdns.org`
- `indexer.forge.creditchain.org CNAME maple3.duckdns.org`

DuckDNS tracks the changing residential IP; Route 53 only needs stable CNAME
records for these subdomains.

## GitHub Pages TLS

Forge IDE is published from `openibank/openibank.github.io`, with
`forge.creditchain.org` configured as the Pages custom domain.

Check status without changing GitHub or DNS:

```bash
yarn pages:forge:status
```

If HTTPS enforcement is ever disabled after a custom-domain move, enable it once
after GitHub has issued the certificate:

```bash
yarn pages:forge:enable-https
```

See `DEPLOYMENT_STATUS.md` for the current deployment state and wait procedure.

## Status In This Workspace

AWS CLI credentials are available. The authoritative Route 53 record for
`forge.creditchain.org` is currently `CNAME openibank.github.io`.
