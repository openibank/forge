## Remix Analyzer
[![npm version](https://badge.fury.io/js/%40creditchain%2Fforge-analyzer.svg)](https://www.npmjs.com/package/@creditchain/forge-analyzer)
[![npm](https://img.shields.io/npm/dt/@creditchain/forge-analyzer.svg?label=Total%20Downloads)](https://www.npmjs.com/package/@creditchain/forge-analyzer)
[![npm](https://img.shields.io/npm/dw/@creditchain/forge-analyzer.svg)](https://www.npmjs.com/package/@creditchain/forge-analyzer)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/openibank/forge/tree/master/libs/forge-analyzer)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/openibank/forge/issues)

`@creditchain/forge-analyzer` is a tool to perform static analysis on Solidity smart contracts to check security vulnerabilities and bad development practices. It works underneath Forge IDE "SOLIDITY STATIC ANALYSIS" plugin which is used to run analysis for a compiled contract according to selected modules.

### Installation
`@creditchain/forge-analyzer` is an NPM package and can be installed using NPM as:

`yarn add @creditchain/forge-analyzer`

### How to use

`@creditchain/forge-analyzer` exports below interface:

```
import { CompilationResult, AnalyzerModule, AnalysisReport } from 'types';
declare type ModuleObj = {
    name: string;
    mod: AnalyzerModule;
};
export default class staticAnalysisRunner {
    /**
     * Run analysis (Used by IDE)
     * @param compilationResult contract compilation result
     * @param toRun module indexes (compiled from remix IDE)
     * @param callback callback
     */
    run(compilationResult: CompilationResult, toRun: number[], callback: ((reports: AnalysisReport[]) => void)): void;
    
    /**
     * Run analysis passing list of modules to run
     * @param compilationResult contract compilation result
     * @param modules analysis module
     * @param callback callback
     */
    runWithModuleList(compilationResult: CompilationResult, modules: ModuleObj[], callback: ((reports: AnalysisReport[]) => void)): void;
    
    /**
     * Get list of all analysis modules
     */
    modules(): any[];
}
```
One can import the module and use the available methods to run analysis. Related type descriptions can be seen [here](https://github.com/openibank/forge/blob/master/libs/forge-analyzer/src/types.ts).

Details of modules are explained in [official forge-ide documentation](https://forge-ide.readthedocs.io/en/latest/static_analysis.html).

### Contribute

Please feel free to open an issue or a pull request. 

If you'd like to add some code, please take a look at our contribution guidelines [here](https://github.com/openibank/forge/blob/master/CONTRIBUTING.md). You can reach us on [Discord](https://discord.gg/MzhfCGstNA) with any questions.

### License
MIT © 2018-21 Remix Team

