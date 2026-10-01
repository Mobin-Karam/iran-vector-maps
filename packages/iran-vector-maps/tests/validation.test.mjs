import assert from 'node:assert/strict'
import test from 'node:test'
import { parseMapValuesCsv } from '../dist/csv.js'
import { validateMapFeatureCollection } from '../dist/validation.js'

const validCollection = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { id: 'IR-05', nameFa: 'کرمانشاه' }, geometry: { type: 'Polygon', coordinates: [[[46, 34], [47, 34], [47, 35], [46, 34]]] } }] }

test('accepts a valid region collection', () => {
  assert.deepEqual(validateMapFeatureCollection(validCollection), { valid: true, issues: [] })
})

test('reports duplicate IDs and invalid geometry', () => {
  const invalid = { ...validCollection, features: [...validCollection.features, { ...validCollection.features[0], geometry: { type: 'Point', coordinates: [0, 0] } }] }
  const result = validateMapFeatureCollection(invalid)
  assert.equal(result.valid, false)
  assert.equal(result.issues.some((issue) => issue.message.includes('Duplicate region ID')), true)
  assert.equal(result.issues.some((issue) => issue.message.includes('Polygon or MultiPolygon')), true)
})

test('parses Persian digits and reports invalid metric rows', () => {
  const result = parseMapValuesCsv('regionId,value\nIR-05,۱۲٬۸۴۰\nIR-07,no-data')
  assert.equal(result.values.get('IR-05'), 12840)
  assert.equal(result.issues.length, 1)
  assert.match(result.issues[0].message, /Invalid numeric value/)
})
