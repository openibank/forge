# Forge Libraries

[![Discord](https://img.shields.io/badge/join-discord-brightgreen.svg?style=flat&logo=discord)](https://discord.gg/MzhfCGstNA)
[![CircleCI](https://circleci.com/gh/openibank/forge/tree/master.svg?style=svg)](https://circleci.com/gh/openibank/forge/tree/master)
[![Documentation Status](https://readthedocs.org/projects/docs/badge/?version=latest)](https://forge-ide.readthedocs.io/en/latest/index.html)


**Forge libraries** are the CreditChain smart-contract development packages that power Forge's compiler, debugger, testing, workspace, local daemon, and plugin layers.

**Forge** is the CreditChain-native smart contract studio at https://forge.creditchain.org. It inherits battle-tested EVM development libraries from Remix and reorients them toward CreditChain, AI-assisted engineering, verified source workflows, and infrastructure-aware deployments.

The Forge repository is available at https://github.com/openibank/forge.

To start with Forge, open https://forge.creditchain.org.

Here is the brief description of Forge libraries.

+ [`forge-analyzer`](forge-analyzer/README.md): Perform static analysis on Solidity smart contracts to check security vulnerabilities and bad development practices
+ [`forge-astwalker`](forge-astwalker/README.md): Parse solidity AST (Abstract Syntax Tree)
+ [`forge-debug`](forge-debug/README.md): Debug Ethereum transactions. It provides several controls that allow stepping over the trace and seeing the current state of a selected step.
+ [`forge-simulator`](forge-simulator/README.md): Web3 wrapper for different kind of providers
+ [`forge-solidity`](forge-solidity/README.md): Load a Solidity compiler from provided URL and compile the contract using loaded compiler and return the compilation details
+ [`forge-lib`](forge-lib/README.md): Common place for libraries being used across multiple modules
+ [`forge-tests`](forge-tests/README.md): Unit test Solidity smart contracts. It works as a plugin & as CLI both
+ [`forge-url-resolver`](forge-url-resolver/README.md): Provide helpers for resolving the content from external URL ( including github, swarm, ipfs etc.).
+ [`forge-ws-templates`](forge-ws-templates/README.md): Create workspaces from Forge and CreditChain templates
+ [`forged`](forged/README.md): Connect Forge to a local filesystem by running the `@creditchain/forged` daemon

Each library is an NPM package or internal workspace package and has usage documentation in its own `README`.

## Contributing

Everyone is welcome to contribute to Forge. Suggestions, issues, queries, and feedback can be filed at https://github.com/openibank/forge/issues.

For more information on contributing to the code, see the repository guidelines.
