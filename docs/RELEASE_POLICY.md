# Release policy

`iran-vector-maps` and `iran-vector-maps-data` use semantic versioning.

- **Patch:** bug fixes, documentation, or corrections that do not change the public API.
- **Minor:** backwards-compatible API additions, new verified datasets, and new adapters.
- **Major:** removed exports, changed contracts, or changed stable identifiers.

Before a release: run all unit, coverage, package, and browser checks; inspect `npm pack --json`; update the changelog; and add migration notes for breaking changes. A `vX.Y.Z` tag creates GitHub release assets. npm publishing is performed only after the same tarball and version have passed those checks.
