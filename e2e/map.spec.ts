import { expect, test } from '@playwright/test'

test('province drill-down, hover, keyboard selection, and theme work', async ({ page }) => {
  await page.goto('/map')
  const province = page.locator('[data-region-id="IR-05"]')
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
  await page.goto('/map')
  await page.getByLabel('مدیریت داده‌های نقشه').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.locator('input[type="file"]').nth(1).setInputFiles({ name: 'metrics.csv', mimeType: 'text/csv', buffer: Buffer.from('regionId,value\nIR-05,12840\n') })
  await expect(page.locator('.metric-label')).toContainText('۱۲٬۸۴۰')
  await page.getByLabel('بستن').click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
