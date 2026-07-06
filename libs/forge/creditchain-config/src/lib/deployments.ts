export interface DeploymentChecklist {
  chain: string
  contractName: string
  compilerVersion: string
  constructorArgs: string[]
  adminAddress?: string
  treasuryAddress?: string
  proxyAdmin?: string
  mintAuthority?: string
  pauseAuthority?: string
  upgradeAuthority?: string
  licenseStatus: string
  securityReadiness: 'green' | 'yellow' | 'red'
  requiresHumanApproval: boolean
}

export function deploymentRequiresApproval(checklist: DeploymentChecklist): boolean {
  return (
    checklist.requiresHumanApproval ||
    checklist.chain.toLowerCase().includes('mainnet') ||
    checklist.securityReadiness !== 'green' ||
    checklist.licenseStatus === 'unknown'
  )
}
