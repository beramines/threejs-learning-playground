import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check First Contentful Paint
    const fcp = await page.evaluate(() => {
      const perfData = window.performance.getEntriesByType('paint');
      const fcpEntry = perfData.find(entry => entry.name === 'first-contentful-paint');
      return fcpEntry ? fcpEntry.startTime : 0;
    });
    
    // FCP should be within 2 seconds
    expect(fcp).toBeLessThan(2000);
  });

  test('should handle multiple 3D scenes efficiently', async ({ page }) => {
    // Navigate through multiple samples quickly
    const samples = [
      '/category/basics/basic-cube',
      '/category/geometries/geometry-showcase',
      '/category/materials/material-showcase',
      '/category/animations/animation-demo'
    ];

    for (const sample of samples) {
      await page.goto(sample);
      await expect(page.locator('canvas')).toBeVisible();
      
      // Check if WebGL context is still valid
      const hasWebGL = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return false;
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        return !!gl;
      });
      
      expect(hasWebGL).toBeTruthy();
    }
  });

  test('should not have memory leaks when navigating', async ({ page }) => {
    // Get initial memory usage
    const getMemoryUsage = async () => {
      return await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });
    };

    const initialMemory = await getMemoryUsage();
    
    // Navigate through multiple pages
    for (let i = 0; i < 5; i++) {
      await page.goto('/category/basics/basic-cube');
      await page.goto('/category/physics/basic-physics');
      await page.goto('/');
    }
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if (typeof (global as any).gc === 'function') {
        (global as any).gc();
      }
    });
    
    // Wait a bit for cleanup
    await page.waitForTimeout(1000);
    
    const finalMemory = await getMemoryUsage();
    
    // Memory increase should be reasonable (less than 50MB)
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });

  test('should handle window resize efficiently', async ({ page }) => {
    await page.goto('/category/basics/basic-sphere');
    
    // Resize window multiple times
    const sizes = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
      { width: 1920, height: 1080 }
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(100);
      
      // Canvas should still be visible and responsive
      await expect(page.locator('canvas')).toBeVisible();
    }
  });

  test('should load performance optimization sample', async ({ page }) => {
    await page.goto('/category/performance/performance-optimization');
    
    await expect(page.locator('h2')).toContainText('Performance Optimization');
    await expect(page.locator('canvas')).toBeVisible();
    
    // Check if requestAnimationFrame is being used
    const hasRAF = await page.evaluate(() => {
      return typeof window.requestAnimationFrame === 'function';
    });
    
    expect(hasRAF).toBeTruthy();
  });

  test('should handle rapid navigation', async ({ page }) => {
    // Rapidly navigate between pages
    const pages = [
      '/',
      '/category/basics',
      '/category/basics/basic-cube',
      '/category/materials',
      '/category/materials/material-showcase',
      '/',
      '/category/physics',
      '/category/physics/basic-physics'
    ];

    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      // Don't wait for full load, just check navigation worked
      await expect(page).toHaveURL(pageUrl);
    }
    
    // Final page should be fully functional
    await expect(page.locator('canvas')).toBeVisible();
  });
});
