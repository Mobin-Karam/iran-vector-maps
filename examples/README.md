# Examples

- `vite-react` is a runnable Vite project with an interactive threshold-colored map.
- `nextjs/page.tsx` is an App Router client component; load data on the server or through a route handler.
- `remix/app/routes/_index.tsx` is a route example; load data with a Remix loader.

All examples use stable region IDs. For real Iran data, combine `iran-vector-maps` with `iran-vector-maps-data`, then convert the returned TopoJSON through `topojson-client` before rendering.
