import { expect, test } from '@playwright/test'

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
  const province = page.getByRole('group', { name: 'نقشهٔ تعاملی تقسیمات کشوری ایران' }).locator('[data-region-id="IR-05"]')
  await expect(province).toBeVisible()
  await province.hover()
  await expect(page.locator('.map-tooltip')).toContainText('کرمانشاه')
  await province.press('Enter')
  await expect(page).toHaveURL(/\/map\/province\/IR-05$/)
  await expect(page.locator('.map-count')).not.toContainText('۰ مرز واقعی')
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
  expect((await download).suggestedFilename()).toBe('iran-administrative-map.svg')
})

test('province maps show sourced city markers and county context', async ({ page }) => {
  await page.goto('map/province/IR-05')
  const city = page.locator('.city-marker circle').first()
  await expect(city).toBeVisible()
  await city.hover()
  await expect(page.locator('.map-tooltip')).toContainText('شهرستان')
})

test('studio provides the full client-side data, style, and export workflow', async ({ page }) => {
  await page.goto('studio')
  await expect(page.getByRole('navigation', { name: 'مراحل ساخت نقشه' })).toBeVisible()
  await expect(page.locator('svg.map-svg')).toBeVisible()
  await page.getByRole('button', { name: 'طراحی' }).click()
  await expect(page.getByRole('button', { name: 'کبالت' })).toBeVisible()
  await page.getByRole('button', { name: 'خروجی' }).click()
  await expect(page.getByRole('button', { name: 'PNG شفاف' }).first()).toBeVisible()
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.getByRole('navigation', { name: 'Map workflow' })).toBeVisible()
})
