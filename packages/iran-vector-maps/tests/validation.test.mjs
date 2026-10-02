import assert from 'node:assert/strict'
import test from 'node:test'
import { parseMapValuesCsv } from '../dist/csv.js'
import { validateMapFeatureCollection } from '../dist/validation.js'
import { createMapColorScale } from '../dist/scale.js'
import { mapValueEntries, mapValuesFromRecords } from '../dist/adapters.js'

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

test('classifies dashboard values with stable threshold colors', () => {
  const fill = createMapColorScale([10, 40, 90], { classification: 'threshold', breaks: [25, 75], colors: ['#dbeafe', '#60a5fa', '#1d4ed8'] })
  assert.equal(fill(undefined), '#dce9dd')
  assert.equal(fill(10), '#dbeafe')
  assert.equal(fill(40), '#60a5fa')
  assert.equal(fill(90), '#1d4ed8')
})

test('derives deterministic quantile breaks from supplied values', () => {
  const fill = createMapColorScale([1, 2, 3, 100], { classification: 'quantile', colors: ['#f8fafc', '#94a3b8'] })
  assert.equal(fill(1), '#f8fafc')
  assert.equal(fill(100), '#94a3b8')
})

test('adapts immutable query records without mutating their source', () => {
  const records = Object.freeze([{ regionId: 'IR-05', value: 9 }, { regionId: 'IR-07', value: 12 }])
  const values = mapValuesFromRecords(records)
  assert.equal(Object.isFrozen(values), true)
  assert.deepEqual(values, { 'IR-05': 9, 'IR-07': 12 })
  assert.deepEqual(mapValueEntries(values), [{ regionId: 'IR-05', value: 9 }, { regionId: 'IR-07', value: 12 }])
})
