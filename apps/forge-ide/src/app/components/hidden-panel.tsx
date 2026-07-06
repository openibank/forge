// eslint-disable-next-line no-use-before-define
import React from 'react'
import { AbstractPanel } from './panel'
import * as packageJson from '../../../../../package.json'
import { ForgePluginPanel } from '@creditchain/forge-ui/panel'
import { PluginViewWrapper } from '@creditchain/forge-ui/helper'

const profile = {
  name: 'hiddenPanel',
  displayName: 'Hidden Panel',
  description: 'Forge hidden panel',
  version: packageJson.version,
  methods: ['addView', 'removeView']
}

export class HiddenPanel extends AbstractPanel {
  el: HTMLElement
  dispatch: React.Dispatch<any> = () => {}
  constructor() {
    super(profile)
    this.el = document.createElement('div')
    this.el.setAttribute('class', 'pluginsContainer')
  }

  addView(profile: any, view: any): void {
    super.removeView(profile)
    this.renderComponent()
    super.addView(profile, view)
    this.renderComponent()
  }

  removeView(profile: any): void {
    super.removeView(profile)
    this.renderComponent()
  }

  updateComponent(state: any) {
    return <ForgePluginPanel header={<></>} plugins={state.plugins} />
  }

  setDispatch(dispatch: React.Dispatch<any>) {
    this.dispatch = dispatch
  }

  render() {
    return (
      <div className="pluginsContainer">
        <PluginViewWrapper plugin={this} />
      </div>
    )
  }

  renderComponent() {
    this.dispatch({
      plugins: this.plugins
    })
  }
}
