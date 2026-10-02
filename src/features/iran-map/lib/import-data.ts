export type ImportRegionRow = {
  regionKey: string
  value: number
}

export type ResolvedImportRow = {
  regionId: string
  value: number
}

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const normalized = value
      .replace(/٬/g, '')
      .replace(/\s+/g, '')
      .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
      .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
      .trim()
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : Number.NaN
  }
  return Number.NaN
}

const normalizeKey = (value: unknown): string => {
  const text = String(value ?? '').trim()
  if (!text) return ''
  const direct = text
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200c\u200f\ufeff]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (/[\u0600-\u06FF]/.test(direct)) {
    return direct.toLocaleLowerCase('fa')
  }

  return direct.toLocaleLowerCase()
}

export function parseRegionValueRows(input: unknown): ImportRegionRow[] {
  if (Array.isArray(input)) {
    return input
      .map((row) => {
        if (!row || typeof row !== 'object') return null
        const regionKey = row.regionName ?? row.region ?? row.name ?? row.province ?? row.county ?? row.regionKey ?? row.regionId ?? row.id ?? ''
        const value = row.value ?? row.magnitude ?? row.amount ?? row.total ?? row.count ?? null
        if (!regionKey || value === null || value === undefined || Number.isNaN(toNumber(value))) return null
        return { regionKey: normalizeKey(regionKey), value: Number(toNumber(value)) }
      })
      .filter((row): row is ImportRegionRow => row !== null)
  }

  if (input && typeof input === 'object') {
    const entries = Object.entries(input as Record<string, unknown>)
    return entries
      .filter(([, value]) => value !== null && value !== undefined && !Number.isNaN(toNumber(value)))
      .map(([regionKey, value]) => ({ regionKey: normalizeKey(regionKey), value: Number(toNumber(value)) }))
  }

  if (typeof input !== 'string') return []

  const trimmed = input.trim()
  if (!trimmed) return []

  const rows = trimmed.split(/\r?\n/).filter((line) => line.trim())
  if (rows.length < 2) {
    try {
      const parsed = JSON.parse(trimmed)
      return parseRegionValueRows(parsed)
    } catch {
      return []
    }
  }

  const [headerLine, ...dataLines] = rows
  const header = headerLine.split(/[,;\t]/).map((cell) => cell.trim().toLowerCase())
  const regionIndex = header.findIndex((cell) => cell.includes('name') || cell.includes('province') || cell.includes('county') || cell.includes('region'))
  const valueIndex = header.findIndex((cell) => cell.includes('value') || cell.includes('amount') || cell.includes('count') || cell.includes('metric'))

  if (regionIndex === -1 || valueIndex === -1) {
    return dataLines
      .map((line) => {
        const cells = line.split(/[,;\t]/).map((cell) => cell.trim())
        if (cells.length < 2) return null
        const value = toNumber(cells[1])
        if (Number.isNaN(value)) return null
        return { regionKey: normalizeKey(cells[0]), value }
      })
      .filter((row): row is ImportRegionRow => row !== null)
  }

  return dataLines
    .map((line) => {
      const cells = line.split(/[,;\t]/).map((cell) => cell.trim())
      const regionCell = cells[regionIndex] ?? cells[0]
      const valueCell = cells[valueIndex] ?? cells[1]
      if (!regionCell || Number.isNaN(toNumber(valueCell))) return null
      return { regionKey: normalizeKey(regionCell), value: Number(toNumber(valueCell)) }
    })
    .filter((row): row is ImportRegionRow => row !== null)
}

export function resolveImportedRegionRows(
  rows: Array<ImportRegionRow>,
  regions: Array<{ id: string; nameFa?: string; nameEn?: string; slug?: string }>,
): ResolvedImportRow[] {
  const lookup = new Map<string, string>()
  for (const region of regions) {
    for (const key of [region.id, region.nameFa, region.nameEn, region.slug].filter((value): value is string => Boolean(value))) {
      lookup.set(normalizeKey(key), region.id)
    }
  }

  return rows
    .map((row) => {
      const resolved = lookup.get(normalizeKey(row.regionKey))
      const value = Number(row.value)
      if (!resolved || Number.isNaN(value)) return null
      return { regionId: resolved, value }
    })
    .filter((row): row is ResolvedImportRow => row !== null)
}
