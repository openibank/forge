import React, { useContext, useRef, useState, useEffect } from 'react'
// @ts-ignore
import './forge-ui-home-tab.css'
import { ThemeContext, themes } from './themeContext'
import { appActionTypes, AppContext, useAuth } from '@creditchain/forge-ui/app'
import { HomeTabEvent, MatomoEvent, Features } from '@creditchain/forge-api'
import { TrackingContext } from '@creditchain/forge-ide/tracking'
import { FormattedMessage } from 'react-intl'
import { uploadFolderExcludingRootFolder } from '@creditchain/forge-ui/workspace'
import { CREDITCHAIN_NETWORKS, CREDITFORGE_LINKS, toWalletAddEthereumChainParams } from '@forge/creditchain-config'

export interface ForgeUiHomeTabProps {
  plugin: any
}

export const ForgeUiHomeTab = (props: ForgeUiHomeTabProps) => {
  const appContext = useContext(AppContext)
  const { trackMatomoEvent: baseTrackEvent } = useContext(TrackingContext)
  const { plugin } = props
  const uploadFileRef = useRef<HTMLInputElement>(null)

  const trackMatomoEvent = <T extends MatomoEvent = HomeTabEvent>(event: T) => {
    baseTrackEvent?.<T>(event)
  }

  const [state, setState] = useState<{ themeQuality: { filter: string; name: string } }>({
    themeQuality: themes.light
  })

  const { features } = useAuth()
  const hasAuditorPermission = features[Features.AI_AUDITOR]?.is_enabled === true
  const hasSkillsPermission = features[Features.AI_SKILLS]?.is_enabled === true

  useEffect(() => {
    plugin.call('theme', 'currentTheme').then((theme: any) => {
      setState((prev) => ({ ...prev, themeQuality: theme.quality === 'dark' ? themes.dark : themes.light }))
    })
    plugin.on('theme', 'themeChanged', (theme: any) => {
      setState((prev) => ({ ...prev, themeQuality: theme.quality === 'dark' ? themes.dark : themes.light }))
    })
  }, [])

  // ─── Start ───

  const openTemplateSelection = async () => {
    await plugin.call('templateexplorermodal', 'updateTemplateExplorerInFileMode', false)
    appContext.appStateDispatch({ type: appActionTypes.showGenericModal, payload: true })
    trackMatomoEvent({ category: 'hometab', action: 'filesSection', name: 'Create a new workspace', isClick: true })
  }

  const startCoding = async () => {
    plugin.verticalIcons.select('filePanel')
    const wName = 'Playground'
    const workspaces = await plugin.call('filePanel', 'getWorkspaces')
    let createFile = true
    if (!workspaces.find((workspace: any) => workspace.name === wName)) {
      await plugin.call('filePanel', 'createWorkspace', wName, 'playground')
      createFile = false
    }
    await plugin.call('filePanel', 'switchToWorkspace', { name: wName, isLocalHost: false })
    await plugin.call('filePanel', 'switchToWorkspace', { name: wName, isLocalHost: false })
    const content = `// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract HelloWorld {
  function print() public pure returns (string memory) {
    return "Hello World!";
  }
}`
    if (createFile) {
      const { newPath } = await plugin.call('fileManager', 'writeFileNoRewrite', '/contracts/HelloWorld.sol', content)
      await plugin.call('fileManager', 'open', newPath)
    } else {
      await plugin.call('fileManager', 'open', '/contracts/HelloWorld.sol')
    }
    trackMatomoEvent({ category: 'hometab', action: 'filesSection', name: 'startCoding', isClick: true })
  }

  const createCreditScoreRegistry = async () => {
    plugin.verticalIcons.select('filePanel')
    const templateName = 'creditScoreRegistry'
    const workspaceName = await plugin.call('filePanel', 'getAvailableWorkspaceName', 'CreditChain Credit Score Registry')
    await plugin.call('filePanel', 'createWorkspace', workspaceName, templateName)
    await plugin.call('filePanel', 'setWorkspace', workspaceName)
    await plugin.call('fileManager', 'open', 'contracts/CreditScoreRegistry.sol')
    trackMatomoEvent({ category: 'hometab', action: 'filesSection', name: 'createCreditScoreRegistry', isClick: true })
  }

  const addCreditChainTestnet = async () => {
    const provider = (window as any).ethereum
    const testnet = CREDITCHAIN_NETWORKS.find(network => network.name === 'CreditChain Testnet') || CREDITCHAIN_NETWORKS[0]

    if (!provider?.request) {
      plugin.call('notification', 'toast', 'Connect an injected wallet to add CreditChain Testnet.')
      return
    }

    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [toWalletAddEthereumChainParams(testnet)]
      })
      trackMatomoEvent({ category: 'hometab', action: 'filesSection', name: 'addCreditChainTestnet', isClick: true })
    } catch (error: any) {
      plugin.call('notification', 'toast', `Unable to add CreditChain Testnet: ${error?.message || 'wallet rejected the request'}`)
    }
  }

  const openContractSearch = async () => {
    try {
      await plugin.call('manager', 'activatePlugin', 'cookbookdev')
      await plugin.call('sidePanel', 'focus', 'cookbookdev')
      trackMatomoEvent({ category: 'hometab', action: 'filesSection', name: 'openContractSearch', isClick: true })
    } catch (error: any) {
      plugin.call('notification', 'toast', 'Contract search will be connected to Forge API in the next CreditChain phase.')
    }
  }

  // ─── Open ───

  const uploadFile = async (target: any) => {
    await plugin.call('menuicons', 'select', 'filePanel')
    await plugin.call('filePanel', 'uploadFile', target)
    trackMatomoEvent({ category: 'hometab', action: 'filesSection', name: 'uploadFile', isClick: true })
  }

  const cloneFromGitHub = async () => {
    await plugin.call('filePanel', 'clone')
    trackMatomoEvent({ category: 'hometab', action: 'filesSection', name: 'Git Clone', isClick: true })
  }

  const importFromGist = () => {
    plugin.call('gistHandler', 'load', '')
    plugin.verticalIcons.select('filePanel')
    trackMatomoEvent({ category: 'hometab', action: 'filesSection', name: 'importFromGist', isClick: true })
  }

  // ─── Learn ───

  const startLearnEth = async () => {
    if (await plugin.appManager.isActive('LearnEth')) {
      plugin.verticalIcons.select('LearnEth')
    } else {
      await plugin.appManager.activatePlugin(['LearnEth', 'solidity', 'solidityUnitTesting'])
      plugin.verticalIcons.select('LearnEth')
    }
    trackMatomoEvent({ category: 'hometab', action: 'header', name: 'Start Learning', isClick: true })
  }

  // ─── AI (gated) ───

  const openSkillsSelection = async () => {
    if (!hasSkillsPermission) { plugin.call('planManager', 'open', { reason: 'feature-required', requiredFeature: Features.SKILLS_BASIC }) } else {
      appContext.appStateDispatch({ type: appActionTypes.showSkillsModal, payload: true })
      trackMatomoEvent({ category: 'hometab', action: 'header', name: 'Explore Skills', isClick: true })
    }
  }

  const openAuditsSelection = async () => {
    if (!hasAuditorPermission) { plugin.call('planManager', 'open', { reason: 'feature-required', requiredFeature: Features.AI_AUDITOR }) } else {
      appContext.appStateDispatch({ type: appActionTypes.showChecklistModal, payload: true })
      trackMatomoEvent({ category: 'hometab', action: 'header', name: 'Explore Audits', isClick: true })
    }
  }

  const startGasOptimization = async () => {
    if (!hasAuditorPermission) { plugin.call('planManager', 'open', { reason: 'feature-required', requiredFeature: Features.AI_AUDITOR }) } else {
      await plugin.call('manager', 'activatePlugin', 'remixaiassistant')
      await plugin.call('menuicons', 'select', 'remixaiassistant')
      await plugin.call('remixaiassistant', 'newConversation')
      try {
        await plugin.call('skillsexplorermodal', 'loadSkill', 'coding-solidity-gas-optimization')
      } catch (e: any) {
        plugin.call('notification', 'toast', `Error loading Gas optimization skills ${e.message}`)
      }
      setTimeout(() => {
        plugin.call('remixaiassistant', 'chatPipe', `Start gas optimization checks. Use the skill solidity-gas-optimization for reference and propose me to go over some specific focussed areas instead of general checks. Ask me which contract file to optimize.`, true, { source: 'home-tab', presetId: 'gas-optimization' })
      })
    }
  }

  return (
    <div className="ht-root d-flex flex-column w-100" data-id="remixUIHTAll">
      <ThemeContext.Provider value={state.themeQuality}>
        <div className="ht-layout">
          <div className="ht-panel">
            <div className="ht-header" >
              <a className="ht-logo-container" href={CREDITFORGE_LINKS.home} target="_blank" rel="noreferrer">
                <div className="ht-logo">
                  <img className="ht-logo-mark" src="assets/img/forge-logo.svg" alt="" />
                  <span className="ht-logo-wordmark">Forge</span>
                </div>
                <span className="ht-tagline">
                  AI-native smart contract studio for{' '}
                  <span style={{ color: 'var(--ht-accent)' }}>CreditChain</span>
                </span>
              </a>
            </div>

            {/* CreditChain */}
            <div className="ht-section">
              <div className="ht-section-header">
                <span className="ht-section-title">CreditChain</span>
              </div>
              <button className="ht-row ht-row-cta" data-id="homeTabSearchContracts" onClick={openContractSearch}>
                <span className="ht-row-icon ht-row-icon-cta"><i className="fa-solid fa-magnifying-glass"></i></span>
                <span className="ht-row-text">
                  <strong>Search verified contracts</strong>
                  <small>Import source, ABI, compiler settings, and proxy context</small>
                </span>
              </button>
              <button className="ht-cta-secondary" data-id="homeTabCreateCreditScoreRegistry" onClick={createCreditScoreRegistry}>
                <span className="ht-cta-secondary-icon"><i className="fa-solid fa-id-card"></i></span>
                <span className="ht-cta-secondary-text">
                  <strong>Create Credit Score Registry</strong>
                  <span>Start from a CreditChain-native Solidity template</span>
                </span>
              </button>
              <div className="ht-action-grid">
                <button className="ht-action-btn" data-id="homeTabAddCreditChain" onClick={addCreditChainTestnet}>
                  <i className="fa-solid fa-wallet"></i>
                  Add Testnet
                </button>
                <a className="ht-action-btn" href={CREDITFORGE_LINKS.creditChainDocs} target="_blank" rel="noreferrer">
                  <i className="fa-solid fa-book-open"></i>
                  Docs
                </a>
              </div>
            </div>

            {/* Start */}
            <div className="ht-section">
              <div className="ht-section-header">
                <span className="ht-section-title"><FormattedMessage id="home.start" defaultMessage="Start" /></span>
              </div>
              <button className="ht-row ht-row-cta" data-id="landingPageImportFromTemplate" onClick={openTemplateSelection}>
                <span className="ht-row-icon ht-row-icon-cta"><i className="fa-solid fa-plus"></i></span>
                <span className="ht-row-text">
                  <strong><FormattedMessage id="home.createNewWorkspace" /></strong>
                  <small>Start from a Forge or EVM template</small>
                </span>
              </button>
              <button className="ht-cta-secondary" data-id="homeTabStartCoding" onClick={startCoding}>
                <span className="ht-cta-secondary-icon"><i className="fa-solid fa-play"></i></span>
                <span className="ht-cta-secondary-text">
                  <strong><FormattedMessage id="home.startCoding" defaultMessage="Start coding" /></strong>
                  <span>Open a Solidity playground workspace</span>
                </span>
              </button>
              <button className="ht-cta-secondary" onClick={startLearnEth}>
                <span className="ht-cta-secondary-icon"><i className="fa-solid fa-book"></i></span>
                <span className="ht-cta-secondary-text">
                  <strong><FormattedMessage id="home.startLearning" /></strong>
                  <span>Interactive Solidity and EVM tutorials</span>
                </span>
              </button>
            </div>

            {/* Open */}
            <div className="ht-section">
              <div className="ht-section-header">
                <span className="ht-section-title"><FormattedMessage id="home.open" defaultMessage="Open" /></span>
              </div>
              <input
                id="ht-upload-input"
                ref={uploadFileRef}
                type="file"
                style={{ display: 'none' }}
                // @ts-ignore
                webkitdirectory=""
                onChange={async (e) => {
                  e.stopPropagation()
                  await plugin.call('menuicons', 'select', 'filePanel')
                  await uploadFolderExcludingRootFolder(e.target, '/')
                }}
              />
              <div className="ht-action-grid">
                <label className="ht-action-btn" htmlFor="ht-upload-input">
                  <i className="fa-solid fa-folder-open"></i>
                  <FormattedMessage id="home.openFolder" defaultMessage="Open Folder" />
                </label>
                <button className="ht-action-btn" data-id="landingPageImportFromGitHubButton" onClick={cloneFromGitHub}>
                  <i className="fa-brands fa-github"></i>
                  <FormattedMessage id="home.clone" />
                </button>
                <button className="ht-action-btn" data-id="landingPageImportFromGistButton" onClick={importFromGist}>
                  <i className="fa-brands fa-github-alt"></i>
                  <FormattedMessage id="home.gist" />
                </button>
              </div>
            </div>

            {/* Desktop download */}
            <div className="ht-section">
              <div className="ht-section-header">
                <span className="ht-section-title"><FormattedMessage id="home.desktop" defaultMessage="Desktop App" /></span>
              </div>
              <a className="ht-cta-secondary" href={CREDITFORGE_LINKS.home} target="_blank" rel="noreferrer">
                <span className="ht-cta-secondary-icon"><i className="fa-solid fa-desktop"></i></span>
                <span className="ht-cta-secondary-text">
                  <strong><FormattedMessage id="home.downloadDesktop" defaultMessage="Forge Cloud" /></strong>
                  <span>CreditChain developer cloud at forge.creditchain.org</span>
                </span>
              </a>
            </div>

            {/* AI */}
            <div className="ht-section">
              <div className="ht-section-header">
                <span className="ht-section-title">AI</span>
              </div>
              <button className="ht-row" style={{ border: '1px solid var(--bs-border-color)' }} data-id="landingPageLoadSkills" onClick={openSkillsSelection}>
                <span className="ht-row-icon" style={{ color: 'var(--custom-ai-color)' }}><i className="fa-solid fa-cube"></i></span>
                <span className="ht-row-text">
                  <strong><FormattedMessage id="home.loadSkills" /></strong>
                  <small>Forge Copilot skill modules</small>
                </span>
              </button>
              <button className="ht-row" style={{ border: '1px solid var(--bs-border-color)' }} data-id="landingPageLoadAudits" onClick={openAuditsSelection}>
                <span className="ht-row-icon" style={{ color: 'var(--custom-ai-color)' }}><i className="fa-solid fa-shield-halved"></i></span>
                <span className="ht-row-text">
                  <strong><FormattedMessage id="home.loadAudits" /></strong>
                  <small>Forge Sentinel audit checklists</small>
                </span>
              </button>
              <button className="ht-row" style={{ border: '1px solid var(--bs-border-color)' }} data-id="landingPageGasOptimization" onClick={startGasOptimization}>
                <span className="ht-row-icon" style={{ color: 'var(--custom-ai-color)' }}><i className="fa-solid fa-gauge-high"></i></span>
                <span className="ht-row-text">
                  <strong><FormattedMessage id="home.startGasOptimizationBtn" /></strong>
                  <small>Optimize gas for CreditChain and EVM networks</small>
                </span>
              </button>
            </div>

          </div>

        </div>
      </ThemeContext.Provider>
    </div>
  )
}

export default ForgeUiHomeTab
