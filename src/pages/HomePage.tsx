import { ArrowDown, ArrowLeft, Database, Layers3, MapPinned, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SiteChrome } from '../components/SiteChrome'
import { usePageSeo } from '../app/seo'
import { GeoMap } from '../features/iran-map/components/GeoMap'
import { getGeometry } from '../features/iran-map/data/loaders'
import type { MapCollection } from '../features/iran-map/model/map.types'
import './home.css'

export function HomePage() {
  const navigate = useNavigate()
  const [map, setMap] = useState<MapCollection>()
  usePageSeo({ title: 'نقشهٔ برداری ایران', description: 'نقشهٔ تعاملی استان‌ها، شهرستان‌ها و نقاط شهر ایران برای گزارش، پژوهش و محصولات React.', path: '/' })
  useEffect(() => { getGeometry('IR').then(setMap).catch(() => undefined) }, [])
  return <SiteChrome className="home-page"><main>
    <section className="hero"><div className="hero-copy"><p className="home-eyebrow"><Sparkles size={15} /> دادهٔ جغرافیایی، بدون سرویس خارجی</p><h1>ایران را با <em>عمق</em> ببینید.</h1><p>نقشه‌ای سریع و برداری برای استان‌ها، شهرستان‌ها و شهرهای موقعیت‌یابی‌شده؛ برای پژوهش، گزارش و محصول داده‌محور شما.</p><div className="hero-actions"><Link to="/map" className="hero-primary">شروع کاوش نقشه <ArrowLeft size={18} /></Link><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>راهنمای اسکرول <ArrowDown size={18} /></button></div><div className="hero-stats"><span><b>۳۱</b> استان</span><span><b>۴۶۶</b> شهرستان</span><span><b>هزاران</b> نام شهر</span></div></div><div className="hero-map-shell"><div className="hero-map-glow" /><div className="hero-map-card">{map ? <GeoMap data={map} onSelect={() => undefined} onOpen={(region) => navigate(`/map/province/${region.id}`)} onHover={() => undefined} ariaLabel="نمای سه‌بعدی نقشهٔ ایران" /> : <div className="hero-map-loading">در حال بارگذاری مرزهای ایران…</div>}</div><p>برای ورود به جزئیات، روی هر استان کلیک کنید.</p></div></section>
    <section id="how-it-works" className="home-guide"><p className="home-eyebrow">راهنمای کوتاه</p><h2>از نمای کلی تا دادهٔ دقیق</h2><div className="guide-grid"><article><span>۰۱</span><Layers3 size={22} /><h3>استان را انتخاب کنید</h3><p>مرزها از دادهٔ واقعی ساخته می‌شوند، نه مسیر SVG دستی.</p></article><article><span>۰۲</span><MapPinned size={22} /><h3>شهرستان و شهر را ببینید</h3><p>نشانگرهای شهر فقط برای مختصات تأییدشده یا هم‌سنجی‌شده نمایش داده می‌شوند.</p></article><article><span>۰۳</span><Database size={22} /><h3>دادهٔ خودتان را وصل کنید</h3><p>JSON یا CSV را با شناسهٔ پایدار منطقه وارد و رنگ‌ها را مقایسه کنید.</p></article></div><Link to="/map" className="guide-link">ورود به نقشهٔ کامل <ArrowLeft size={17} /></Link></section>
  </main></SiteChrome>
}
