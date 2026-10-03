import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('home hero gives visitors a scroll guide and opens the explorer', async ({ page }) => {
  await page.goto('')
  await expect(page.getByRole('heading', { name: /ایران را با/ })).toBeVisible()
  await page.getByRole('button', { name: 'راهنمای اسکرول' }).click()
  await expect(page.getByRole('heading', { name: 'از نمای کلی تا دادهٔ دقیق' })).toBeInViewport()
  await page.getByRole('link', { name: 'شروع کاوش نقشه' }).click()
  await expect(page).toHaveURL(/\/map$/)
})

test('province drill-down, hover, keyboard selection, and theme work', async ({ page }) => {
  await page.goto('map')
  const province = page.locator('.map-visual [data-region-id="IR-05"]')
  await expect(province).toBeVisible()
  await province.hover()
  await expect(page.locator('.map-tooltip')).toContainText('کرمانشاه')
  await province.press('Enter')
  await expect(page).toHaveURL(/\/map\/province\/kermanshah$/)
  await expect(page.locator('.map-preview-toolbar')).not.toContainText('۰ مرز واقعی')
  await page.getByLabel('تغییر حالت رنگ').click()
  await expect(page.locator('main.app')).toHaveClass(/dark/)
})

test('data workspace imports a valid CSV and closes as a real modal', async ({ page }) => {
  await page.goto('map')
  await page.getByLabel('مدیریت داده‌های نقشه').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.locator('input[type="file"]').nth(1).setInputFiles({ name: 'metrics.csv', mimeType: 'text/csv', buffer: Buffer.from('regionId,value\nIR-05,12840\n') })
  await expect(page.locator('.metric-label')).toContainText('۱۲٬۸۴۰')
  await page.getByLabel('بستن').click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('data workspace imports JSON and exports valid SVG', async ({ page }) => {
  await page.goto('map')
  await page.getByLabel('مدیریت داده‌های نقشه').click()
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'metrics.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify([{ regionId: 'IR-05', labelFa: 'نمونه', value: 77, source: 'test' }])) })
  await expect(page.locator('.metric-label')).toContainText('۷۷')
  await page.getByLabel('بستن').click()
  await page.getByLabel('رنگ و خروجی').click()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'SVG' }).click()
  const exported = await download
  expect(exported.suggestedFilename()).toBe('iran-administrative-map.svg')
  const content = await readFile(await exported.path(), 'utf8')
  expect(content).toMatch(/<rect[^>]+fill="#[0-9a-f]{6}"/i)
  const firstPathStyle = content.match(/<path[^>]+(?:fill="[^"]+"|style="[^"]*fill:\s*(?:hsl|rgb|color|#)[^"]*")/i)
  expect(firstPathStyle).not.toBeNull()
})

test('province maps show sourced city markers and county context', async ({ page }) => {
  await page.goto('map/province/IR-05')
  await expect(page).toHaveURL(/\/map\/province\/kermanshah$/)
  const city = page.locator('.city-marker circle').first()
  await expect(city).toBeVisible()
  await city.hover()
  await expect(page.locator('.map-tooltip')).toContainText('شهرستان')
})

test('readable county URLs resolve to the matching county and keep legacy IDs compatible', async ({ page }) => {
  await page.goto('map/province/kermanshah/county/sonqor')
  await expect(page).toHaveURL(/\/map\/province\/kermanshah\/county\/sonqor$/)
  await expect(page.locator('.map-preview-toolbar')).toContainText('شهرستان‌های استان کرمانشاه')
  await page.goto('map/province/IR-05/county/1050005')
  await expect(page).toHaveURL(/\/map\/province\/kermanshah\/county\/sonqor$/)
})

test('studio provides the full client-side data, style, and export workflow', async ({ page }) => {
  await page.goto('studio')
  await expect(page.getByRole('navigation', { name: 'ناوبری اصلی' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'ابزارهای نقشه' })).toBeVisible()
  await expect(page.locator('svg.geo-map').first()).toBeVisible()
  await page.getByRole('button', { name: 'طراحی' }).click()
  await expect(page.getByRole('dialog', { name: 'رنگ و خروجی نقشه' })).toBeVisible()
  await page.locator('.studio-step-tabs button').filter({ hasText: 'خروجی' }).click()
  await expect(page.getByRole('dialog', { name: 'رنگ و خروجی نقشه' })).toBeVisible()
})

test('studio templates and project snapshots use the production map data flow', async ({ page }) => {
  await page.goto('studio')
  await page.getByRole('tab', { name: 'قالب‌ها' }).click()
  await page.getByRole('button', { name: /جمعیت و تولد/ }).click()
  await expect(page.locator('.metric-label')).toHaveCount(31)
  await page.getByRole('tab', { name: 'پروژه‌ها' }).click()
  await page.getByRole('button', { name: 'ذخیرهٔ نسخهٔ فعلی' }).click()
  await expect(page.locator('.project-list')).toContainText('نقشهٔ من')
})
