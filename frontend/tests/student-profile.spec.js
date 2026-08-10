const { test, expect } = require('@playwright/test');

test.describe('Student Profile & Resume Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Student
    await page.goto('/login');
    await page.fill('input[name="email"]', 'student1@gmail.com'); // Use a valid student email
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/student-dashboard');
  });

  test('should create and update student profile', async ({ page }) => {
    // Click on My Profile tab
    await page.click('a.nav-item:has-text("My Profile")');

    // Check if profile header is visible
    await expect(page.getByText('My Resume / Profile')).toBeVisible();

    // Fill profile details
    await page.fill('input[name="fullName"]', 'Test Student');
    await page.fill('input[name="university"]', 'University of Colombo');
    await page.fill('input[name="phoneNumber"]', '+94 77 123 4567');
    await page.fill('input[name="technicalSkills"]', 'React, Node, Playwright');

    // Save profile
    await page.click('button.btn-save');

    // Wait for success message
    await expect(page.getByText('Profile saved successfully!')).toBeVisible();
  });

  test('should navigate to CV Generation', async ({ page }) => {
    // Click on Generate CV tab
    await page.click('a.nav-item:has-text("Generate CV")');

    // Check if CV generator loaded
    // Depending on CVPreview / ResumeTemplates component UI, wait for a specific text
    await expect(page.locator('.dashboard-content')).toBeVisible();
  });
});
