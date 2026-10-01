import { mkdir, readFile, writeFile } from 'node:fs/promises'

const packageInfo = JSON.parse(await readFile(new URL('../packages/iran-vector-maps/package.json', import.meta.url), 'utf8'))
const releases = JSON.parse(await readFile(new URL('../packages/iran-vector-maps/releases.json', import.meta.url), 'utf8'))
await mkdir(new URL('../public/', import.meta.url), { recursive: true })
await writeFile(new URL('../public/package-info.json', import.meta.url), `${JSON.stringify({ name: packageInfo.name, version: packageInfo.version, description: packageInfo.description, releases }, null, 2)}\n`)
