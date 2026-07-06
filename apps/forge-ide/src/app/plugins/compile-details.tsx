import React from 'react'
import { ViewPlugin } from '@remixproject/engine-web'
import { PluginViewWrapper } from '@creditchain/forge-ui/helper'
import { trackMatomoEvent } from '@creditchain/forge-api'
import { ForgeAppManager } from '../../forgeAppManager'
import { ForgeUiCompileDetails } from '@creditchain/forge-ui/solidity-compile-details'

const profile = {
  name: 'compilationDetails',
  displayName: 'Solidity Compile Details',
  description: 'Displays details from solidity compiler',
  location: 'mainPanel',
  methods: ['showDetails'],
  events: []
}

export class CompilationDetailsPlugin extends ViewPlugin {
  dispatch: React.Dispatch<any> = () => {}
  appManager: ForgeAppManager
  element: HTMLDivElement
  payload: any
  constructor(appManager: ForgeAppManager) {
    super(profile)
    this.appManager = appManager
    this.element = document.createElement('div')
    this.element.setAttribute('id', 'compileDetails')
    this.payload = {
      contractProperties: {} as any,
      selectedContract: '',
      help: {} as any,
      insertValue: {} as any,
      saveAs: {} as any,
    }
  }

  async onActivation() {
    trackMatomoEvent(this, { category: 'plugin', action: 'activated', name: 'compilationDetails', isClick: true })
  }

  onDeactivation(): void {

  }

  async showDetails(sentPayload: any) {
    await this.call('tabs', 'focus', 'compilationDetails')
    setTimeout(() => {
      this.payload = sentPayload
      this.renderComponent()
    }, 2000)
  }

  setDispatch(dispatch: React.Dispatch<any>): void {
    this.dispatch = dispatch
  }

  render() {
    return (
      <div id="compileDetails">
        <PluginViewWrapper plugin={this} />
      </div>
    )
  }

  renderComponent() {
    this.dispatch({
      ...this,
      ...this.payload
    })
  }

  updateComponent(state: any) {
    return (
      <ForgeUiCompileDetails
        plugin={this}
        contractProperties={state.contractProperties}
        selectedContract={state.selectedContract}
        saveAs={state.saveAs}
        help={state.help}
        insertValue={state.insertValue}
      />
    )
  }

}
