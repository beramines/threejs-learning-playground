import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display header with logo', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.locator('text=Three.js Playground')).toBeVisible();
  });

  test('should display sidebar navigation', async ({ page }) => {
    // Navigate to a category to see the sidebar
    await page.goto('/category/basics');
    
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    
    // Check if categories are listed in sidebar
    await expect(sidebar.locator('text=Basics')).toBeVisible();
    await expect(sidebar.locator('text=Geometries')).toBeVisible();
    await expect(sidebar.locator('text=Materials')).toBeVisible();
  });

  test('should navigate between categories using sidebar', async ({ page }) => {
    await page.goto('/category/basics');
    
    // Click on Geometries in sidebar
    await page.locator('aside').locator('text=Geometries').click();
    await expect(page).toHaveURL('/category/geometries');
    await expect(page.locator('h1')).toContainText('Geometries');
    
    // Click on Materials in sidebar
    await page.locator('aside').locator('text=Materials').click();
    await expect(page).toHaveURL('/category/materials');
    await expect(page.locator('h1')).toContainText('Materials');
  });

  test('should navigate to samples within a category', async ({ page }) => {
    await page.goto('/category/basics');
    
    // Check if sample links are visible
    await expect(page.locator('text=Basic Cube')).toBeVisible();
    await expect(page.locator('text=Basic Sphere')).toBeVisible();
    
    // Click on a sample
    await page.click('text=Basic Cube');
    await expect(page).toHaveURL('/category/basics/basic-cube');
  });

  test('should navigate back to home using header logo', async ({ page }) => {
    await page.goto('/category/basics');
    await page.locator('header').locator('text=Three.js Playground').click();
    await expect(page).toHaveURL('/');
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Direct navigation to a sample
    await page.goto('/category/physics/basic-physics');
    await expect(page.locator('h2')).toContainText('Basic Physics');
    
    // Direct navigation to a category
    await page.goto('/category/shaders');
    await expect(page.locator('h1')).toContainText('Shaders');
  });

  test('should maintain navigation state on page refresh', async ({ page }) => {
    await page.goto('/category/animations');
    await page.reload();
    await expect(page).toHaveURL('/category/animations');
    await expect(page.locator('h1')).toContainText('Animations');
  });
});
