import { LocateFixed, Moon, RotateCcw, Sun } from 'lucide-react'
import type { AdministrativeRegion } from '../model/map.types'
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
  workspaceLabel?: string
}

export function MapWorkspaceHeader({ title, hint, dark, onReset, onLocate, onThemeToggle, workspaceLabel = 'نقشه‌ساز' }: Props) {
  return <section className="map-workspace-header" aria-label="ابزارهای نقشه">
    <div className="map-workspace-brand">
      <div className="workspace-brand"><span className="workspace-brand-mark" aria-hidden="true">✦</span><span>{workspaceLabel}</span></div>
      <div className="workspace-context"><strong>{title}</strong><span>{hint}</span></div>
    </div>
    <div className="map-workspace-actions">
      <button className="lang-switch" type="button" aria-label="تغییر زبان">EN</button>
      <button className="control" onClick={onReset}><RotateCcw size={17} /> نمای ایران</button>
      <button className="control icon-only" onClick={onLocate} aria-label="انتخاب منطقهٔ جاری" title="انتخاب منطقهٔ جاری"><LocateFixed size={17} /></button>
      <button className="control icon-only" onClick={onThemeToggle} aria-label="تغییر حالت رنگ" title="تغییر حالت رنگ">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
    </div>
  </section>
}
