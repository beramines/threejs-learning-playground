import { test, expect } from '@playwright/test';

test.describe('Code Viewer', () => {
  test('should display code viewer button', async ({ page }) => {
    await page.goto('/category/basics/basic-cube');
    
    // Look for code viewer button
    const codeButton = page.locator('button:has-text("View Code")').or(
      page.locator('button:has-text("Show Code")').or(
        page.locator('button').filter({ hasText: /code/i })
      )
    );
    
    await expect(codeButton).toBeVisible();
  });

  test('should toggle code viewer', async ({ page }) => {
    await page.goto('/category/basics/basic-sphere');
    
    // Find and click the code viewer button
    const codeButton = page.locator('button').filter({ hasText: /code/i }).first();
    await codeButton.click();
    
    // Check if code viewer is displayed
    const codeViewer = page.locator('pre, code, .code-viewer, [class*="code"]');
    const codeViewerCount = await codeViewer.count();
    expect(codeViewerCount).toBeGreaterThan(0);
  });

  test('should display syntax highlighted code', async ({ page }) => {
    await page.goto('/category/shaders/basic-shader');
    
    // Open code viewer
    const codeButton = page.locator('button').filter({ hasText: /code/i }).first();
    const buttonCount = await codeButton.count();
    
    if (buttonCount > 0) {
      await codeButton.click();
      
      // Check for syntax highlighting elements
      const highlightedCode = page.locator('span[class*="token"], span[class*="syntax"], span[class*="hljs"]');
      const highlightCount = await highlightedCode.count();
      
      // Should have syntax highlighting
      expect(highlightCount).toBeGreaterThan(0);
    }
  });

  test('should show code for different sample types', async ({ page }) => {
    const samples = [
      '/category/geometries/geometry-showcase',
      '/category/materials/material-showcase',
      '/category/textures/texture-basics'
    ];

    for (const sampleUrl of samples) {
      await page.goto(sampleUrl);
      
      // Check for code button
      const codeButton = page.locator('button').filter({ hasText: /code/i });
      const buttonCount = await codeButton.count();
      
      if (buttonCount > 0) {
        await codeButton.first().click();
        
        // Check for code content
        const codeContent = page.locator('pre, code, .code-viewer');
        const contentCount = await codeContent.count();
        expect(contentCount).toBeGreaterThan(0);
      }
    }
  });

  test('should maintain code viewer state on same page', async ({ page }) => {
    await page.goto('/category/animations/animation-demo');
    
    const codeButton = page.locator('button').filter({ hasText: /code/i }).first();
    const buttonCount = await codeButton.count();
    
    if (buttonCount > 0) {
      // Open code viewer
      await codeButton.click();
      
      // Check if code is visible
      const codeViewer = page.locator('pre, code, .code-viewer');
      await expect(codeViewer.first()).toBeVisible();
      
      // Canvas should still be visible
      await expect(page.locator('canvas')).toBeVisible();
    }
  });
});
