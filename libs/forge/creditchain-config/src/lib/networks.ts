export type CreditChainNetwork = {
  slug: string
  name: string
  shortName: string
  chainId: number
  rpcUrl: string
  explorerUrl: string
  currencySymbol: string
  rpcUrlEnv?: string
  explorerUrlEnv?: string
  verificationApi?: string
  faucetUrl?: string
  capabilities?: ChainCapability[]
  mainnet?: boolean
  priority?: 'core' | 'popular' | 'adapter'
  runtime?: 'evm'
  verificationProvider?: string
  isDefault?: boolean
  notes?: string
}

export type ChainCapability =
  | 'rpc'
  | 'websocket'
  | 'archive'
  | 'traces'
  | 'verification'
  | 'faucet'
  | 'webhooks'

export const CREDITCHAIN_NETWORKS: CreditChainNetwork[] = [
  {
    slug: 'creditchain-testnet',
    name: 'CreditChain Testnet',
    shortName: 'CreditChain',
    chainId: 2026042404,
    rpcUrl: 'https://testnet.creditchain.org',
    explorerUrl: 'https://scan.creditchain.org',
    currencySymbol: 'CCC',
    rpcUrlEnv: 'CREDITCHAIN_TESTNET_RPC_URL',
    explorerUrlEnv: 'CREDITCHAIN_TESTNET_EXPLORER_URL',
    faucetUrl: 'https://faucet.creditchain.org/testnet',
    verificationApi: 'https://api-testnet.creditchain.org',
    capabilities: ['rpc', 'websocket', 'verification', 'faucet', 'webhooks'],
    mainnet: false,
    priority: 'core',
    runtime: 'evm',
    verificationProvider: 'CreditChain Scan',
    isDefault: true,
    notes:
      'Argos testnet (active). RPC aliases: https://testnet.creditchain.org and https://argos.creditchain.org. Genesis: 0xcbb0f12e2a67c07a59218baefb4eb8211d9867b52b716fb190e4df12628042c9. Docs: https://docs.creditchain.org/networks/argos-testnet/'
  },
  {
    slug: 'creditchain-mainnet',
    name: 'CreditChain Mainnet',
    shortName: 'CreditChain',
    chainId: 2026042405,
    rpcUrl: '',
    explorerUrl: '',
    currencySymbol: 'CCC',
    rpcUrlEnv: 'CREDITCHAIN_MAINNET_RPC_URL',
    explorerUrlEnv: 'CREDITCHAIN_MAINNET_EXPLORER_URL',
    capabilities: [],
    mainnet: true,
    priority: 'core',
    runtime: 'evm',
    verificationProvider: 'CreditChain Scan',
    isDefault: false,
    notes:
      'Argos mainnet is PLANNED / NOT LAUNCHED. Do not offer as connectable. https://rpc.creditchain.org returns mainnet_launch_gated. See https://docs.creditchain.org/networks.json'
  },
  {
    slug: 'creditchain-devnet',
    name: 'Local CreditChain Devnet',
    shortName: 'CreditChain Local',
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
    explorerUrl: 'http://127.0.0.1:4000',
    currencySymbol: 'CCC',
    rpcUrlEnv: 'CREDITCHAIN_DEVNET_RPC_URL',
    explorerUrlEnv: 'CREDITCHAIN_DEVNET_EXPLORER_URL',
    capabilities: ['rpc'],
    mainnet: false,
    priority: 'core',
    runtime: 'evm',
    verificationProvider: 'Local',
    notes: 'Local development network for Foundry, Hardhat, Anvil, or a CreditChain dev node.'
  }
]

export const CREDITFORGE_EVM_ADAPTERS: CreditChainNetwork[] = [
  {
    slug: 'ethereum',
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    chainId: 1,
    rpcUrl: '',
    explorerUrl: 'https://etherscan.io',
    currencySymbol: 'ETH',
    rpcUrlEnv: 'ETHEREUM_RPC_URL',
    explorerUrlEnv: 'ETHEREUM_EXPLORER_URL',
    capabilities: ['rpc', 'websocket', 'archive', 'traces', 'verification'],
    mainnet: true,
    priority: 'popular',
    runtime: 'evm',
    verificationProvider: 'Etherscan'
  },
  {
    slug: 'base',
    name: 'Base',
    shortName: 'Base',
    chainId: 8453,
    rpcUrl: '',
    explorerUrl: 'https://basescan.org',
    currencySymbol: 'ETH',
    rpcUrlEnv: 'BASE_RPC_URL',
    explorerUrlEnv: 'BASE_EXPLORER_URL',
    capabilities: ['rpc', 'websocket', 'verification'],
    mainnet: true,
    priority: 'popular',
    runtime: 'evm',
    verificationProvider: 'Basescan'
  },
  {
    slug: 'polygon',
    name: 'Polygon',
    shortName: 'Polygon',
    chainId: 137,
    rpcUrl: '',
    explorerUrl: 'https://polygonscan.com',
    currencySymbol: 'POL',
    rpcUrlEnv: 'POLYGON_RPC_URL',
    explorerUrlEnv: 'POLYGON_EXPLORER_URL',
    capabilities: ['rpc', 'websocket', 'verification'],
    mainnet: true,
    priority: 'popular',
    runtime: 'evm',
    verificationProvider: 'Polygonscan'
  },
  {
    slug: 'arbitrum',
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    chainId: 42161,
    rpcUrl: '',
    explorerUrl: 'https://arbiscan.io',
    currencySymbol: 'ETH',
    rpcUrlEnv: 'ARBITRUM_RPC_URL',
    explorerUrlEnv: 'ARBITRUM_EXPLORER_URL',
    capabilities: ['rpc', 'websocket', 'verification'],
    mainnet: true,
    priority: 'popular',
    runtime: 'evm',
    verificationProvider: 'Arbiscan'
  },
  {
    slug: 'optimism',
    name: 'Optimism',
    shortName: 'Optimism',
    chainId: 10,
    rpcUrl: '',
    explorerUrl: 'https://optimistic.etherscan.io',
    currencySymbol: 'ETH',
    rpcUrlEnv: 'OPTIMISM_RPC_URL',
    explorerUrlEnv: 'OPTIMISM_EXPLORER_URL',
    capabilities: ['rpc', 'websocket', 'verification'],
    mainnet: true,
    priority: 'popular',
    runtime: 'evm',
    verificationProvider: 'Etherscan'
  },
  {
    slug: 'bsc',
    name: 'BNB Smart Chain',
    shortName: 'BNB Chain',
    chainId: 56,
    rpcUrl: '',
    explorerUrl: 'https://bscscan.com',
    currencySymbol: 'BNB',
    rpcUrlEnv: 'BSC_RPC_URL',
    explorerUrlEnv: 'BSC_EXPLORER_URL',
    capabilities: ['rpc', 'websocket', 'verification'],
    mainnet: true,
    priority: 'popular',
    runtime: 'evm',
    verificationProvider: 'BscScan'
  }
]

export const CREDITFORGE_CHAIN_REGISTRY: CreditChainNetwork[] = [
  ...CREDITCHAIN_NETWORKS,
  ...CREDITFORGE_EVM_ADAPTERS
]

export const EVM_COMPATIBLE_NETWORKS = [
  'CreditChain Mainnet',
  'CreditChain Testnet',
  'Base',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Ethereum Mainnet'
] as const

export function getCreditForgeNetwork(slug: string): CreditChainNetwork | undefined {
  return CREDITFORGE_CHAIN_REGISTRY.find((network) => network.slug === slug)
}

export function toWalletAddEthereumChainParams(network: CreditChainNetwork) {
  return {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: network.name,
    nativeCurrency: {
      name: network.currencySymbol,
      symbol: network.currencySymbol,
      decimals: 18
    },
    rpcUrls: [network.rpcUrl],
    blockExplorerUrls: [network.explorerUrl]
  }
}
