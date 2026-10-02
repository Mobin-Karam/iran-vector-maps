import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import test from 'node:test'

const cityDirectory = new URL('../public/maps/iran/cities/', import.meta.url)

test('city location assets cover every province and retain county relationships', async () => {
  const files = (await readdir(cityDirectory)).filter((file) => file.endsWith('.json')).sort()
  assert.equal(files.length, 31)

  const cityIds = new Set()
  let cityCount = 0
  let geolocatedCount = 0
  for (const file of files) {
    const asset = JSON.parse(await readFile(new URL(file, cityDirectory), 'utf8'))
    assert.match(asset.province.id, /^IR-\d{2}$/)
    assert.equal(asset.cities.length, asset.cityCount)
    for (const city of asset.cities) {
      cityCount += 1
      assert.equal(city.provinceId, asset.province.id)
      assert.ok(city.id)
      assert.ok(city.nameFa)
      assert.ok(city.countyId)
      assert.ok(city.countyNameFa)
      assert.equal(cityIds.has(city.id), false, `duplicate city ID: ${city.id}`)
      cityIds.add(city.id)
      if (city.coordinateStatus !== 'unresolved') {
        assert.equal(typeof city.latitude, 'number')
        assert.equal(typeof city.longitude, 'number')
        geolocatedCount += 1
      }
    }
  }
  assert.equal(cityCount, 1481)
  assert.equal(geolocatedCount, 1154)
})
