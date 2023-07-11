# jpmm (JavaScript Package Manager Migration)

Seamless Migration Tool for JavaScript Package Managers

### Usage:

```bash
$ jpmm migrate <package-manager> [options]
```

### Options:

```
  -f, --from <name>      Specify package manager to migrate from (recommended)
  -h, --help             Output usage information
  -r, --root <path>      Specify root directory path
  -v, --version          Output the jpmm version
```

#### `--from`:

```bash
$ jpmm migrate <package-manager> --from <current-package-manager>
```

#### `--root`:

```bash
$ jpmm migrate <package-manager> --root <root-directory-path>
```

#### Note: Theseptions will reduce the amount of time it takes to migrate.

### Supported Package Managers:

- [npm](https://www.npmjs.com/)
- [yarn](https://classic.yarnpkg.com/)
- [yarn2](https://yarnpkg.com/)
- [pnpm](https://pnpm.io/)
