import EventEmitter from 'events'
import { Plugin } from '@remixproject/engine'
import { FilePanelType } from '@creditchain/forge-ui/workspace'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { VerticalIcons } from 'apps/forge-ide/src/app/components/vertical-icons'
import { CustomRemixApi } from '@creditchain/forge-api'
export interface PluginProfile {
  name: string
  displayName: string
  description: string
  keywords?: string[]
  icon?: string
  url?: string
  methods?: string[]
  events?: string[]
  version?: string
}

export interface StatusBarInterface extends Plugin<any, CustomRemixApi> {
  htmlElement: HTMLDivElement
  events: EventEmitter
  dispatch: React.Dispatch<any>
  filePanel: FilePanelType
  verticalIcons: VerticalIcons
  setDispatch(dispatch: React.Dispatch<any>): void
  getGitBranchName: () => Promise<any>
  currentWorkspaceName: string
}

export const defaultStatusBarContext: StatusBarContextType = {
  test: false
}

export type StatusBarContextType = {
  test: boolean
}

