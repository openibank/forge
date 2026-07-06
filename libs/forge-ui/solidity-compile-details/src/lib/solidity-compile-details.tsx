import { CopyToClipboard } from '@creditchain/forge-ui/clipboard'
import { CustomTooltip } from '@creditchain/forge-ui/helper'
import { TreeView, TreeViewItem } from '@creditchain/forge-ui/tree-view'
import { ContractPropertyName } from '@creditchain/forge-ui/solidity-compiler'

import React from 'react'
import SolidityCompile from './components/solidityCompile'

export interface ForgeUiCompileDetailsProps {
  plugin?: any
  contractProperties?: any
  selectedContract?: string
  help?: any
  insertValue?: any
  saveAs: any
}

export function ForgeUiCompileDetails({ plugin, contractProperties, selectedContract, saveAs, help, insertValue }: ForgeUiCompileDetailsProps) {

  return (
    <>
      <SolidityCompile
        contractProperties={contractProperties}
        plugin={plugin}
        selectedContract={selectedContract}
        help={help}
        insertValue={insertValue}
        saveAs={saveAs}
      />
    </>
  )
}
