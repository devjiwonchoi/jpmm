import migrate from '../src/migrate'

describe('migrate', () => {
  let originalGetPackageMeta
  let originalMigrateToNpm
  let originalMigrateToYarn
  let originalMigrateToYarn2
  let originalMigrateToPnpm

  beforeEach(() => {
    originalGetPackageMeta = jest.requireActual('./utils').getPackageMeta
    jest.mock('./utils', () => ({
      getPackageMeta: jest.fn(() => originalGetPackageMeta('/path/to/project')),
      hasPackageJson: jest.fn(() => true),
      updatePackageJson: jest.fn(),
    }))

    originalMigrateToNpm = jest.requireActual('./migrate').migrateToNpm
    originalMigrateToYarn = jest.requireActual('./migrate').migrateToYarn
    originalMigrateToYarn2 = jest.requireActual('./migrate').migrateToYarn2
    originalMigrateToPnpm = jest.requireActual('./migrate').migrateToPnpm
    jest.mock('./migrate', () => ({
      migrateToNpm: jest.fn(),
      migrateToYarn: jest.fn(),
      migrateToYarn2: jest.fn(),
      migrateToPnpm: jest.fn(),
    }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  it('should call the appropriate migration function for npm', async () => {
    await migrate('yarn', 'npm', '/path/to/project')

    expect(originalMigrateToNpm).toHaveBeenCalledWith('/path/to/project')
    expect(originalMigrateToYarn).not.toHaveBeenCalled()
    expect(originalMigrateToYarn2).not.toHaveBeenCalled()
    expect(originalMigrateToPnpm).not.toHaveBeenCalled()
  })

  it('should call the appropriate migration function for yarn', async () => {
    await migrate('npm', 'yarn', '/path/to/project')

    expect(originalMigrateToYarn).toHaveBeenCalled()
    expect(originalMigrateToNpm).not.toHaveBeenCalled()
    expect(originalMigrateToYarn2).not.toHaveBeenCalled()
    expect(originalMigrateToPnpm).not.toHaveBeenCalled()
  })

  it('should call the appropriate migration function for yarn2', async () => {
    await migrate('npm', 'yarn2', '/path/to/project')

    expect(originalMigrateToYarn2).toHaveBeenCalledWith('/path/to/project')
    expect(originalMigrateToNpm).not.toHaveBeenCalled()
    expect(originalMigrateToYarn).not.toHaveBeenCalled()
    expect(originalMigrateToPnpm).not.toHaveBeenCalled()
  })

  it('should call the appropriate migration function for pnpm', async () => {
    await migrate('yarn', 'pnpm', '/path/to/project')

    expect(originalMigrateToPnpm).toHaveBeenCalledWith(
      'yarn',
      'pnpm',
      '/path/to/project',
      expect.any(Object)
    )
    expect(originalMigrateToNpm).not.toHaveBeenCalled()
    expect(originalMigrateToYarn).not.toHaveBeenCalled()
    expect(originalMigrateToYarn2).not.toHaveBeenCalled()
  })
})
