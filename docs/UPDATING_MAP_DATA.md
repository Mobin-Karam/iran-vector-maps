# Updating map data

1. Place downloaded source material under `data-source/`; never overwrite it with generated output.
2. Record the source, license, retrieval date, scope, and limitations in `DATA_SOURCES.md`.
3. Ensure OSM county inputs are arranged as `data-source/osm-counties/data/counties/IR-XX/IR-XX.all.min.geojson`.
4. Run `npm run maps:build`. It checks feature geometry, assigns stable IDs, normalises Persian names, creates independently cacheable TopoJSON assets, and produces the metadata/search indexes.
5. Run `npm test`, `npm run lint`, and `npm run build`. Inspect `/map`, a province route, a county route, hover labels, and an imported data overlay before release.

Do not add inferred districts, municipal polygons, or settlements. Add a level only after its source, parent relationships, and geometry have been verified and documented.
