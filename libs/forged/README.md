# Forge Daemon

`@creditchain/forged` is the Forge command-line daemon for connecting a local
smart-contract workspace to [Forge](https://forge.creditchain.org).

It establishes a two-way websocket connection between your computer and Forge
so the browser IDE can read, write, compile, analyze, and deploy contracts from
a local folder without uploading a copy of the workspace to browser storage.

The package is the Forge successor to Remix's `remixd`. The `remixd` binary is
kept as a compatibility alias during migration, but new Forge workflows should
use `forged`.

## Installation

```bash
npm install -g @creditchain/forged
```

Python 3.6+ and `pip3` are required when installing optional Slither support:

```bash
forged -i slither
```

## Command

Share the terminal's current directory with Forge:

```bash
forged -u https://forge.creditchain.org
```

Share a specific folder:

```bash
forged -s ./shared_project -u https://forge.creditchain.org
```

Local development:

```bash
forged -s ./shared_project -u http://127.0.0.1:8080
```

Help:

```bash
forged -h
```

Supported options:

```text
-v, --version               output the version number
-u, --forge-ide <url>       URL of the Forge instance allowed to connect
--forge-ide <url>           legacy alias for --forge-ide
-s, --shared-folder <path>  folder to share with Forge (default: CWD)
-i, --install <name>        module name to install locally (supported: slither)
-r, --read-only             treat shared folder as read-only
```

## Supported Origins

Bundled supported origins:

- `https://forge.creditchain.org`
- `https://alpha.forge.creditchain.org`
- `https://beta.forge.creditchain.org`
- `http://localhost:8080`
- `http://127.0.0.1:8080`

Set `FORGED_ORIGINS_URL` to load an externally managed origins list.

## Ports Usage

- `65520`: local folder websocket listener.
- `65522`: Hardhat websocket listener when the shared folder is a Hardhat
  project.
- `65523`: Slither analysis websocket listener.
- `65524`: Truffle websocket listener when the shared folder is a Truffle
  project.
- `65525`: Foundry websocket listener when the shared folder contains
  `foundry.toml`.

Make sure these ports are not exposed publicly or forwarded from your machine.

## Safety Notes

- Any local process with access to these ports can potentially interact with the
  shared folder.
- Only share project directories you trust.
- Keep a backup of important local workspaces.
- Symbolic links are not forwarded to Forge.
- Use `--read-only` when you want Forge to inspect a folder without writing to
  it.
