import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Three.js Learning Playground');
  });

  test('should display welcome message', async ({ page }) => {
    await expect(page.locator('text=インタラクティブなデモとリアルタイムコントロール')).toBeVisible();
  });

  test('should display all 12 category cards', async ({ page }) => {
    const categories = [
      '基本',
      'ジオメトリ',
      'マテリアル',
      'ライト',
      'カメラ',
      'アニメーション',
      'テクスチャ',
      'シェーダー',
      'ポストプロセシング',
      '物理演算',
      'パフォーマンス',
      '高度な機能'
    ];

    for (const category of categories) {
      await expect(page.locator(`text=${category}`).first()).toBeVisible();
    }
  });

  test('should navigate to Basics category when clicked', async ({ page }) => {
    await page.click('text=基本');
    await expect(page).toHaveURL('/category/basics');
    await expect(page.locator('h1')).toContainText('Basics');
  });

  test('should navigate to Advanced category when clicked', async ({ page }) => {
    await page.click('text=高度な機能');
    await expect(page).toHaveURL('/category/advanced');
    await expect(page.locator('h1')).toContainText('Advanced');
  });

  test('should have responsive layout', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.grid')).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.grid')).toBeVisible();
  });
});
