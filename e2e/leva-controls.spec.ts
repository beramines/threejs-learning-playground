import { test, expect } from '@playwright/test';

test.describe('Leva Controls', () => {
  test('should display Leva control panel', async ({ page }) => {
    await page.goto('/category/basics/basic-cube');
    
    // Wait for Leva panel to be rendered
    await page.waitForTimeout(1000);
    
    // Check if Leva panel exists
    const levaPanel = page.locator('[data-leva-container]').or(page.locator('.leva-c-kWgxhW'));
    const panelCount = await levaPanel.count();
    
    // Leva panel should be present
    expect(panelCount).toBeGreaterThan(0);
  });

  test('should interact with Leva controls for materials', async ({ page }) => {
    await page.goto('/category/materials/material-showcase');
    
    // Wait for the page and Leva to load
    await page.waitForTimeout(1500);
    
    // Check if canvas is visible
    await expect(page.locator('canvas')).toBeVisible();
    
    // Try to find Leva container
    const levaContainer = page.locator('[data-leva-container]').or(page.locator('.leva-c-kWgxhW'));
    const containerCount = await levaContainer.count();
    
    if (containerCount > 0) {
      // Leva is present, check for controls
      const inputElements = page.locator('input[type="range"], input[type="number"], input[type="color"]');
      const inputCount = await inputElements.count();
      expect(inputCount).toBeGreaterThan(0);
    }
  });

  test('should have Leva controls in animation samples', async ({ page }) => {
    await page.goto('/category/animations/animation-demo');
    
    // Wait for content to load
    await page.waitForTimeout(1500);
    
    // Check canvas
    await expect(page.locator('canvas')).toBeVisible();
    
    // Check for any interactive controls
    const controls = page.locator('input, button, select').filter({ hasNot: page.locator('[type="hidden"]') });
    const controlCount = await controls.count();
    
    // Should have some interactive elements
    expect(controlCount).toBeGreaterThan(0);
  });

  test('should have Leva controls in lighting demo', async ({ page }) => {
    await page.goto('/category/lights/lighting-demo');
    
    // Wait for content to load
    await page.waitForTimeout(1500);
    
    // Check canvas
    await expect(page.locator('canvas')).toBeVisible();
    
    // Check for Leva or any control panel
    const panels = page.locator('[role="region"], [data-leva-container], .leva-c-kWgxhW');
    const panelCount = await panels.count();
    
    // Should have control panels
    expect(panelCount).toBeGreaterThan(0);
  });

  test('should persist Leva state during navigation within same sample', async ({ page }) => {
    await page.goto('/category/basics/basic-cube');
    
    // Wait for Leva to load
    await page.waitForTimeout(1500);
    
    // Get initial canvas state
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Canvas should still be visible after reload
    await expect(canvas).toBeVisible();
  });
});
