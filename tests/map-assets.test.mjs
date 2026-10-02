import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { feature } from 'topojson-client'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8').then(JSON.parse)

test('published map manifest reports complete province and county coverage', async () => {
  const [manifest, regions, topology] = await Promise.all([
    read('public/maps/iran/manifest.json'),
    read('public/maps/iran/regions.json'),
    read('public/maps/iran/provinces.topo.json'),
  ])
  const provinces = feature(topology, topology.objects.provinces)
  assert.equal(provinces.features.length, 31)
  assert.equal(regions.filter((region) => region.level === 'province').length, 31)
  assert.equal(manifest.availableGeometry.counties.length, 31)
  assert.equal(manifest.unavailable.includes('district'), true)
  for (const item of provinces.features) {
    assert.match(item.properties.id, /^IR-\d{2}$/)
    assert.equal(item.properties.parentId, 'IR')
    assert.ok(item.properties.nameFa)
  }
})

test('every county asset has valid unique IDs and its declared province parent', async () => {
  const manifest = await read('public/maps/iran/manifest.json')
  for (const provinceId of manifest.availableGeometry.counties) {
    const topology = await read(`public/maps/iran/regions/${provinceId}/counties.topo.json`)
    const counties = feature(topology, topology.objects.counties)
    const ids = new Set()
    assert.ok(counties.features.length > 0, `${provinceId} needs counties`)
    for (const county of counties.features) {
      assert.ok(county.properties.id)
      assert.equal(ids.has(county.properties.id), false, `${provinceId} contains duplicate county ID`)
      ids.add(county.properties.id)
      assert.equal(county.properties.parentId, provinceId)
      assert.ok(county.properties.nameFa)
      assert.ok(['Polygon', 'MultiPolygon'].includes(county.geometry.type))
    }
  }
})
