import { ChevronLeft, Database, Download, Palette } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGeometry, getManifest, getProvinceCities, getRegions, type IranMapManifest } from '../data/loaders'
import { findRegionByRouteKey, regionUrl } from '../lib/map-url'
import { usePageSeo } from '../../../app/seo'
import { SiteChrome } from '../../../components/SiteChrome'
import type { AdministrativeRegion, CityLocation, MapCollection, MapFeatureProperties, ProvinceCities } from '../model/map.types'
import { GeoMap } from './GeoMap'
import { DataWorkspace } from './DataWorkspace'
import { SampleDownload } from './SampleDownload'
import { MapStyleExport } from './MapStyleExport'
import { MapWorkspaceHeader } from './MapWorkspaceHeader'
import { RegionInstallCopy } from './RegionInstallCopy'
import { StudioWorkspaceKit } from './StudioWorkspaceKit'
import './tooltip.css'
import './map-ui.css'
import './map-centered.css'
import './calm-theme.css'
import './performance.css'

const levels: Record<AdministrativeRegion['level'], string> = { country: 'کشور', province: 'استان', county: 'شهرستان', district: 'بخش', city: 'شهر', 'rural-district': 'دهستان', settlement: 'روستا / آبادی' }

export function IranMap({ workspace = 'explorer' }: { workspace?: 'explorer' | 'studio' }) {
  const isStudio = workspace === 'studio'
  const navigate = useNavigate()
  const { provinceSlug, countySlug } = useParams()
  const [regions, setRegions] = useState<AdministrativeRegion[]>([])
  const [manifest, setManifest] = useState<IranMapManifest>()
  const [geometry, setGeometry] = useState<MapCollection>()
  const [nationalGeometry, setNationalGeometry] = useState<MapCollection>()
  const [selectedId, setSelectedId] = useState<string>()
  const [hovered, setHovered] = useState<MapFeatureProperties | null>(null)
  const [hoveredCity, setHoveredCity] = useState<CityLocation | null>(null)
  const [cities, setCities] = useState<ProvinceCities>()
  const [error, setError] = useState<string>()
  const [dark, setDark] = useState(false)
  const [studioStep, setStudioStep] = useState<'data' | 'style' | 'export'>('data')

  useEffect(() => { getRegions().then(setRegions).catch(() => setError('فهرست مناطق در دسترس نیست.')) }, [])
  useEffect(() => { getManifest().then(setManifest).catch(() => undefined) }, [])
  useEffect(() => { getGeometry('IR').then(setNationalGeometry).catch(() => undefined) }, [])
  const province = useMemo(() => findRegionByRouteKey(provinceSlug, regions, 'province'), [provinceSlug, regions])
  const county = useMemo(() => findRegionByRouteKey(countySlug, regions, 'county', province?.id), [countySlug, province?.id, regions])
  const activeId = county?.id ?? province?.id ?? 'IR'
  const active = regions.find((region) => region.id === activeId)
  useEffect(() => {
    let cancelled = false
    getGeometry(county ? `${province?.id}` : activeId).then((value) => { if (!cancelled) { setGeometry(value); setHoveredCity(null); setError(undefined) } }).catch(() => { if (!cancelled) setError('اطلاعات مرزی این منطقه در حال حاضر موجود نیست.') })
    return () => { cancelled = true }
  }, [activeId, county, province?.id])
  useEffect(() => { if (!province?.id) return; let cancelled = false; getProvinceCities(province.id).then((value) => { if (!cancelled) setCities(value) }).catch(() => { if (!cancelled) setCities(undefined) }); return () => { cancelled = true } }, [province?.id])
  useEffect(() => { if (!active || !regions.length || !provinceSlug) return; const canonical = regionUrl(active, regions); const current = `/map/province/${provinceSlug}${countySlug ? `/county/${countySlug}` : ''}`; if (canonical !== current) navigate(canonical, { replace: true }) }, [active, countySlug, navigate, provinceSlug, regions])
  const selected = regions.find((region) => region.id === selectedId) ?? active
  const crumbs = useMemo(() => { const items: AdministrativeRegion[] = []; let current = active; while (current) { items.unshift(current); current = regions.find((region) => region.id === current?.parentId) } return items }, [active, regions])
  useEffect(() => { document.title = active ? `نقشه ${levels[active.level]} ${active.nameFa}` : 'نقشه تقسیمات کشوری ایران' }, [active])
  usePageSeo({ title: isStudio ? 'نقشه‌ساز دادهٔ ایران' : active ? `نقشه ${active.nameFa}` : 'کاوش نقشهٔ ایران', description: isStudio ? 'داده‌های منطقه‌ای را به مرزهای واقعی ایران وصل کنید، ظاهر را تنظیم کنید و SVG یا تصویر دریافت کنید.' : active ? `مرزها، شهرستان‌ها و نقاط شهرِ ${active.nameFa} را روی نقشهٔ برداری ایران بررسی کنید.` : 'کاوش نقشهٔ برداری استان‌ها و شهرستان‌های ایران، با دادهٔ قابل اتصال برای React.', path: isStudio ? '/studio' : active ? regionUrl(active, regions) : '/map' })
  const mapTitle = province ? `شهرستان‌های استان ${province.nameFa}` : 'استان‌های ایران'
  const mapHint = county ? `شهرستان ${county.nameFa} انتخاب شده است؛ برای مقایسه، روی مرزهای دیگر حرکت کنید.` : province ? 'برای دیدن اطلاعات، یک شهرستان را انتخاب کنید.' : 'برای ورود به هر استان روی آن کلیک کنید.'
  const visibleCities = useMemo(() => province ? cities?.cities.filter((city) => !county || city.countyId === county.id) ?? [] : [], [cities, county, province])
  const geolocatedCityCount = visibleCities.filter((city) => city.latitude !== null && city.longitude !== null && city.coordinateStatus !== 'unresolved').length
  const mapFeatureCount = `${geometry?.features.length ?? 0} مرز واقعی${province && cities ? ` · ${geolocatedCityCount.toLocaleString('fa-IR')} شهر موقعیت‌یابی‌شده` : ''}${manifest ? ` · داده ${manifest.datasetVersion}` : ''}`

  const exportId = `iran-map-${activeId}`
  const filenameBase = active?.level === 'county' ? `iran-county-${activeId}` : active?.level === 'province' ? `iran-province-${activeId}` : 'iran-administrative-map'

  const openStudioTool = (tool: 'data' | 'style' | 'export') => {
    setStudioStep(tool)
    if (tool === 'data') {
      const trigger = document.getElementById('iran-map-data-fab') as HTMLButtonElement | null
      trigger?.click()
    }
    if (tool === 'style') {
      const trigger = document.querySelector('.style-fab') as HTMLButtonElement | null
      trigger?.click()
    }
    if (tool === 'export') {
      const trigger = document.querySelector('.style-fab') as HTMLButtonElement | null
      trigger?.click()
    }
  }

  return <SiteChrome className={isStudio ? 'map-site studio-site' : 'map-site'} showFooter={false}><main className={`${dark ? 'app map-app dark' : 'app map-app'}${isStudio ? ' is-studio' : ''}`}>
    <MapWorkspaceHeader regions={regions} workspaceLabel={isStudio ? 'استودیو نقشه' : 'نقشه‌ساز'} title={isStudio ? 'ساخت نقشهٔ داده‌محور' : mapTitle} hint={isStudio ? 'داده را وارد کنید، ظاهر را بسازید و خروجی بگیرید.' : mapHint} dark={dark} onSearchSelect={(region) => { setSelectedId(region.id); navigate(regionUrl(region, regions)) }} onReset={() => navigate(isStudio ? '/studio' : '/map')} onLocate={() => setSelectedId(activeId)} onThemeToggle={() => setDark(!dark)} />
    <nav className="breadcrumbs" aria-label="مسیر نقشه">{crumbs.map((crumb, index) => <span key={crumb.id}>{index > 0 && <ChevronLeft size={15} />}<button disabled={index === crumbs.length - 1} onClick={() => navigate(regionUrl(crumb, regions))}>{crumb.nameFa}</button></span>)}</nav>
    <section className="map-layout studio-workspace">
      <aside className="details studio-control-panel" aria-live="polite">
        <div className="studio-step-tabs" role="tablist" aria-label="مراحل ساخت نقشه">
          <button className={studioStep === 'data' ? 'is-active' : ''} type="button" onClick={() => openStudioTool('data')}><span>۱</span><Database size={16} /> داده</button>
          <button className={studioStep === 'style' ? 'is-active' : ''} type="button" onClick={() => openStudioTool('style')}><span>۲</span><Palette size={16} /> طراحی</button>
          <button className={studioStep === 'export' ? 'is-active' : ''} type="button" onClick={() => openStudioTool('export')}><span>۳</span><Download size={16} /> خروجی</button>
        </div>
        <div className="studio-panel-card">
            {studioStep === 'data' && <>
              <p className="studio-kicker">گام ۱ · داده</p><h3>{isStudio ? 'داده را به نقشهٔ واقعی وصل کنید' : 'اتصال داده به مرزها'}</h3><p>JSON، CSV یا Excel را وارد کنید؛ شناسه‌ها اعتبارسنجی و مقدارها فوراً روی همان مرزهای استان و شهرستان نمایش داده می‌شوند.</p>
              <button className="studio-primary" type="button" onClick={() => openStudioTool('data')}>ورود داده</button>
            </>}
            {studioStep === 'style' && <>
              <p className="studio-kicker">گام ۲ · طراحی</p><h3>ظاهر خروجی را بسازید</h3><p>پالت، مرز، برچسب و پس‌زمینه را برای همین نمای ایران، استان یا شهرستان تنظیم کنید.</p>
              <button className="studio-primary" type="button" onClick={() => openStudioTool('style')}>تنظیم ظاهر</button>
            </>}
            {studioStep === 'export' && <>
              <p className="studio-kicker">گام ۳ · خروجی</p><h3>فایل آمادهٔ استفاده بگیرید</h3><p>SVG مستقل، PNG یا JPG را با پس‌زمینه و کیفیت موردنظر دریافت کنید.</p>
              <button className="studio-primary" type="button" onClick={() => openStudioTool('export')}>دریافت خروجی</button>
            </>}
        </div>
        <section className="national-reference"><div><p>نمای مرجع</p><strong>کل ایران</strong></div>{nationalGeometry && <GeoMap data={nationalGeometry} selectedId={province?.id} onSelect={setSelectedId} onOpen={(region) => { const matching = regions.find((item) => item.id === region.id); if (matching) navigate(regionUrl(matching, regions)) }} onHover={setHovered} ariaLabel="نقشهٔ مرجع ایران" listenForMetrics={false} />}</section>
        {selected ? <section className="region-summary"><div className="details-top"><p className="eyebrow">{levels[selected.level]}</p><span className="live-dot" /></div><h2>{selected.nameFa}</h2>{selected.nameEn && <p className="en">{selected.nameEn}</p>}<dl><div><dt>منبع داده</dt><dd>{selected.source}</dd></div>{selected.children?.counties !== undefined && <div><dt>شهرستان‌ها</dt><dd>{selected.children.counties}</dd></div>}{selected.children?.cities !== undefined && <div><dt>شهرها</dt><dd>{selected.children.cities}</dd></div>}</dl>{selected.level === 'province' && <button className="primary" onClick={() => navigate(regionUrl(selected, regions))}>نمایش شهرستان‌ها <ChevronLeft size={17} /></button>}<RegionInstallCopy region={selected} regions={regions} /></section> : <div className="welcome"><span className="radar" /><strong>کاوش نقشه</strong><p>برای شروع، یک استان را انتخاب کنید.</p></div>}
        {isStudio && <StudioWorkspaceKit regions={regions} />}
      </aside>
      <section className="map-card studio-preview-column" aria-label="پیش‌نمایش نقشه">
        <header className="map-preview-toolbar"><div><p>{province ? 'نمای شهرستان‌ها' : 'نمای ملی'}</p><strong>{mapTitle}</strong></div><span>{mapFeatureCount}</span></header>
        {error ? <div className="empty"><strong>{error}</strong><button onClick={() => navigate('/map')}>بازگشت به ایران</button></div> : geometry ? <div className="map-visual map-frame"><GeoMap exportId={exportId} data={geometry} selectedId={selectedId ?? activeId} cities={visibleCities} onSelect={setSelectedId} onOpen={(region) => { const matching = regions.find((item) => item.id === region.id); if (matching) navigate(regionUrl(matching, regions)) }} onHover={setHovered} onCityHover={setHoveredCity} />{(hovered || hoveredCity) && <div className="map-tooltip"><strong>{hoveredCity?.nameFa ?? hovered?.nameFa}</strong>{(hoveredCity?.nameEn ?? hovered?.nameEn) && <span>{hoveredCity?.nameEn ?? hovered?.nameEn}</span>}<small>{hoveredCity ? `شهر · شهرستان ${hoveredCity.countyNameFa} · ${hoveredCity.coordinateStatus === 'verified' ? 'مختصات تأییدشده' : 'مختصات هم‌سنجی‌شده'}` : `${levels[hovered!.level]} · برای انتخاب کلیک کنید`}</small></div>}</div> : <div className="loading">در حال آماده‌سازی نقشه…</div>}
        <footer className="map-frame-caption"><span>برای ورود به سطح بعد، یک ناحیه را انتخاب کنید.</span><span>مرزهای برداری · داده‌های محلی</span></footer>
      </section>
    </section>
    <footer className="map-attribution"><span><i className="dot capital" /> انتخاب‌شده</span><span><i className="dot" /> مرز اداری واقعی</span><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© مشارکت‌کنندگان OpenStreetMap</a></footer><SampleDownload /><MapStyleExport exportId={exportId} filenameBase={filenameBase} mapLabel={active?.nameFa ?? 'ایران'} /><DataWorkspace regions={regions} />
  </main></SiteChrome>
}
