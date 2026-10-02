# Contributing

Thank you for improving Iran Vector Maps. Contributions are welcome for renderer behavior, documentation, examples, tests, and verified data corrections.

## Before opening a pull request

```bash
npm install
npm run package:build
npm run data:build
npm test
npm run lint
npm run build
npm run test:e2e
```

Do not add `node_modules`, generated `dist` directories, or raw upstream downloads. Keep the renderer package framework-neutral and put Iran boundary delivery in `iran-vector-maps-data`.

## Boundary and metadata corrections

Use the **Boundary or data report** issue template. Include a stable region ID, Persian name, reproducible issue, and a verifiable source. Do not submit inferred geometry or visual approximations. Update `DATA_SOURCES.md` and coverage tests with any accepted data change.

## Public API changes

Keep exports typed and backwards compatible in minor versions. Add package tests and a README example for each public export. Breaking changes require a major version, a migration entry, and a changelog note.
