# jpmm (JavaScript Package Manager Migration)

Seamless Migration Tool for JavaScript Package Managers

### Usage:

```bash
$ npx jpmm migrate <package-manager> [options]
```

#### Note: The command `migrate` can be ommited.

### Options:

```
  -f, --from <name>      Specify package manager to migrate from (recommended)
  -h, --help             Output usage information
  -r, --root <path>      Specify root directory path
  -v, --version          Output the jpmm version
```

#### `--from`:

```bash
$ npx jpmm migrate <package-manager> --from <current-package-manager>
```

#### `--root`:

```bash
$ npx jpmm migrate <package-manager> --root <root-directory-path>
```

#### Note: These options will reduce the amount of time it takes to migrate.

### Example:

```bash
$ npx jpmm pnpm -f yarn -r ./my-project
```


### Supported Package Managers:

- [npm](https://www.npmjs.com/)
- [yarn](https://classic.yarnpkg.com/)
- [yarn2](https://yarnpkg.com/)
- [pnpm](https://pnpm.io/)
