#!/usr/bin/env node
import type { CliArgs } from './types'
import arg from 'arg'
import getRootDir from 'root-dir-path'
import { logger, exit, getCurrentPackageManager, formatDuration } from './utils'
import { version } from '../package.json'

const helpMessage = `
Usage: jpmm migrate npm | yarn | yarn2 | pnpm

Options:
  -f, --from <name>      specify package manager to migrate from
  -h, --help             output usage information
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
      '--from': String,
      '--help': Boolean,
      '--root': String,
      '--version': Boolean,

      '-f': '--from',
      '-h': '--help',
      '-r': '--root',
      '-v': '--version',
    },
    {
      permissive: true,
      argv,
    }
  )
  const packageManager = args._[0] === 'migrate' ? args._[1] : args._[0]
  const parsedArgs: CliArgs = {
    packageManager,
    from: args['--from'],
    help: args['--help'],
    root: args['--root'],
    version: args['--version'],
  }
  return parsedArgs
}

async function run(args: CliArgs) {
  const migrate: typeof import('./index').migrate = require('./index').migrate
  const packageManager = args.packageManager
  const rootDir = (args.root || getRootDir()) ?? process.cwd()
  const currentPM = args.from || getCurrentPackageManager(rootDir)

  if (args.version) {
    return logger.log(version)
  }
  if (args.help || !packageManager) {
    return help()
  }

  let timeStart = Date.now()
  let timeEnd
  try {
    migrate(currentPM, packageManager, rootDir)
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
