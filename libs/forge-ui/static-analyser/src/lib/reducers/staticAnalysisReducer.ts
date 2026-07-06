import { CompilationResult, SourceWithTarget } from "@remixproject/plugin-api"
import { ForgeUiStaticAnalyserReducerActionType, ForgeUiStaticAnalyserState } from "../../staticanalyser"

export const initialState: ForgeUiStaticAnalyserState = {
  file: '',
  source: null,
  languageVersion: '',
  data: null,
  input: '',
  version: ''
}

export const analysisReducer = (state: ForgeUiStaticAnalyserState,
  action: ForgeUiStaticAnalyserReducerActionType) => {
  switch (action.type) {
  case 'compilationFinished':
    return {
      ...state,
      file: action.payload.file,
      source: action.payload.source,
      languageVersion: action.payload.languageVersion,
      data: action.payload.data,
      input: action.payload.input,
      version: action.payload.version
    }
  default:
    return initialState
  }
}

type someReducerState = {
  solhintEnabled?: boolean
  basicEnabled?: boolean
  slitherEnabled?: boolean
  isSupportedVersion?: boolean
  compiledState?: { data: CompilationResult, langVersion: string, fileName: string, source: SourceWithTarget, input: string }
}

