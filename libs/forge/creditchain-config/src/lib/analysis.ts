export interface AdminPowerFinding {
  power: 'owner' | 'minter' | 'pauser' | 'blacklist' | 'upgrade-admin' | 'treasury'
  confidence: 'high' | 'medium' | 'low'
  evidence: string
}

const ADMIN_POWER_PATTERNS: Array<[AdminPowerFinding['power'], RegExp]> = [
  ['owner', /\bonlyOwner\b|\bOwnable\b/i],
  ['minter', /\bMINTER_ROLE\b|\bmint\(/i],
  ['pauser', /\bPAUSER_ROLE\b|\b_pause\b|\bwhenNotPaused\b/i],
  ['blacklist', /\bblacklist\b|\bdenylist\b|\bfrozen\b/i],
  ['upgrade-admin', /\bUUPSUpgradeable\b|\bTransparentUpgradeableProxy\b|\bupgradeTo\b/i],
  ['treasury', /\btreasury\b|\bfeeRecipient\b/i]
]

export function analyzeAdminPowers(source: string): AdminPowerFinding[] {
  return ADMIN_POWER_PATTERNS
    .filter(([, pattern]) => pattern.test(source))
    .map(([power]) => ({
      power,
      confidence: 'medium',
      evidence: `Matched ${power} privilege pattern`
    }))
}

export function detectFunctionSelectors(abi: Array<{ type?: string; name?: string; inputs?: unknown[] }>) {
  return abi
    .filter((item) => item.type === 'function' && item.name)
    .map((item) => ({
      name: item.name ?? 'unknown',
      signature: `${item.name ?? 'unknown'}(${(item.inputs ?? []).length} args)`
    }))
}
