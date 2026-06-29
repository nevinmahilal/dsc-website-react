import { test, expect } from '@playwright/test'

test('sitemap.xml returns 200 with XML content', async ({ page }) => {
  const response = await page.goto('/sitemap.xml')
  expect(response?.status()).toBe(200)
  expect(response?.headers()['content-type']).toContain('xml')
})

test('homepage has canonical link tag', async ({ page }) => {
  await page.goto('/')
  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toBeAttached()
})

test('/case-study/ redirects to /case-studies/', async ({ page, request }) => {
  const redirectResp = await request.get('/case-study/', { maxRedirects: 0 })
  expect(redirectResp.status()).toBe(308)
  const response = await page.goto('/case-study/')
  expect(response?.url()).toContain('/case-studies')
})

test('/career/ redirects to /careers/', async ({ page, request }) => {
  const redirectResp = await request.get('/career/', { maxRedirects: 0 })
  expect(redirectResp.status()).toBe(308)
  const response = await page.goto('/career/')
  expect(response?.url()).toContain('/careers')
})

test('/resources/ redirects to /case-studies/', async ({ page, request }) => {
  const redirectResp = await request.get('/resources/', { maxRedirects: 0 })
  expect(redirectResp.status()).toBe(308)
  const response = await page.goto('/resources/')
  expect(response?.url()).toContain('/case-studies')
})

test('about page loads with title', async ({ page }) => {
  await page.goto('/about/')
  await expect(page).toHaveTitle(/.+/)
  await expect(page.locator('h1')).toBeVisible()
})
