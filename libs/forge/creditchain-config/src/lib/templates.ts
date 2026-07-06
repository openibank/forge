export type CreditForgeTemplate = {
  id: string
  displayName: string
  description: string
  category?: string
  license?: string
  securityScore?: number
  intendedUse?: string
  adminRisk?: string
  tags: string[]
}

export const CREDITFORGE_TEMPLATE_SHORTLIST: CreditForgeTemplate[] = [
  {
    id: 'creditScoreRegistry',
    displayName: 'Credit Score Registry',
    description: 'A CreditChain-native registry for score updates, provenance hashes, and off-chain evidence URIs.',
    tags: ['CreditChain', 'Registry', 'Solidity']
  },
  {
    id: 'creditERC20',
    displayName: 'CreditChain ERC20',
    description: 'A configurable ERC20 token template suitable for loyalty, settlement, and stable-value assets.',
    category: 'ERC20',
    license: 'MIT',
    securityScore: 94,
    intendedUse: 'Fungible loyalty, reward, settlement, or wrapped credit assets.',
    adminRisk: 'Owner receives initial supply; use a multisig for production ownership.',
    tags: ['CreditChain', 'ERC20', 'OpenZeppelin']
  },
  {
    id: 'creditPayment',
    displayName: 'Credit Payment',
    description: 'Merchant checkout settlement with auditable CreditChain payment receipts.',
    category: 'payments',
    license: 'MIT',
    securityScore: 91,
    intendedUse: 'Merchant checkout settlement and auditable CreditChain payment receipts.',
    adminRisk: 'Owner can update merchant treasury. Production deploys should use a merchant-controlled multisig.',
    tags: ['CreditChain', 'Payments', 'OpenZeppelin']
  },
  {
    id: 'gnosisSafeMultisig',
    displayName: 'CreditChain MultiSig Treasury',
    description: 'A treasury-oriented multisig starting point for CreditChain deployments.',
    tags: ['CreditChain', 'Treasury', 'Multisig']
  }
]

export const CREDITFORGE_TEMPLATE_REGISTRY: CreditForgeTemplate[] = [
  ...CREDITFORGE_TEMPLATE_SHORTLIST,
  {
    id: 'creditStablecoin',
    displayName: 'Credit Stablecoin',
    description: 'CreditChain-oriented stable-value token starter with policy metadata.',
    category: 'stablecoin',
    license: 'Apache-2.0',
    securityScore: 89,
    tags: ['CreditChain', 'Stablecoin', 'ERC20']
  },
  {
    id: 'creditERC721',
    displayName: 'Credit ERC721',
    description: 'NFT starter for identity, receipt, and membership use cases.',
    category: 'NFT',
    license: 'MIT',
    securityScore: 91,
    tags: ['CreditChain', 'NFT', 'ERC721']
  },
  {
    id: 'creditERC1155',
    displayName: 'Credit ERC1155',
    description: 'Multi-token starter for programmable access, vouchers, and receipts.',
    category: 'NFT',
    license: 'MIT',
    securityScore: 90,
    tags: ['CreditChain', 'NFT', 'ERC1155']
  },
  {
    id: 'creditStaking',
    displayName: 'Credit Staking',
    description: 'Staking starter with explicit reward and admin-risk metadata.',
    category: 'staking',
    license: 'MIT',
    securityScore: 86,
    tags: ['CreditChain', 'Staking']
  },
  {
    id: 'creditVesting',
    displayName: 'Credit Vesting',
    description: 'Token vesting starter for teams, ecosystem grants, and merchant incentives.',
    category: 'vesting',
    license: 'MIT',
    securityScore: 92,
    tags: ['CreditChain', 'Vesting']
  },
  {
    id: 'creditGovernance',
    displayName: 'Credit Governance',
    description: 'DAO starter for CreditChain project governance workflows.',
    category: 'DAO',
    license: 'MIT',
    securityScore: 87,
    tags: ['CreditChain', 'DAO']
  },
  {
    id: 'creditRwaRegistryToken',
    displayName: 'Credit RWA Registry Token',
    description: 'Real-world asset registry/token starter with stronger compliance warnings.',
    category: 'RWA',
    license: 'Apache-2.0',
    securityScore: 84,
    tags: ['CreditChain', 'RWA']
  },
  {
    id: 'creditMerchantPOS',
    displayName: 'Credit Merchant POS',
    description: 'Merchant point-of-sale starter for payment and receipt workflows.',
    category: 'payments',
    license: 'MIT',
    securityScore: 87,
    tags: ['CreditChain', 'Payments', 'Merchant']
  }
]
