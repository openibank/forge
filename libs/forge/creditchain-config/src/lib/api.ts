export const FORGE_API_ENDPOINTS = {
  health: '/health',
  networks: '/networks',
  templates: '/templates',
  contractSearch: '/contracts/search',
  contractImport: '/contracts/import',
  compileCache: '/compile/cache',
  deploymentsRegister: '/deployments/register',
  verify: '/verify',
  audit: '/audit',
  aiChat: '/ai/chat',
  aiExplain: '/ai/explain',
  aiGenerateTests: '/ai/generate-tests'
} as const

export const FORGE_SERVICE_URLS = {
  api: 'https://api.forge.creditchain.org',
  ai: 'https://ai.forge.creditchain.org',
  indexer: 'https://indexer.forge.creditchain.org'
} as const
