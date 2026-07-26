const { test, expect } = require('@playwright/test');

test.describe('Career Advice Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', '000000');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin-dashboard');
  });

  test('should navigate to Career Guidance System', async ({ page }) => {
    // Click on Career Guidance System from sidebar
    await page.click('a.nav-item:has-text("Career Guidance System")');

    // Verify it navigates to the Career Admin Dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });
});
