import { Check, Copy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { AdministrativeRegion } from '../model/map.types'
import './region-install-copy.css'

export function RegionInstallCopy({ region, regions }: { region: AdministrativeRegion; regions: AdministrativeRegion[] }) {
  const [copied, setCopied] = useState(false)
  const province = useMemo(() => region.level === 'province' ? region : regions.find((item) => item.id === region.parentId), [region, regions])
  const snippet = useMemo(() => {
    if (!province) return 'npm install iran-vector-maps iran-vector-maps-data'
    const loader = region.level === 'county' ? `fetchIranCountyFeature('${province.id}', '${region.id}')` : `fetchIranProvinceAsset('${province.id}', 'counties.topo.json')`
    return `npm install iran-vector-maps iran-vector-maps-data\n\nimport { ${region.level === 'county' ? 'fetchIranCountyFeature' : 'fetchIranProvinceAsset'} } from 'iran-vector-maps-data/province'\n\nconst mapData = await ${loader}`
  }, [province, region])
  useEffect(() => { if (!copied) return; const timer = window.setTimeout(() => setCopied(false), 2200); return () => window.clearTimeout(timer) }, [copied])
  const copy = async () => { try { await navigator.clipboard.writeText(snippet); setCopied(true) } catch { setCopied(false) } }
  if (!province || !['province', 'county'].includes(region.level)) return null
  return <section className="region-install"><div><strong>استفادهٔ مستقل</strong><small>{region.level === 'county' ? 'فقط همین شهرستان را در برنامهٔ خود دریافت کنید.' : 'مرزها و شهرهای این استان را جداگانه دریافت کنید.'}</small></div><button onClick={copy} aria-label="کپی دستور استفاده">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'کپی شد' : 'کپی دستور استفاده'}</button><code dir="ltr">{region.level === 'county' ? `fetchIranCountyFeature('${province.id}', '${region.id}')` : `fetchIranProvinceAsset('${province.id}', 'counties.topo.json')`}</code></section>
}
