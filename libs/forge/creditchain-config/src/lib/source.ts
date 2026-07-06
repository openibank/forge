export type SourceStatus = 'verified-source' | 'public-bytecode' | 'decompiled-approximation' | 'unknown'
export type LicenseStatus = 'MIT' | 'Apache-2.0' | 'GPL' | 'LGPL' | 'AGPL' | 'BUSL' | 'UNLICENSED' | 'unknown'

export interface ImportedContractSource {
  contractName: string
  address: string
  chainId: number
  sourceProvider: string
  status: SourceStatus
  license: LicenseStatus
  compilerVersion?: string
  optimizer?: {
    enabled: boolean
    runs: number
  }
  files: Record<string, string>
  abi: unknown[]
  bytecodeHash?: string
}

export function classifyLicense(rawLicense?: string | null): LicenseStatus {
  const normalized = rawLicense?.trim().toUpperCase()
  if (!normalized) return 'unknown'
  if (normalized.includes('MIT')) return 'MIT'
  if (normalized.includes('APACHE')) return 'Apache-2.0'
  if (normalized.includes('AGPL')) return 'AGPL'
  if (normalized.includes('LGPL')) return 'LGPL'
  if (normalized.includes('GPL')) return 'GPL'
  if (normalized.includes('BUSL')) return 'BUSL'
  if (normalized.includes('UNLICENSED')) return 'UNLICENSED'
  return 'unknown'
}

export function buildCreditForgeManifest(source: ImportedContractSource) {
  return {
    sourceProvider: source.sourceProvider,
    chainId: source.chainId,
    address: source.address,
    compilerVersion: source.compilerVersion ?? 'unknown',
    optimizer: source.optimizer?.enabled ?? false,
    optimizerRuns: source.optimizer?.runs ?? 0,
    license: source.license,
    sourceStatus: source.status,
    proxy: {
      isProxy: false,
      implementation: null
    }
  }
}
