import { test, expect } from '@playwright/test';

test.describe('Simple E2E Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/localhost:5173/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display title', async ({ page }) => {
    await page.goto('/');
    const title = await page.locator('h1').textContent();
    expect(title).toContain('Three.js');
  });

  test('should navigate to a category', async ({ page }) => {
    await page.goto('/');
    
    // Find and click any category button
    const categoryButton = page.locator('text=基本').first();
    await categoryButton.click();
    
    // Check URL changed
    await expect(page).toHaveURL(/\/category\//);
  });

  test('should display category page elements', async ({ page }) => {
    await page.goto('/category/basics');
    
    // Check for sidebar
    await expect(page.locator('nav, aside, [role="navigation"]').first()).toBeVisible();
    
    // Check for main content area
    await expect(page.locator('main, [role="main"], article').first()).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
  });
});
