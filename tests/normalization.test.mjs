import test from 'node:test'
import assert from 'node:assert/strict'

const normalize = (value) => value.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u200f\ufeff]/g, ' ').replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\s+/g, ' ').trim().toLocaleLowerCase('fa')
test('normalizes Arabic Persian characters and whitespace', () => assert.equal(normalize('  كرمان\u200cشاه '), 'کرمان شاه'))
test('normalizes Persian and Arabic digits', () => assert.equal(normalize('۱۲٣'), '123'))
