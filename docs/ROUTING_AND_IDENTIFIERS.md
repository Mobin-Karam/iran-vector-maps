# Routing and identifiers

The map has two identifier layers. They serve different jobs and must not be confused.

| Field | Intended use | Example |
| --- | --- | --- |
| `slug` | Public URLs and user-facing links | `kermanshah`, `sonqor` |
| `id` / `code` | Data joins, asset loading, metric imports, and callbacks | `IR-05`, `1050005` |

## Public routes

Use a readable province or county slug in all links rendered for people:

```text
/map/province/kermanshah
/map/province/kermanshah/county/sonqor
```

The app accepts the historical code route and immediately replaces it with the canonical readable URL. This preserves existing bookmarks while preventing new code-heavy links from being shared.

## Importing and joining data

Use `regionId` or `code` for analytical data. Names and slugs are accepted by the demo importer as a convenience, but a stored dataset should use the stable ID:

```json
[
  { "regionId": "IR-05", "labelFa": "تولد ثبت‌شده", "value": 12840 },
  { "regionId": "1050005", "labelFa": "تولد ثبت‌شده", "value": 760 }
]
```

The region catalog at `maps/iran/regions.json` contains `id`, `code`, `slug`, `nameFa`, `nameEn`, level, and parent metadata. Use the `iran-vector-maps-data` helpers to resolve a public slug before loading assets.

## Package boundary

`iran-vector-maps` is the generic renderer. It accepts stable feature IDs and does not impose routes. `iran-vector-maps-data` supplies the Iran catalog and helpers that understand public slugs, stable codes, and asset URLs.
