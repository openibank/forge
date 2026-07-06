## Remix Lib
[![npm version](https://badge.fury.io/js/%40creditchain%2Fforge-lib.svg)](https://www.npmjs.com/package/@creditchain/forge-lib)
[![npm](https://img.shields.io/npm/dt/@creditchain/forge-lib.svg?label=Total%20Downloads)](https://www.npmjs.com/package/@creditchain/forge-lib)
[![npm](https://img.shields.io/npm/dw/@creditchain/forge-lib.svg)](https://www.npmjs.com/package/@creditchain/forge-lib)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/openibank/forge/tree/master/libs/forge-lib)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/openibank/forge/issues)

`@creditchain/forge-lib` is a common library to various remix tools. It is used in `forge-astwalker`, `forge-analyzer`, `forge-debug`, `forge-simulator`, `forge-solidity`, `forge-tests` libraries and in Forge IDE codebase.

### Installation
`@creditchain/forge-lib` is an NPM package and can be installed using NPM as:

`yarn add @creditchain/forge-lib`

### How to use

`@creditchain/forge-lib` exports:

```
{
    EventManager: EventManager,
    helpers: {
      ui: uiHelper,
      compiler: compilerHelper
    },
    Storage: Storage,
    util: util,
    execution: {
      EventsDecoder: EventsDecoder,
      txExecution: txExecution,
      txHelper: txHelper,
      executionContext: new ExecutionContext(),
      txFormat: txFormat,
      txListener: TxListener,
      txRunner: TxRunner,
      typeConversion: typeConversion
    },
    UniversalDApp: UniversalDApp
}
```

### Contribute

Please feel free to open an issue or a pull request. 

If you'd like to add some code, please take a look at our contribution guidelines [here](https://github.com/openibank/forge/blob/master/CONTRIBUTING.md). You can reach us on [Discord](https://discord.gg/MzhfCGstNA) with any questions.

### License
MIT © 2018-21 Remix Team
