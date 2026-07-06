export interface CreditForgeClientOptions {
  apiBaseUrl: string
  apiKey?: string
}

export interface CreateProjectInput {
  name: string
  chainSlug?: string
}

export interface Project {
  id: string
  name: string
  slug: string
  chainSlug: string
  createdAt: string
}

export interface ApiKeyCreated {
  id: string
  projectId: string
  name: string
  prefix: string
  secretOnce: string
}

export interface ContractSearchInput {
  query: string
  chainSlug?: string
}

export interface ContractSearchResult {
  name: string
  address: string
  chainId: number
  sourceProvider: string
  sourceStatus: 'verified' | 'bytecode-only' | 'decompiled' | 'unknown'
  license: string
  securityScore?: number
}

export interface ForgeAgentCapability {
  name: string
  approval: string
  risk: 'low' | 'medium' | 'high' | 'critical'
}

export interface ForgeAgentManifest {
  name: string
  version: string
  audience: string[]
  loop: string[]
  capabilities: ForgeAgentCapability[]
  safety: string[]
}

export interface GrowthPlan {
  slug: string
  name: string
  price: string
  positioning: string
  included: string[]
  limits: Record<string, string | number>
}

export interface NewsSource {
  name: string
  url: string
  category: string
  cacheSeconds: number
}

export class CreditForgeClient {
  private readonly apiBaseUrl: string
  private readonly apiKey?: string

  constructor(options: CreditForgeClientOptions) {
    this.apiBaseUrl = options.apiBaseUrl.replace(/\/$/, '')
    this.apiKey = options.apiKey
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    return this.request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(input)
    })
  }

  async createApiKey(projectId: string, name: string): Promise<ApiKeyCreated> {
    return this.request<ApiKeyCreated>(`/api/projects/${projectId}/api-keys`, {
      method: 'POST',
      body: JSON.stringify({ name })
    })
  }

  async searchContracts(input: ContractSearchInput): Promise<ContractSearchResult[]> {
    return this.request<ContractSearchResult[]>('/api/contracts/search', {
      method: 'POST',
      body: JSON.stringify(input)
    })
  }

  async getForgeAgentManifest(): Promise<ForgeAgentManifest> {
    return this.request<ForgeAgentManifest>('/api/agents/capabilities', {
      method: 'GET'
    })
  }

  async getGrowthPlans(): Promise<GrowthPlan[]> {
    return this.request<GrowthPlan[]>('/api/growth/plans', {
      method: 'GET'
    })
  }

  async getNewsSources(): Promise<NewsSource[]> {
    return this.request<NewsSource[]>('/api/news/sources', {
      method: 'GET'
    })
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const headers = new Headers(init.headers)
    headers.set('content-type', 'application/json')
    if (this.apiKey) headers.set('authorization', `Bearer ${this.apiKey}`)

    const response = await fetch(`${this.apiBaseUrl}${path}`, { ...init, headers })
    if (!response.ok) {
      throw new Error(`CreditForge request failed: ${response.status} ${await response.text()}`)
    }
    return response.json() as Promise<T>
  }
}
