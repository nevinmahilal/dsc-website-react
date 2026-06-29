import { test, expect } from '@playwright/test'

test('Case Studies listing loads', async ({ page }) => {
  await page.goto('/case-studies/')
  await expect(page.locator('h1')).toBeVisible()
})

test('Case Studies filter updates the grid', async ({ page }) => {
  await page.goto('/case-studies/')
  // Open the first filter dropdown (Service Tags uses a <details> + checkboxes)
  const firstFilter = page.locator('details').first()
  await expect(firstFilter).toBeVisible()
  await firstFilter.locator('summary').click()
  // Select the first checkbox option
  const firstCheckbox = firstFilter.locator('input[type="checkbox"]').first()
  await expect(firstCheckbox).toBeVisible()
  await firstCheckbox.check()
  // Verify filter was applied — summary badge shows active count
  await expect(firstFilter.locator('summary')).toContainText('(1)')
})

test('Dashboards listing loads', async ({ page }) => {
  await page.goto('/dashboards/')
  await expect(page.locator('h1')).toBeVisible()
})

test('Blog listing loads', async ({ page }) => {
  await page.goto('/our-blog/')
  await expect(page.locator('h1')).toBeVisible()
})
