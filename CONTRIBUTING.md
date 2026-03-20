## Publishing a New Version

Run from the `typescript-build-config/` directory.

**1. Bump the version**
```bash
npm version patch   # or minor / major
```

This updates `package.json` and creates a git tag.

**2. Push the tag**
```bash
git push --follow-tags
```

**3. Publish to npm**
```bash
npm publish
```

You must be logged in to npm as a user with publish access to the `@datalackey`
scope:
```bash
npm whoami
```

If not logged in:
```bash
npm login
```

## Adding New Config Presets

Add new files under `src/` and expose them via the `exports` map in
`package.json`. No build step is required — files are published as-is.
