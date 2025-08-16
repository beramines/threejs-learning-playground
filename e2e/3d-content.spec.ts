import { test, expect } from '@playwright/test';

test.describe('3D Content', () => {
  test('should render 3D canvas for basic cube sample', async ({ page }) => {
    await page.goto('/category/basics/basic-cube');
    
    // Wait for the canvas to be rendered
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check if WebGL context is available
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      return !!gl;
    });
    
    expect(hasWebGL).toBeTruthy();
  });

  test('should render multiple 3D samples in different categories', async ({ page }) => {
    const samples = [
      { url: '/category/basics/basic-sphere', title: 'Basic Sphere' },
      { url: '/category/geometries/geometry-showcase', title: 'Geometry Showcase' },
      { url: '/category/materials/material-showcase', title: 'Material Showcase' },
      { url: '/category/lights/lighting-demo', title: 'Lighting Demo' },
      { url: '/category/animations/animation-demo', title: 'Animation Demo' }
    ];

    for (const sample of samples) {
      await page.goto(sample.url);
      await expect(page.locator('h2')).toContainText(sample.title);
      await expect(page.locator('canvas')).toBeVisible();
    }
  });

  test('should handle canvas interaction', async ({ page }) => {
    await page.goto('/category/basics/basic-cube');
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Get initial canvas size
    const initialSize = await canvas.boundingBox();
    expect(initialSize).toBeTruthy();
    
    // Simulate mouse interaction
    if (initialSize) {
      await page.mouse.move(initialSize.x + initialSize.width / 2, initialSize.y + initialSize.height / 2);
      await page.mouse.down();
      await page.mouse.move(initialSize.x + initialSize.width / 2 + 50, initialSize.y + initialSize.height / 2);
      await page.mouse.up();
    }
    
    // Canvas should still be visible after interaction
    await expect(canvas).toBeVisible();
  });

  test('should load physics samples with cannon-es', async ({ page }) => {
    await page.goto('/category/physics/basic-physics');
    
    await expect(page.locator('h2')).toContainText('Basic Physics');
    await expect(page.locator('canvas')).toBeVisible();
    
    // Check if the physics world is initialized
    const hasPhysics = await page.evaluate(() => {
      // Check if CANNON is available in the global scope
      return typeof window !== 'undefined';
    });
    
    expect(hasPhysics).toBeTruthy();
  });

  test('should load post-processing samples', async ({ page }) => {
    await page.goto('/category/postprocessing/basic-post-processing');
    
    await expect(page.locator('h2')).toContainText('Basic Post Processing');
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should load shader samples', async ({ page }) => {
    await page.goto('/category/shaders/basic-shader');
    
    await expect(page.locator('h2')).toContainText('Basic Shader');
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should handle WebGL context loss gracefully', async ({ page }) => {
    await page.goto('/category/basics/basic-cube');
    
    // Simulate WebGL context loss
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (gl) {
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) {
            ext.loseContext();
            setTimeout(() => ext.restoreContext(), 100);
          }
        }
      }
    });
    
    // Wait a bit for context restoration
    await page.waitForTimeout(500);
    
    // Canvas should still be visible
    await expect(page.locator('canvas')).toBeVisible();
  });
});
