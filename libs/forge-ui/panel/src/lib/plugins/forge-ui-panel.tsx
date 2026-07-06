/* eslint-disable no-undef */
import React, {useEffect, useState} from 'react' // eslint-disable-line
import './panel.css'
import ForgeUIPanelPlugin from './panel-plugin'
import { PluginRecord } from '../types'

/* eslint-disable-next-line */
export interface ForgePanelProps {
  plugins: Record<string, PluginRecord>,
  sourcePlugin?: any
  header: JSX.Element,
  pluginState?: any,
  highlightStamp?: number
}

export function ForgePluginPanel(props: ForgePanelProps) {

  return (
    <>
      {props.header}
      <div className="pluginsContainer">
        <div className="plugins" id="plugins">
          { Object.values(props.plugins).map((pluginRecord) => {
            return <ForgeUIPanelPlugin
              key={pluginRecord.profile.name}
              pluginRecord={pluginRecord}
              initialState={props.pluginState}
              highlightStamp={props.highlightStamp}
              sourcePlugin={props.sourcePlugin}
            />
          }) }
        </div>
      </div>
    </>
  )
}

export default ForgePluginPanel
