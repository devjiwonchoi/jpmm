// import type { JscTarget } from '@swc/core'
// import type { InputOptions, OutputOptions, RollupOptions } from 'rollup'

type PackageType = 'commonjs' | 'module'

type ExportType =
  | 'import'
  | 'module'
  | 'require'
  | 'default'
  | 'node'
  | 'react-server'
  | 'react-native'
  | 'browser'
  | 'edge-light'
  | 'types'

type FullExportCondition = {
  [key: string]: string
}

type ExportCondition =
  | string
  | {
      [key: string]: ExportCondition | string
    }

type PackageMetadata = {
  name?: string
  main?: string
  module?: string
  type?: 'commonjs' | 'module'
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  peerDependenciesMeta?: Record<string, Record<string, string>>
  exports?: string | Record<string, ExportCondition>
  types?: string
  typings?: string
}
type CliArgs = {
  name?: string
  root?: string
  help?: boolean
  version?: boolean
}

type BuildMetadata = {
  source: string
}

type ParsedExportCondition = {
  source: string
  name: string
  export: FullExportCondition
}

type ExportPaths = Record<string, FullExportCondition>

export type {
  ExportPaths,
  ExportType,
  CliArgs,
  ExportCondition,
  PackageMetadata,
  BuildMetadata,
  FullExportCondition,
  PackageType,
  ParsedExportCondition,
}
