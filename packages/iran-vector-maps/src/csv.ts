import type { MapCsvParseResult } from './types.js'

function parseRow(line: string, separator: string) {
  const cells: string[] = []; let cell = ''; let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"') { if (quoted && line[index + 1] === '"') { cell += '"'; index += 1 } else quoted = !quoted }
    else if (character === separator && !quoted) { cells.push(cell.trim()); cell = '' }
    else cell += character
  }
  cells.push(cell.trim())
  return cells
}

function numericValue(value: string) {
  const normalized = value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/[٬,]/g, '').trim()
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function parseMapValuesCsv(csv: string, options: { idColumn?: string; valueColumn?: string; separator?: ',' | ';' } = {}): MapCsvParseResult {
  const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim())
  if (!lines.length) return { values: new Map(), issues: [{ row: 0, message: 'CSV is empty.' }] }
  const separator = options.separator ?? (lines[0].includes(';') ? ';' : ',')
  const headers = parseRow(lines[0], separator)
  const idIndex = headers.indexOf(options.idColumn ?? 'regionId')
  const valueIndex = headers.indexOf(options.valueColumn ?? 'value')
  if (idIndex < 0 || valueIndex < 0) return { values: new Map(), issues: [{ row: 1, message: `Expected columns "${options.idColumn ?? 'regionId'}" and "${options.valueColumn ?? 'value'}".` }] }
  const values = new Map<string, number>(); const issues: MapCsvParseResult['issues'] = []
  lines.slice(1).forEach((line, lineIndex) => {
    const row = lineIndex + 2; const cells = parseRow(line, separator); const id = cells[idIndex]?.trim(); const value = numericValue(cells[valueIndex] ?? '')
    if (!id) issues.push({ row, message: 'Region ID is required.' })
    else if (value === undefined) issues.push({ row, message: `Invalid numeric value for ${id}.` })
    else if (values.has(id)) issues.push({ row, message: `Duplicate region ID: ${id}.` })
    else values.set(id, value)
  })
  return { values, issues }
}

export function findUnknownRegionIds(values: ReadonlyMap<string, number>, regions: Iterable<string>) {
  const known = new Set(regions)
  return [...values.keys()].filter((id) => !known.has(id))
}
