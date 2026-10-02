import { defineConfig } from '@playwright/test'

const basePath = process.env.CI ? '/iran-vector-maps' : ''

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  webServer: { command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173', url: `http://127.0.0.1:4173${basePath}/`, reuseExistingServer: !process.env.CI },
  use: { baseURL: `http://127.0.0.1:4173${basePath}/`, browserName: 'chromium', headless: true },
})
