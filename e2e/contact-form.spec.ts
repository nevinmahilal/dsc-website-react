import { test, expect } from '@playwright/test'

test('contact form shows validation errors on empty submit', async ({ page }) => {
  await page.goto('/contact/')
  await expect(page.locator('h1')).toBeVisible()
  await page.locator('form button[type="submit"]').click()
  await expect(page.locator('[role="alert"]').first()).toBeVisible()
  await expect(page.locator('#firstName-error')).toContainText('required')
})

test('contact form email field shows error for missing input', async ({ page }) => {
  await page.goto('/contact/')
  await page.locator('input[autocomplete="given-name"]').fill('Test')
  await page.locator('input[autocomplete="family-name"]').fill('User')
  await page.locator('form button[type="submit"]').click()
  await expect(page.locator('#workEmail-error')).toBeVisible()
})
