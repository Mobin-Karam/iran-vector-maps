import assert from 'node:assert/strict'
import test from 'node:test'

import { parseRegionValueRows } from '../src/features/iran-map/lib/import-data.ts'

test('parseRegionValueRows accepts JSON and CSV row structures', () => {
  const fromJson = parseRegionValueRows({ تهران: 100, اصفهان: 72 })
  assert.deepEqual(fromJson, [
    { regionKey: 'تهران', value: 100 },
    { regionKey: 'اصفهان', value: 72 },
  ])

  const fromCsv = parseRegionValueRows('نام,مقدار\nتهران,100\nاصفهان,72\n')
  assert.deepEqual(fromCsv, [
    { regionKey: 'تهران', value: 100 },
    { regionKey: 'اصفهان', value: 72 },
  ])
})

test('parseRegionValueRows normalizes Persian and English names consistently', () => {
  const rows = parseRegionValueRows('province,value\nTehran,42\nخراسان رضوی,18\n')
  assert.equal(rows[0].regionKey, 'tehran')
  assert.equal(rows[1].regionKey, 'خراسان رضوی')
})
