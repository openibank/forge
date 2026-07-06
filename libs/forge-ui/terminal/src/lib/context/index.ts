import { Actions, xTerminalUiState } from '@creditchain/forge-ui/xterm'
import React, { Dispatch } from 'react'

type terminalProviderContextType = {
  terminalState: any,
  dispatch: Dispatch<any>,
  xtermState: xTerminalUiState,
  dispatchXterm: Dispatch<Actions>
}

export const TerminalContext = React.createContext<terminalProviderContextType>(null)