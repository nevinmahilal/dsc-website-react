import { test, expect } from '@playwright/test'

test('homepage loads with hero content', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/.+/)
  await expect(page.locator('h1')).toBeVisible()
})

test('blog post page renders full content', async ({ page }) => {
  const response = await page.goto('/choosing-the-right-project-management-methodology/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('article, main')).toBeVisible()
})

test('Resources dropdown opens and shows Case Studies link', async ({ page }) => {
  await page.goto('/')
  const resourcesBtn = page.locator('nav[aria-label="Main navigation"] button', { hasText: 'Resources' })
  await resourcesBtn.hover()
  const caseStudiesLink = page.locator('[data-dropdown-panel] a[href="/case-studies"]')
  await expect(caseStudiesLink).toBeVisible()
})

test('About dropdown opens and shows Careers link', async ({ page }) => {
  await page.goto('/')
  const aboutBtn = page.locator('nav[aria-label="Main navigation"] button', { hasText: 'About' })
  await aboutBtn.hover()
  const careersLink = page.locator('[data-dropdown-panel] a[href="/careers"]')
  await expect(careersLink).toBeVisible()
})

test('Work nav link navigates to /work/', async ({ page }) => {
  await page.goto('/')
  await page.locator('nav[aria-label="Main navigation"] a[href="/work"]').click()
  await expect(page).toHaveURL(/\/work/)
})
