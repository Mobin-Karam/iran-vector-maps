import { LocateFixed, Moon, RotateCcw, Sun } from 'lucide-react'
import type { AdministrativeRegion } from '../model/map.types'
import { MapSearch } from './MapSearch'
import './map-workspace-header.css'

interface Props {
  regions: AdministrativeRegion[]
  title: string
  hint: string
  dark: boolean
  onSearchSelect: (region: AdministrativeRegion) => void
  onReset: () => void
  onLocate: () => void
  onThemeToggle: () => void
}

export function MapWorkspaceHeader({ regions, title, hint, dark, onSearchSelect, onReset, onLocate, onThemeToggle }: Props) {
  return <section className="map-workspace-header" aria-label="ابزارهای نقشه">
    <div className="map-workspace-title"><strong>{title}</strong><small>{hint}</small></div>
    <MapSearch regions={regions} onSelect={onSearchSelect} />
    <div className="map-workspace-actions">
      <button className="control" onClick={onReset}><RotateCcw size={17} /> نمای ایران</button>
      <button className="control icon-only" onClick={onLocate} aria-label="انتخاب منطقهٔ جاری" title="انتخاب منطقهٔ جاری"><LocateFixed size={17} /></button>
      <button className="control icon-only" onClick={onThemeToggle} aria-label="تغییر حالت رنگ" title="تغییر حالت رنگ">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
    </div>
  </section>
}
