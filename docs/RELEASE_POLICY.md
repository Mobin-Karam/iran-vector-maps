# Release policy

`iran-vector-maps` and `iran-vector-maps-data` use semantic versioning.

- **Patch:** bug fixes, documentation, or corrections that do not change the public API.
- **Minor:** backwards-compatible API additions, new verified datasets, and new adapters.
- **Major:** removed exports, changed contracts, or changed stable identifiers.

Before a release: run all unit, coverage, package, and browser checks; inspect `npm pack --json`; update the changelog; and add migration notes for breaking changes. A `vX.Y.Z` tag creates GitHub release assets and invokes npm trusted publishing only after the same checks pass.

## npm trusted publishing

The release workflow is `.github/workflows/release.yml`. Configure this exact filename for **both** npm packages under **Settings → Trusted Publisher → GitHub Actions**:

- Organization or user: `Mobin-Karam`
- Repository: `iran-vector-maps`
- Workflow filename: `release.yml`
- Environment: leave empty unless a GitHub Environment is intentionally added to the release job.
- Allowed action: enable direct `npm publish`.

The workflow has `id-token: write`, runs on GitHub-hosted runners, and contains no npm write token. npm exchanges the GitHub OIDC identity for a short-lived publishing credential and creates provenance automatically for public packages. It uses npm 11.5+ and verifies that both package versions equal the pushed tag before it publishes; only after publishing succeeds does it create or update the GitHub Release with the packed tarballs.

To release, update both package versions and changelogs, merge the release commit to `main`, then push one matching tag:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

The trusted-publisher setup is a one-time npm package setting. If it has not been configured for both public packages yet, the workflow intentionally stops at the publish step instead of creating a release that claims packages were published.
