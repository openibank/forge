export interface ForgeAgentTool {
  name: string
  description: string
  approval: 'never' | 'workspace-write' | 'testnet-deploy' | 'mainnet-deploy'
  risk: 'low' | 'medium' | 'high' | 'critical'
}

export const FORGE_AGENT_LOOP = [
  'Search',
  'Import',
  'Understand',
  'Modify',
  'Compile',
  'Test',
  'Audit',
  'Deploy',
  'Verify',
  'Monitor'
] as const

export const FORGE_AGENT_TOOLS: ForgeAgentTool[] = [
  { name: 'search_contracts', description: 'Find verified source, ABIs, bytecode, selectors, and templates.', approval: 'never', risk: 'low' },
  { name: 'import_contract_source', description: 'Import verified source and reconstruct a Foundry workspace.', approval: 'never', risk: 'medium' },
  { name: 'read_workspace_file', description: 'Read files from the active workspace sandbox.', approval: 'never', risk: 'low' },
  { name: 'write_workspace_file', description: 'Create or overwrite a workspace file.', approval: 'workspace-write', risk: 'medium' },
  { name: 'apply_patch', description: 'Apply a minimal code patch to workspace files.', approval: 'workspace-write', risk: 'medium' },
  { name: 'compile_workspace', description: 'Run forge build inside a sandbox.', approval: 'never', risk: 'low' },
  { name: 'run_tests', description: 'Run forge test inside a sandbox.', approval: 'never', risk: 'low' },
  { name: 'run_slither', description: 'Run Slither and normalize findings into CreditBeacon format.', approval: 'never', risk: 'low' },
  { name: 'run_fuzz_tests', description: 'Run invariant and fuzz tests with bounded resources.', approval: 'never', risk: 'medium' },
  { name: 'analyze_storage_layout', description: 'Compare storage layout and proxy upgrade safety.', approval: 'never', risk: 'medium' },
  { name: 'analyze_access_control', description: 'Explain owner, role, pauser, minter, and upgrade authority.', approval: 'never', risk: 'medium' },
  { name: 'estimate_gas', description: 'Estimate gas for deployment and selected calls.', approval: 'never', risk: 'low' },
  { name: 'simulate_deployment', description: 'Dry-run deployment against a fork or testnet.', approval: 'never', risk: 'medium' },
  { name: 'deploy_contract', description: 'Deploy using wallet or managed policy signing.', approval: 'testnet-deploy', risk: 'high' },
  { name: 'verify_contract', description: 'Submit source and metadata to explorer, Sourcify, or CreditChain verification.', approval: 'never', risk: 'medium' },
  { name: 'generate_docs', description: 'Generate README, NatSpec docs, and deployment notes.', approval: 'workspace-write', risk: 'low' },
  { name: 'generate_frontend_sdk', description: 'Generate typed viem clients and ABI helpers.', approval: 'workspace-write', risk: 'low' }
]

export const FORGE_AGENT_SAFETY_RULES = [
  'Never ask for seed phrases or private keys.',
  'Never deploy to mainnet without explicit human approval.',
  'Never hide mint, pause, freeze, blacklist, owner, or upgrade powers.',
  'Never silently change token economics, fee recipients, or admin ownership.',
  'Always distinguish verified source from decompiled approximations.',
  'Always show license status before fork, copy, modification, or redeploy.',
  'Always explain owner/admin powers and upgradeability risk before deployment.'
] as const

export const FORGE_AGENT_BUSINESS_CONTEXT = {
  product: 'CreditForge',
  positioning: 'AI-native smart contract engineering cloud and CreditChain developer infrastructure platform',
  primaryAudience: [
    'human smart contract developers',
    'AI coding agents',
    'protocol founders',
    'security reviewers',
    'application developers using RPC, webhooks, and indexed APIs'
  ],
  goToMarket: [
    'free builder tier with generous testnet RPC',
    'function-first onboarding before billing',
    'template marketplace for payments, stablecoins, RWA, loyalty, DAO, and merchant POS',
    'public News Center that turns market motion into builder actions',
    'machine-readable APIs for AI agents'
  ],
  successMetrics: [
    'verified contract imports',
    'workspaces created',
    'successful compile and test loops',
    'CreditBeacon scans completed',
    'CreditChain testnet deployments',
    'API keys created',
    'webhooks delivered'
  ]
} as const
