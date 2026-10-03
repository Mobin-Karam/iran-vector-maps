import { Download, Palette, X } from 'lucide-react'
import { useState } from 'react'
import './style-export.css'

type Palette = { fill: string; hover: string; selected: string; border: string; background: string }
type Quality = 1 | 2 | 4
const presets: Array<{ id: string; label: string; palette: Palette }> = [
  ['forest', 'جنگل', '#e9f2e7', '#c1d9bc', '#356635', '#ffffff', '#f6faf6'], ['cobalt', 'کبالت', '#e7edff', '#bdccff', '#2849be', '#f8fbff', '#f4f7ff'], ['saffron', 'زعفران', '#fff2d8', '#f8d594', '#94570f', '#fffaf4', '#fff9ef'], ['plum', 'آلو', '#f4e9f3', '#dbbfd9', '#663665', '#fffaff', '#fbf7fb'], ['graphite', 'گرافیت', '#e9edf2', '#c7ced8', '#414e5d', '#f7f9fc', '#f5f7fa'], ['turquoise', 'فیروزه', '#e2f7f5', '#afe5df', '#08756c', '#f5fffe', '#f2fbfa'], ['rose', 'رز', '#fdebed', '#f7bec7', '#a92545', '#fff9fa', '#fff7f8'], ['indigo', 'نیلی', '#ecebff', '#ccc8ff', '#4840a8', '#fafaff', '#f8f7ff'], ['copper', 'مس', '#faeee6', '#eac8b2', '#7f4024', '#fffaf7', '#fff8f4'], ['olive', 'زیتون', '#f0f2df', '#d4d9a9', '#5b681f', '#fcfdf6', '#fafbf3'], ['ocean', 'اقیانوس', '#e2f1fb', '#add7ef', '#145f91', '#f7fcff', '#f4faff'], ['ember', 'اخگر', '#fff0e6', '#ffc8a5', '#9b3217', '#fffaf7', '#fff7f3'], ['lagoon', 'مرداب', '#e2f3f1', '#addbd4', '#176c65', '#f7fffe', '#f2faf9'], ['sunset', 'غروب', '#fff0dd', '#facba2', '#963b53', '#fffaf6', '#fff7f1'], ['berry', 'تمشک', '#f7e8f1', '#e4bad2', '#762b5e', '#fffaff', '#fcf7fa'], ['midnight', 'نیمه‌شب', '#dfe5ef', '#b7c6d9', '#3d5c87', '#edf3fb', '#f1f5fb'],
].map(([id, label, fill, hover, selected, border, background]) => ({ id, label, palette: { fill, hover, selected, border, background } }))
const initial = presets[0].palette
const mapElement = (exportId: string) => document.querySelector<SVGSVGElement>(`[data-map-export-id="${exportId}"]`)
const apply = (exportId: string, palette: Palette, showLabels: boolean) => { const svg = mapElement(exportId); if (!svg) return; svg.style.setProperty('--region-fill', palette.fill); svg.style.setProperty('--region-hover', palette.hover); svg.style.setProperty('--region-selected', palette.selected); svg.style.setProperty('--region-border', palette.border); svg.style.background = palette.background; svg.style.setProperty('--label-opacity', showLabels ? '1' : '0') }
const svgSource = (exportId: string, palette: Palette, transparent = false) => {
  const svg = mapElement(exportId); if (!svg) return null
  const copy = svg.cloneNode(true) as SVGSVGElement
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); copy.setAttribute('width', '900'); copy.setAttribute('height', '620')
  const sourceNodes = [svg, ...svg.querySelectorAll<SVGElement>('*')]; const copyNodes = [copy, ...copy.querySelectorAll<SVGElement>('*')]
  const presentation = ['opacity', 'font-family', 'font-size', 'font-weight', 'paint-order', 'text-anchor', 'display', 'visibility']
  sourceNodes.forEach((source, index) => {
    const target = copyNodes[index]; if (!target) return
    const computed = window.getComputedStyle(source)
    presentation.forEach((property) => { const value = computed.getPropertyValue(property); if (value && value !== 'none' && value !== 'normal') target.setAttribute(property, value) })
    if (source.tagName.toLowerCase() === 'path') {
      // Avoid browser-only `color(srgb …)` and CSS color-mix values: standalone SVG
      // viewers then receive literal paint attributes instead of falling back to black.
      target.setAttribute('fill', source.style.fill || source.getAttribute('fill') || (source.classList.contains('selected') ? palette.selected : palette.fill))
      target.setAttribute('stroke', palette.border)
      target.setAttribute('stroke-width', computed.getPropertyValue('stroke-width') || '1.6')
      target.setAttribute('stroke-linejoin', 'round')
      target.setAttribute('stroke-linecap', 'round')
    }
    if (source.matches('.city-marker circle')) { target.setAttribute('fill', '#f97316'); target.setAttribute('stroke', '#ffffff'); target.setAttribute('stroke-width', '1.8') }
    if (source.matches('.city-marker text')) { target.setAttribute('fill', '#23352b'); target.setAttribute('stroke', '#f8fcf8'); target.setAttribute('stroke-width', '3') }
    if (source.matches('.metric-label')) { target.setAttribute('fill', '#10251a'); target.setAttribute('stroke', '#ffffff'); target.setAttribute('stroke-width', '3') }
    if (source.matches('.water-label')) target.setAttribute('fill', '#4a7890')
  })
  if (!transparent) { const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); rect.setAttribute('width', '100%'); rect.setAttribute('height', '100%'); rect.setAttribute('fill', palette.background); copy.insertBefore(rect, copy.firstChild) }
  return new XMLSerializer().serializeToString(copy)
}
const download = (content: BlobPart, type: string, name: string) => { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url) }

export function MapStyleExport({ exportId, filenameBase, mapLabel }: { exportId: string; filenameBase: string; mapLabel: string }) {
  const [open, setOpen] = useState(false); const [showLabels, setShowLabels] = useState(true); const [transparent, setTransparent] = useState(false); const [quality, setQuality] = useState<Quality>(2); const [palette, setPalette] = useState(initial)
  const update = (key: keyof Palette, value: string) => { const next = { ...palette, [key]: value }; setPalette(next); apply(exportId, next, showLabels) }
  const selectPreset = (next: Palette) => { setPalette(next); apply(exportId, next, showLabels) }
  const exportSvg = () => { const source = svgSource(exportId, palette); if (source) download(source, 'image/svg+xml;charset=utf-8', `${filenameBase}.svg`) }
  const exportRaster = (kind: 'png' | 'jpeg') => { const source = svgSource(exportId, palette, kind === 'png' && transparent); if (!source) return; const image = new Image(); image.onload = () => { const canvas = document.createElement('canvas'); canvas.width = 900 * quality; canvas.height = 620 * quality; const context = canvas.getContext('2d'); if (!context) return; context.clearRect(0, 0, canvas.width, canvas.height); if (kind === 'jpeg') { context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height) } context.drawImage(image, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => { if (blob) download(blob, kind === 'png' ? 'image/png' : 'image/jpeg', `${filenameBase}.${kind === 'png' ? 'png' : 'jpg'}`) }, kind === 'png' ? 'image/png' : 'image/jpeg', .92) }; image.onerror = () => undefined; image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}` }
  return <><button className="style-fab" onClick={() => setOpen(true)} aria-label="رنگ و خروجی"><Palette size={19} /> رنگ و خروجی</button>{open && <div className="style-popover" role="dialog" aria-label="رنگ و خروجی نقشه"><header><strong>رنگ و خروجی نقشه</strong><button onClick={() => setOpen(false)} aria-label="بستن"><X size={18} /></button></header><p>رنگ‌ها برای نقشهٔ «{mapLabel}» اعمال می‌شوند و خروجی فقط همان نما را دریافت می‌کنید.</p><div className="preset-grid" aria-label="پالت‌های آماده">{presets.map((preset) => <button key={preset.id} title={preset.label} className={palette.fill === preset.palette.fill ? 'is-active' : ''} onClick={() => selectPreset(preset.palette)}>{preset.label}</button>)}</div><label className="toggle-row"><span>نمایش مقدارها</span><input type="checkbox" checked={showLabels} onChange={(event) => { setShowLabels(event.target.checked); apply(exportId, palette, event.target.checked) }} /></label><label className="toggle-row"><span>PNG شفاف</span><input type="checkbox" checked={transparent} onChange={(event) => setTransparent(event.target.checked)} /></label><label className="quality-row">کیفیت تصویر<select value={quality} onChange={(event) => setQuality(Number(event.target.value) as Quality)}><option value={1}>۱× — سریع</option><option value={2}>۲× — پیشنهادی</option><option value={4}>۴× — چاپ</option></select></label><div className="color-grid">{([['fill', 'رنگ ناحیه'], ['hover', 'رنگ شناور'], ['selected', 'رنگ انتخاب'], ['border', 'مرزها'], ['background', 'پس‌زمینه']] as [keyof Palette, string][]).map(([key, label]) => <label key={key}>{label}<input type="color" value={palette[key]} onChange={(event) => update(key, event.target.value)} /></label>)}</div><button className="reset-style" onClick={() => { setPalette(initial); setShowLabels(true); setTransparent(false); setQuality(2); apply(exportId, initial, true) }}>بازنشانی رنگ‌ها</button><div className="export-actions"><button onClick={exportSvg}><Download size={16} /> SVG</button><button onClick={() => exportRaster('png')}><Download size={16} /> PNG</button><button onClick={() => exportRaster('jpeg')}><Download size={16} /> JPG</button></div></div>}</>
}
