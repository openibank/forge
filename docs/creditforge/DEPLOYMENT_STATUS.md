# Forge Deployment Status

Last checked: 2026-07-05

`forge.creditchain.org` is deployed through GitHub Pages from
`openibank/openibank.github.io`.

Current deployment repository commit:

- `f88d853` - `Deploy Forge to forge.creditchain.org`

Current GitHub Pages state:

- status: `built`
- custom domain: `forge.creditchain.org`
- HTTPS certificate: `approved`
- HTTPS enforcement: `enabled`

Current public DNS:

```bash
dig forge.creditchain.org CNAME +short
dig forge.creditchain.org A +short
dig forge.creditchain.org AAAA +short
```

Expected result for this subdomain:

- authoritative Route 53 record: `CNAME openibank.github.io.`
- resolver `A` records: GitHub Pages IPv4 addresses returned through that CNAME
- resolver `AAAA` records: GitHub Pages IPv6 addresses returned through that CNAME

Do not add separate authoritative `A` or `AAAA` records for
`forge.creditchain.org` while it is hosted by GitHub Pages. The `A` and `AAAA`
records shown by `dig` are normal CNAME resolution results, not extra Route 53
records.

## GitHub Pages Status

The custom domain is configured on `openibank/openibank.github.io`, not the
source monorepo. The old `openibank/forge` Pages site must not claim
`forge.creditchain.org`.

GitHub Pages reports the custom-domain certificate as approved and HTTPS
enforcement is enabled.

Publish the current production build into the Pages repository:

```bash
yarn deploy:forge:pages
```

Rebuild and publish in one step:

```bash
FORGE_BUILD=1 yarn deploy:forge:pages
```

Check status without changing GitHub or DNS:

```bash
yarn pages:forge:status
```

If HTTPS enforcement is ever disabled after a domain change, enable it once
after GitHub reports an approved certificate:

```bash
yarn pages:forge:enable-https
```
