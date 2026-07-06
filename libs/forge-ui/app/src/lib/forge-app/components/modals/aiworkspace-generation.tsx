import React, { useContext, useEffect, useState } from 'react'
import { ModalDialog } from '@creditchain/forge-ui/modal-dialog'
import { useDialogDispatchers } from '../../context/provider'
import { AppContext } from '../../context/context'
import { useIntl } from 'react-intl'

export function AiWorkspaceGeneration() {
  const { alert } = useDialogDispatchers()
  const [content, setContent] = useState<string>(null)
  const { isAiWorkspaceBeingGenerated } = useContext(AppContext)
  const intl = useIntl()

  useEffect(() => {
    if (isAiWorkspaceBeingGenerated){
      setContent(intl.formatMessage({ id: 'forgeApp.aiWorkspaceGenerating' }))
    }
  }, [])

  useEffect(() => {
    if (content) {
      alert({ id: 'aiWorkspaceGeneration', title: null, message: content })
    }
  }, [content])

  return <></>
}

