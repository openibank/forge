/* eslint-disable prefer-const */
import React from 'react'
import { Plugin } from '@remixproject/engine'
import { ElectronPlugin } from '@remixproject/engine-electron'
import { trackMatomoEvent } from '@creditchain/forge-api'

const profile = {
  name: 'desktopHost',
  displayName: '',
  description: '',
  methods: [],
  events: ['connected'],
  maintainedBy: 'CreditChain',
  kind: 'provider'
}

export class DesktopHost extends ElectronPlugin {

  constructor() {
    super(profile)
  }

  onActivation() {
    console.log('DesktopHost activated')
    trackMatomoEvent(this, { category: 'plugin', action: 'activated', name: 'DesktopHost', isClick: true })
  }

}