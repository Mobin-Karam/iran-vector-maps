import { Check, Copy, Download, FolderOpen, Gamepad2, Link2, Save, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { AdministrativeRegion } from '../model/map.types'
import type { RegionMetric } from '../model/metric.types'
import './studio-workspace-kit.css'

type SavedProject = { id: string; name: string; savedAt: string; records: RegionMetric[] }
const recordsKey = 'iran-map:user-metrics:v2'
const projectsKey = 'iran-map:studio-projects:v1'
const read = <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) ?? '') as T } catch { return fallback } }
const sendRecords = (records: RegionMetric[]) => window.dispatchEvent(new CustomEvent<RegionMetric[]>('iran-map:workspace-records', { detail: records }))
const download = (value: unknown, name: string) => { const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url) }

export function StudioWorkspaceKit({ regions }: { regions: AdministrativeRegion[] }) {
  const [tab, setTab] = useState<'projects' | 'templates' | 'share' | 'game'>('projects')
  const [projects, setProjects] = useState<SavedProject[]>(() => read(projectsKey, []))
  const [copied, setCopied] = useState('')
  const provinces = useMemo(() => regions.filter((region) => region.level === 'province'), [regions])
  const current = () => read<RegionMetric[]>(recordsKey, [])
  const persist = (next: SavedProject[]) => { setProjects(next); localStorage.setItem(projectsKey, JSON.stringify(next)) }
  const saveProject = () => {
    const name = `نقشهٔ من · ${new Date().toLocaleDateString('fa-IR')}`
    persist([{ id: crypto.randomUUID(), name, savedAt: new Date().toISOString(), records: current() }, ...projects].slice(0, 12))
  }
  const template = (labelFa: string, source: string, seed: number) => sendRecords(provinces.map((region, index) => ({ metricId: crypto.randomUUID(), regionId: region.id, labelFa, value: 20 + ((index * 37 + seed) % 81), unitFa: labelFa === 'کنترل قلمرو' ? 'امتیاز' : 'واحد', source, observedAt: new Date().toISOString() })))
  const copy = async (kind: 'link' | 'embed') => { const value = kind === 'link' ? window.location.href : `<iframe src="${window.location.href}" title="Iran Vector Maps" width="100%" height="640" loading="lazy"></iframe>`; await navigator.clipboard?.writeText(value); setCopied(kind); window.setTimeout(() => setCopied(''), 1800) }
  return <section className="studio-workspace-kit" aria-label="فضای کاری استودیو">
    <div className="workspace-kit-head"><div><p>فضای کاری</p><strong>پروژه، اشتراک و سناریو</strong></div><Sparkles size={17} /></div>
    <div className="workspace-kit-tabs" role="tablist" aria-label="ابزارهای فضای کاری">{([['projects', 'پروژه‌ها', FolderOpen], ['templates', 'قالب‌ها', Sparkles], ['share', 'اشتراک', Link2], ['game', 'بازی', Gamepad2]] as const).map(([id, label, Icon]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}><Icon size={14} />{label}</button>)}</div>
    {tab === 'projects' && <div className="workspace-kit-body"><button className="workspace-main-action" type="button" onClick={saveProject}><Save size={16} /> ذخیرهٔ نسخهٔ فعلی</button><button className="workspace-sub-action" type="button" onClick={() => download({ schemaVersion: 1, records: current() }, 'iran-map-project.json')}><Download size={15} /> دریافت فایل پروژه</button>{projects.length ? <ul className="project-list">{projects.map((project) => <li key={project.id}><div><strong>{project.name}</strong><span>{project.records.length.toLocaleString('fa-IR')} رکورد · {new Date(project.savedAt).toLocaleDateString('fa-IR')}</span></div><button type="button" onClick={() => sendRecords(project.records)}>بازگردانی</button></li>)}</ul> : <p className="workspace-empty">هنوز پروژه‌ای ذخیره نشده است. داده‌های فعلی را به‌صورت نسخه‌دار نگه دارید.</p>}</div>}
    {tab === 'templates' && <div className="workspace-kit-body"><p className="workspace-empty">نمونه‌ها روی مرزهای واقعی همین نقشه اجرا می‌شوند و قابل ویرایش‌اند.</p><div className="template-list"><button type="button" onClick={() => template('تولد ثبت‌شده', 'قالب جمعیت', 11)}><strong>جمعیت و تولد</strong><span>داشبورد سلامت و جمعیت</span></button><button type="button" onClick={() => template('پوشش خدمت', 'قالب خدمات عمومی', 29)}><strong>پوشش خدمت</strong><span>آموزش، سلامت یا خدمات</span></button><button type="button" onClick={() => template('فروش منطقه‌ای', 'قالب فروش', 47)}><strong>فروش منطقه‌ای</strong><span>عملکرد بازار و عملیات</span></button></div></div>}
    {tab === 'share' && <div className="workspace-kit-body"><p className="workspace-empty">پیوند فقط نمای فعلی را به اشتراک می‌گذارد؛ داده‌های خصوصی روی دستگاه شما باقی می‌مانند.</p><button className="workspace-main-action" type="button" onClick={() => copy('link')}>{copied === 'link' ? <Check size={16} /> : <Copy size={16} />} کپی پیوند این نما</button><button className="workspace-sub-action" type="button" onClick={() => copy('embed')}>{copied === 'embed' ? <Check size={15} /> : <Link2 size={15} />} کپی کد Embed</button></div>}
    {tab === 'game' && <div className="workspace-kit-body"><p className="workspace-empty">حالت قلمرو یک لایهٔ قابل‌استفاده برای بازی‌های استراتژی و شبیه‌سازی است؛ داده‌ها در همان سازوکار نقشه ذخیره می‌شوند.</p><button className="workspace-main-action" type="button" onClick={() => template('کنترل قلمرو', 'سناریوی بازی محلی', 63)}><Gamepad2 size={16} /> اجرای سناریوی قلمرو</button><button className="workspace-sub-action" type="button" onClick={() => template('ظرفیت منطقه', 'سناریوی شبیه‌سازی', 81)}>سناریوی منابع و ظرفیت</button></div>}
  </section>
}
