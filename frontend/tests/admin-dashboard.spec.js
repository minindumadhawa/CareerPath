const { test, expect } = require('@playwright/test');

test.describe('Admin Dashboard & AI CV Filtering', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Admin before tests
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gmail.com'); // Use a valid admin email in your DB
    await page.fill('input[name="password"]', '000000'); // Use valid admin password
    await page.click('button[type="submit"]');

    // Wait for URL to change to admin dashboard
    await expect(page).toHaveURL('/admin-dashboard');
  });

  test('should load admin dashboard successfully', async ({ page }) => {
    // Verify dashboard elements
    await expect(page.getByText('System Administration ⚙️')).toBeVisible();
    await expect(page.locator('.stat-card').first()).toBeVisible();
  });

  test('should filter CVs using AI', async ({ page }) => {
    // Click on the AI CV Filter tab
    await page.click('a.nav-item:has-text("AI CV Filter")');

    // Verify we are on the AI Filter section
    await expect(page.getByText('🤖 AI CV Filter & ATS Ranking')).toBeVisible();

    // The form inputs have placeholders we can use or we can target by index if needed.
    // Fill required skills
    await page.fill('input[placeholder="e.g. Java, React, SQL, C#"]', 'Java, React');

    // Fill target degree
    await page.fill('input[placeholder="e.g. Software Engineering"]', 'Software Engineering');

    // Fill keywords
    await page.fill('input[placeholder="e.g. Agile, SpringBoot, AWS"]', 'Agile');

    // Click the scan button
    await page.click('button.btn-scan-wide');

    // Wait for the results to load (checking for the results list or empty state)
    // AI Scan might take a second, Playwright auto-waits
    const resultsHeader = page.getByText('Ranked Candidates');
    await expect(resultsHeader).toBeVisible();
  });
});
