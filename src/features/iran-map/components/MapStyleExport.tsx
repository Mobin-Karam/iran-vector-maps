import { Download, Palette, X } from 'lucide-react'
import { useState } from 'react'
import './style-export.css'

type Palette = { fill: string; hover: string; selected: string; border: string; background: string }
const initial: Palette = { fill: '#dbe9dc', hover: '#bed8c1', selected: '#4f8a61', border: '#ffffff', background: '#f6faf6' }
const apply = (palette: Palette) => { const svg = document.querySelector<SVGSVGElement>('.geo-map'); if (!svg) return; svg.style.setProperty('--region-fill', palette.fill); svg.style.setProperty('--region-hover', palette.hover); svg.style.setProperty('--region-selected', palette.selected); svg.style.setProperty('--region-border', palette.border); svg.style.background = palette.background }
const svgSource = () => { const svg = document.querySelector<SVGSVGElement>('.geo-map'); if (!svg) return null; const copy = svg.cloneNode(true) as SVGSVGElement; copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); return new XMLSerializer().serializeToString(copy) }
const download = (content: BlobPart, type: string, name: string) => { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url) }

export function MapStyleExport() {
  const [open, setOpen] = useState(false); const [palette, setPalette] = useState(initial)
  const update = (key: keyof Palette, value: string) => { const next = { ...palette, [key]: value }; setPalette(next); apply(next) }
  const exportSvg = () => { const source = svgSource(); if (source) download(source, 'image/svg+xml;charset=utf-8', 'iran-administrative-map.svg') }
  const exportPng = async () => { const source = svgSource(); if (!source) return; const image = new Image(); image.onload = () => { const canvas = document.createElement('canvas'); canvas.width = 1800; canvas.height = 1240; const context = canvas.getContext('2d'); if (!context) return; context.fillStyle = palette.background; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => { if (blob) download(blob, 'image/png', 'iran-administrative-map.png') }, 'image/png') }; image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}` }
  return <><button className="style-fab" onClick={() => setOpen(true)} aria-label="رنگ و خروجی"><Palette size={19} /> رنگ و خروجی</button>{open && <div className="style-popover"><header><strong>رنگ و خروجی نقشه</strong><button onClick={() => setOpen(false)} aria-label="بستن"><X size={18} /></button></header><p>رنگ‌ها فقط در همین مرورگر و همین نقشه اعمال می‌شوند.</p><div className="color-grid">{([['fill', 'رنگ ناحیه'], ['hover', 'رنگ شناور'], ['selected', 'رنگ انتخاب'], ['border', 'مرزها'], ['background', 'پس‌زمینه']] as [keyof Palette, string][]).map(([key, label]) => <label key={key}>{label}<input type="color" value={palette[key]} onChange={(event) => update(key, event.target.value)} /></label>)}</div><button className="reset-style" onClick={() => { setPalette(initial); apply(initial) }}>بازنشانی رنگ‌ها</button><div className="export-actions"><button onClick={exportSvg}><Download size={16} /> دریافت SVG</button><button onClick={exportPng}><Download size={16} /> دریافت PNG</button></div></div>}</>
}
