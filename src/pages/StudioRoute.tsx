import { lazy, Suspense } from 'react'

const StudioReferencePage = lazy(() => import('./StudioReferencePage').then(({ StudioReferencePage: Component }) => ({ default: Component })))

export function StudioRoute() {
  return <Suspense fallback={<main className="route-loading" dir="rtl">در حال آماده‌سازی نقشه‌ساز…</main>}><StudioReferencePage /></Suspense>
}
