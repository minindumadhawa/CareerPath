const { test, expect } = require('@playwright/test');

test.describe('Internship Posting & Company Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Company
    await page.goto('/login');
    await page.fill('input[name="email"]', 'company1@gmail.com'); // Use a valid company email
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/company-dashboard');
  });

  test('should load company dashboard successfully', async ({ page }) => {
    // Verify welcome banner
    await expect(page.locator('.company-banner')).toBeVisible();
    await expect(page.locator('.stat-card').first()).toBeVisible();
  });

  test('should post a new internship', async ({ page }) => {
    // Navigate to My Internships tab
    await page.click('a.nav-item:has-text("My Internships")');

    // Click Create New
    await page.click('button.btn-post-job:has-text("+ Create New")');

    // Check if form appears
    await expect(page.getByText('Post a New Internship')).toBeVisible();

    // Auto-fill form data to speed up the test
    await page.click('button:has-text("Auto-fill Data")');

    // Click Publish
    await page.click('button.btn-primary-gradient:has-text("Publish Internship")');

    // Verify it was added to the list (Filter buttons appear)
    await expect(page.locator('.internships-filters')).toBeVisible();
  });
});
