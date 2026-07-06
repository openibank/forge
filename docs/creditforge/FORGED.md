# Forge Daemon Package

Forge's local workspace bridge is published as `@creditchain/forged` and exposes
the `forged` command.

The package is prepared as the Nx project `forged` and currently lives under
`libs/forged` while it inherits the stable Remix daemon websocket
implementation. Its public package identity, command, npm metadata, supported
origins, GUI copy, build output, and documentation are Forge-native.

## Publish

The canonical npm package name is `@creditchain/forged`. The npm `creditchain`
scope must exist and the publishing account must have write access to that
scope before the first publish.

```bash
yarn nx build forged
cd dist/libs/forged
npm publish --access public
```

Or from the monorepo root:

```bash
yarn publish:forged
```

The publish helper reads `$HOME/.ssh/.npm-key` through a temporary npm config if
that file exists. A token still needs npm publish permission for the target
scope and either bypass-2FA enabled or a fresh OTP supplied through
`FORGED_NPM_OTP`.

Temporary bootstrap publish under a different scope:

```bash
FORGED_NPM_PACKAGE_NAME=@w98qin/forged yarn publish:forged
```

## Install

```bash
npm install -g @creditchain/forged
```

## Use

```bash
forged -s ./shared_project -u https://forge.creditchain.org
```

The legacy `remixd` command remains as a compatibility alias while Forge
internals migrate off Remix plugin identifiers.
