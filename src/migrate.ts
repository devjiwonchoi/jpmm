import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { PackageMetadata } from './types'
import { lockFiles } from './constants'
import { getPackageMeta, hasPackageJson } from './utils'

function updatePackageJson(
  currentPM: string,
  replacingPM: string,
  rootDir: string
) {
  if (!hasPackageJson(rootDir)) {
    throw new Error('package.json not found')
  }

  const packageJsonPath = path.join(rootDir, 'package.json')
  const packageJson = fs.readFileSync(packageJsonPath, 'utf8')

  const updatedContent = packageJson.replace(
    new RegExp(currentPM, 'g'),
    replacingPM
  )

  // Write the updated package.json file
  fs.writeFileSync(packageJsonPath, updatedContent)
}

function removeNodeModules(rootDir: string) {
  const nodeModulesPath = path.join(rootDir, 'node_modules')
  if (fs.existsSync(nodeModulesPath)) {
    fs.rmdirSync(nodeModulesPath, { recursive: true })
  }
}

function migrateToYarn() {
  execSync('yarn init')
  execSync('yarn install')
}

function migrateToYarn2(rootDir: string) {
  execSync('yarn set version berry')
  execSync('yarn init')
  execSync('yarn install')
}

function migrateToNpm(rootDir: string) {
  removeNodeModules(rootDir)
  execSync('npm init')
  execSync('npm install')
}

function migrateToPnpm(
  currentPM: string,
  replacingPM: string,
  rootDir: string,
  packageMeta: PackageMetadata
) {
  if (!fs.existsSync(path.join(rootDir))) {
    execSync('npm install -g pnpm')
  }
  if (packageMeta.workspaces) {
    execSync('pnpm config set -r workspaces > pnpm-workspace.yaml')
  }
  removeNodeModules(rootDir)

  if (
    fs.existsSync(
      path.join(rootDir, lockFiles[currentPM as keyof typeof lockFiles])
    )
  ) {
    execSync('pnpm import')
  }

  execSync(`rm -rf ${lockFiles[currentPM as keyof typeof lockFiles]}`)

  execSync('pnpm install')

  updatePackageJson(currentPM, replacingPM, rootDir)
}

async function migrate(
  currentPM: string,
  replacingPM: string,
  rootDir: string
) {
  console.log(currentPM, replacingPM, rootDir)
  const packageMeta = await getPackageMeta(rootDir)
  try {
    switch (replacingPM) {
      case 'npm':
        migrateToNpm(rootDir)
        break
      case 'yarn':
        migrateToYarn()
        break
      case 'yarn2':
        migrateToYarn2(rootDir)
        break
      case 'pnpm':
        migrateToPnpm(currentPM, replacingPM, rootDir, packageMeta)
        break
    }
  } catch (error) {
    throw error
  }
}

export default migrate
