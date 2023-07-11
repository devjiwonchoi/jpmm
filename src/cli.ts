#!/usr/bin/env node
import type { CliArgs } from './types'
import arg from 'arg'
import getRootDir from 'root-dir-path'
import { logger, exit, formatDuration } from './utils'
import { version } from '../package.json'

const helpMessage = `
Usage: jpmm [options]

Options:
  -h, --help             output usage information
  -m, --migrate <name>   start migration to given package manager
  -r, --root <path>      specify root directory path
  -v, --version          output the jpmm version
`

function help() {
  logger.log(helpMessage)
}

function parseCliArgs(argv: string[]) {
  let args: arg.Result<any> | undefined
  args = arg(
    {
      '--help': Boolean,
      '--migrate': String,
      '--root': String,
      '--version': Boolean,

      '-h': '--help',
      '-m': '--migrate',
      '-r': '--root',
      '-v': '--version',
    },
    {
      permissive: true,
      argv,
    }
  )
  const parsedArgs: CliArgs = {
    name: args['--migrate'],
    root: args['--root'],
    help: args['--help'],
    version: args['--version'],
  }
  return parsedArgs
}

async function run(args: CliArgs) {
  const { name } = args
  const rootDir = (args.root || getRootDir()) ?? process.cwd()
  const migrate: typeof import('./index').migrate = require('./index').migrate

  if (args.version) {
    return logger.log(version)
  }
  if (args.help || !name) {
    return help()
  }

  let timeStart = Date.now()
  let timeEnd
  try {
    migrate(name!, rootDir)
    timeEnd = Date.now()
  } catch (err: any) {
    if (err.name === 'NOT_EXISTED') {
      help()
      return exit(err)
    }
    throw err
  }

  const duration = timeEnd - timeStart

  // build mode
  logger.log(`✨  Finished in ${formatDuration(duration)}`)
}

async function main() {
  let params, error
  try {
    params = parseCliArgs(process.argv.slice(2))
  } catch (err) {
    error = err
  }
  if (error || !params) {
    if (!error) help()
    return exit(error as Error)
  }
  await run(params)
}

main().catch(exit)
