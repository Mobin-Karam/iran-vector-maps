import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { normalizePersian } from '../lib/normalization'
import type { AdministrativeRegion } from '../model/map.types'
const labels: Record<AdministrativeRegion['level'], string> = { country: 'کشور', province: 'استان', county: 'شهرستان', district: 'بخش', city: 'شهر', 'rural-district': 'دهستان', settlement: 'روستا / آبادی' }
export function MapSearch({ regions, onSelect }: { regions: AdministrativeRegion[]; onSelect: (region: AdministrativeRegion) => void }) {
  const [query, setQuery] = useState(''); const [active, setActive] = useState(0)
  const results = useMemo(() => { const value = normalizePersian(query); return value ? regions.filter((region) => [region.nameFa, region.nameEn, region.code].filter(Boolean).some((item) => normalizePersian(item!).includes(value))).slice(0, 8) : [] }, [query, regions])
  const choose = (region: AdministrativeRegion) => { onSelect(region); setQuery('') }
  return <div className="search-wrap"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => { setQuery(event.target.value); setActive(0) }} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); setActive(Math.min(active + 1, results.length - 1)) } if (event.key === 'ArrowUp') { event.preventDefault(); setActive(Math.max(active - 1, 0)) } if (event.key === 'Enter' && results[active]) choose(results[active]); if (event.key === 'Escape') setQuery('') }} placeholder="جستجوی استان، شهرستان، شهر…" role="combobox" aria-expanded={results.length > 0} aria-controls="search-results" />{query && <button aria-label="پاک کردن جستجو" onClick={() => setQuery('')}><X size={16} /></button>}{results.length > 0 && <ul id="search-results" role="listbox">{results.map((region, index) => <li key={region.id}><button className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onClick={() => choose(region)} role="option" aria-selected={active === index}><strong>{region.nameFa}</strong><span>{labels[region.level]}{region.nameEn ? ` · ${region.nameEn}` : ''}</span></button></li>)}</ul>}</div>
}
