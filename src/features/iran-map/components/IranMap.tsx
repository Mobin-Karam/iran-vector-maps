import { BookOpen, ChevronLeft, Code2, LocateFixed, Moon, RotateCcw, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getGeometry, getManifest, getRegions, type IranMapManifest } from '../data/loaders'
import { regionUrl } from '../lib/map-url'
import type { AdministrativeRegion, MapCollection, MapFeatureProperties } from '../model/map.types'
import { GeoMap } from './GeoMap'
import { MapSearch } from './MapSearch'
import { DataWorkspace } from './DataWorkspace'
import { SampleDownload } from './SampleDownload'
import { MapStyleExport } from './MapStyleExport'
import './tooltip.css'
import './map-ui.css'
import './map-centered.css'
import './calm-theme.css'
import './performance.css'

const levels: Record<AdministrativeRegion['level'], string> = { country: 'کشور', province: 'استان', county: 'شهرستان', district: 'بخش', city: 'شهر', 'rural-district': 'دهستان', settlement: 'روستا / آبادی' }

export function IranMap() {
  const navigate = useNavigate()
  const { provinceId, countyId } = useParams()
  const activeId = countyId ?? provinceId ?? 'IR'
  const [regions, setRegions] = useState<AdministrativeRegion[]>([])
  const [manifest, setManifest] = useState<IranMapManifest>()
  const [geometry, setGeometry] = useState<MapCollection>()
  const [selectedId, setSelectedId] = useState<string>()
  const [hovered, setHovered] = useState<MapFeatureProperties | null>(null)
  const [error, setError] = useState<string>()
  const [dark, setDark] = useState(false)

  useEffect(() => { getRegions().then(setRegions).catch(() => setError('فهرست مناطق در دسترس نیست.')) }, [])
  useEffect(() => { getManifest().then(setManifest).catch(() => undefined) }, [])
  useEffect(() => {
    let cancelled = false
    getGeometry(countyId ? `${provinceId}` : activeId).then((value) => { if (!cancelled) { setGeometry(value); setError(undefined) } }).catch(() => { if (!cancelled) setError('اطلاعات مرزی این منطقه در حال حاضر موجود نیست.') })
    return () => { cancelled = true }
  }, [activeId, countyId, provinceId])
  const active = regions.find((region) => region.id === activeId)
  const selected = regions.find((region) => region.id === selectedId) ?? active
  const crumbs = useMemo(() => { const items: AdministrativeRegion[] = []; let current = active; while (current) { items.unshift(current); current = regions.find((region) => region.id === current?.parentId) } return items }, [active, regions])
  useEffect(() => { document.title = active ? `نقشه ${levels[active.level]} ${active.nameFa}` : 'نقشه تقسیمات کشوری ایران' }, [active])
  const mapTitle = active?.level === 'province' ? `شهرستان‌های استان ${active.nameFa}` : 'استان‌های ایران'
  const mapHint = active?.level === 'province' ? 'برای دیدن اطلاعات، یک شهرستان را انتخاب کنید.' : 'برای ورود به هر استان روی آن کلیک کنید.'
  const mapFeatureCount = `${geometry?.features.length ?? 0} مرز واقعی${manifest ? ` · داده ${manifest.datasetVersion}` : ''}`

  return <main className={dark ? 'app dark' : 'app'}>
    <header><div className="brand"><span>نقشهٔ ایران</span><small>سامانهٔ تقسیمات کشوری</small></div><MapSearch regions={regions} onSelect={(region) => { setSelectedId(region.id); navigate(regionUrl(region, regions)) }} /><div className="header-actions"><Link className="icon-button" to="/package" aria-label="بستهٔ React"><Code2 size={19} /></Link><Link className="icon-button" to="/about" aria-label="راهنمای استفاده"><BookOpen size={19} /></Link><button className="icon-button" onClick={() => setDark(!dark)} aria-label="تغییر حالت رنگ">{dark ? <Sun size={19} /> : <Moon size={19} />}</button></div></header>
    <nav className="breadcrumbs" aria-label="مسیر نقشه">{crumbs.map((crumb, index) => <span key={crumb.id}>{index > 0 && <ChevronLeft size={15} />}<button disabled={index === crumbs.length - 1} onClick={() => navigate(regionUrl(crumb, regions))}>{crumb.nameFa}</button></span>)}</nav>
    <section className="map-layout"><div className="map-card"><div className="map-status"><div><strong>{mapTitle}</strong><small>{mapHint}</small></div><div><button className="control" onClick={() => navigate('/map')}><RotateCcw size={17} /> نمای ایران</button><button className="control" onClick={() => setSelectedId(activeId)} aria-label="انتخاب منطقهٔ جاری"><LocateFixed size={17} /></button></div></div>{error ? <div className="empty"><strong>{error}</strong><button onClick={() => navigate('/map')}>بازگشت به ایران</button></div> : geometry ? <div className="map-visual"><GeoMap data={geometry} selectedId={selectedId} onSelect={setSelectedId} onOpen={(region) => { if (region.level === 'province') navigate(`/map/province/${region.id}`) }} onHover={setHovered} />{hovered && <div className="map-tooltip"><strong>{hovered.nameFa}</strong>{hovered.nameEn && <span>{hovered.nameEn}</span>}<small>{levels[hovered.level]} · برای انتخاب کلیک کنید</small></div>}<div className="map-count">{mapFeatureCount}</div></div> : <div className="loading">در حال آماده‌سازی نقشه…</div>}</div>
      <aside className="details" aria-live="polite">{selected ? <><div className="details-top"><p className="eyebrow">{levels[selected.level]}</p><span className="live-dot" /></div><h1>{selected.nameFa}</h1>{selected.nameEn && <p className="en">{selected.nameEn}</p>}<dl><div><dt>منبع داده</dt><dd>{selected.source}</dd></div>{selected.children?.counties !== undefined && <div><dt>شهرستان‌ها</dt><dd>{selected.children.counties}</dd></div>}{selected.children?.districts !== undefined && <div><dt>بخش‌ها</dt><dd>{selected.children.districts}</dd></div>}{selected.children?.cities !== undefined && <div><dt>شهرها</dt><dd>{selected.children.cities}</dd></div>}<div><dt>سطح</dt><dd>{levels[selected.level]}</dd></div></dl>{selected.level === 'province' && <button className="primary" onClick={() => navigate(regionUrl(selected, regions))}>نمایش نقشهٔ شهرستان‌ها <ChevronLeft size={17} /></button>}{selected.level === 'county' && <p className="notice">جزئیات بخش‌ها و شهرها از منبع رسمی به‌روز است. مرز SVG آن‌ها پس از تأیید هندسی افزوده می‌شود.</p>}</> : <div className="welcome"><span className="radar" /><strong>کاوش نقشه</strong><p>برای شروع، یک استان را انتخاب کنید.</p></div>}</aside></section>
    <footer><span><i className="dot capital" /> انتخاب‌شده</span><span><i className="dot" /> مرز اداری واقعی</span><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© مشارکت‌کنندگان OpenStreetMap</a></footer><SampleDownload /><MapStyleExport /><DataWorkspace regions={regions} />
  </main>
}
