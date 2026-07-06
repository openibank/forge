import React, { useState } from 'react'
import { FeedbackAlertProps } from '../../types/compilerTypes'
import { RenderIf } from '@creditchain/forge-ui/helper'
import { CopyToClipboard } from '@creditchain/forge-ui/clipboard'
import { FormattedMessage } from 'react-intl'

export function FeedbackAlert ({ message, askGPT }: FeedbackAlertProps) {
  const [showAlert, setShowAlert] = useState<boolean>(true)

  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  return (
    <RenderIf condition={showAlert}>
      <>
        <span> { message } </span>
        <div className="close" data-id="renderer" onClick={handleCloseAlert}>
          <i className="fas fa-times"></i>
        </div>
        <div className="d-flex pt-1 flex-row-reverse">
          <span className="ms-3 pt-1 py-1" >
            <CopyToClipboard content={message} className="p-0 m-0 far fa-copy error" direction={'top'} />
          </span>
          <button
            className="btn btn-ai"
            data-id="ask-forge-copilot-button"
            onClick={(event) => {
              event.stopPropagation()
              askGPT() }}
          >
            <img src="assets/img/creditchain-logo.svg" alt="Forge Copilot" className="explain-icon" />
            <span><FormattedMessage id="helper.askRemixAI" /></span>
          </button>
        </div>
      </>
    </RenderIf>
  )
}
