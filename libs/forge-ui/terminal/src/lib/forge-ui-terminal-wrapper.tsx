import { appPlatformTypes, platformContext } from '@creditchain/forge-ui/app'
import { ForgeUiXterminals, xTerminInitialState, xtermReducer } from '@creditchain/forge-ui/xterm'
import React, { useContext, useReducer } from 'react' // eslint-disable-line
import { ForgeUITerminalBar } from './components/forge-ui-terminal-bar'
import { TerminalContext } from './context'
import { initialState, registerCommandReducer } from './reducers/terminalReducer'
import ForgeUiTerminal from './forge-ui-terminal'
import { ForgeUiTerminalProps } from './types/terminalTypes'

export const ForgeUITerminalWrapper = (props: ForgeUiTerminalProps) => {
  const [terminalState, dispatch] = useReducer(registerCommandReducer, initialState)
  const [xtermState, dispatchXterm] = useReducer(xtermReducer, xTerminInitialState)
  const platform = useContext(platformContext)
  const providerState = {
    terminalState,
    dispatch,
    xtermState,
    dispatchXterm
  }

  return (<>
    <TerminalContext.Provider value={providerState}>
      <ForgeUITerminalBar {...props} />
      {platform !== appPlatformTypes.desktop && <ForgeUiTerminal {...props} />}
      {platform === appPlatformTypes.desktop &&
        <>
          <ForgeUiTerminal visible={xtermState.showOutput} plugin={props.plugin} onReady={props.onReady} isDebugging={props.isDebugging} debuggerCallStack={props.debuggerCallStack} />
          <ForgeUiXterminals {...props} />
        </>
      }
    </TerminalContext.Provider>
  </>)
}