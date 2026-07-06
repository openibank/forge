export interface ForgeUiPublishToStorageProps {
  id?: string
  api: any,
  storage: 'swarm' | 'ipfs',
  contract: any,
  resetStorage: () => void
}
