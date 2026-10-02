import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const dataset = JSON.parse(readFileSync(new URL('../public/maps/iran/cities.json', import.meta.url), 'utf8'))
const review = JSON.parse(readFileSync(new URL('../public/maps/iran/city-coordinate-review.json', import.meta.url), 'utf8'))

test('city dataset keeps the full official 1404 hierarchy', () => {
  assert.equal(dataset.cities.length, 1481)
  assert.equal(dataset.counts.records, 1481)
  assert.equal(dataset.googleMapsUsed, false)
})

test('city coordinates stay inside broad Iran bounds', () => {
  for (const city of dataset.cities) {
    if (city.latitude === null || city.longitude === null) continue
    assert.ok(city.latitude >= 24 && city.latitude <= 40.5, `latitude out of bounds: ${city.nameFa}`)
    assert.ok(city.longitude >= 44 && city.longitude <= 64, `longitude out of bounds: ${city.nameFa}`)
  }
})

test('province-capital labels are complete and derived zones never label', () => {
  assert.equal(dataset.cities.filter(city => city.isProvinceCapital && city.labelEnabled).length, 31)
  for (const city of dataset.cities.filter(city => city.recordKind === 'derived-zone')) assert.equal(city.labelEnabled, false)
})

test('review queue matches unresolved independent cities', () => {
  const unresolved = dataset.cities.filter(city => city.recordKind === 'city' && (city.latitude === null || city.longitude === null))
  assert.equal(review.count, unresolved.length)
  assert.deepEqual(new Set(review.cities.map(city => city.id)), new Set(unresolved.map(city => city.id)))
})
