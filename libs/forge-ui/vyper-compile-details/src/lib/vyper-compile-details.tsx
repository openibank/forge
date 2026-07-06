/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import React, { useState } from 'react'
import VyperCompile from './vyperCompile'
import { ThemeKeys, ThemeObject } from '@microlink/react-json-view'
import { GitHubCallback } from 'libs/forge-ui/top-bar/src/topbarUtils/gitOauthHandler'
import { GitHubUser } from 'libs/forge-api/src/lib/types/git'
import { GitHubLogin } from 'libs/forge-ui/top-bar/src/components/gitLogin'

interface ForgeUiVyperCompileDetailsProps {
  payload: any
  theme?: ThemeKeys | ThemeObject
  themeStyle?: any
}

export function ForgeUiVyperCompileDetails({ payload, theme, themeStyle }: ForgeUiVyperCompileDetailsProps) {
  const compileResult = payload['compileResult'] ?? {}
  const bcode = compileResult.bytecode ? compileResult.bytecode.object : ''
  const runtimeBcode = compileResult.runtimeBytecode ? compileResult.runtimeBytecode.object : ''
  const ir = compileResult.ir
  const methodIdentifiers= compileResult.methodIdentifiers
  const abi= compileResult.abi
  const compilerVersion = compileResult?.version ?? ''
  const emvVersion = compileResult?.evmVersion ?? ''

  return (
    <>
      <VyperCompile
        result={{ bytecode: bcode, bytecodeRuntime: runtimeBcode, ir: ir, methodIdentifiers: methodIdentifiers, abi: abi, compilerVersion: compilerVersion, evmVersion: emvVersion }}
        theme={theme}
        themeStyle={themeStyle}
      />
    </>
  )
}
