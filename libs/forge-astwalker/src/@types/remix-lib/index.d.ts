// Type definitions for the things we need from forge-lib

declare module 'forge-lib' {
  // eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword
  export module util {
    export function findLowerBound(target: number, array: Array<number>): number;
  }
}
