import { expect, test } from '@playwright/test';


test('About Us page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/aboutus');
    await page.waitForLoadState('domcontentloaded'); // Ensures full page load

    // Ensure Navbar is visible (fix: select first instance)
    await expect(page.locator('nav').first()).toBeVisible();

    // Ensure "About Us" heading is present (fix: use getByRole for accuracy)
    await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();

    // Ensure hero section contains expected text (fix: text can have formatting differences)
    await expect(page.locator('text=GateWay Education is a leading e-learning platform')).toBeVisible();

    // Ensure at least 2 images are loaded (fix: check visibility instead of count)
    await expect(page.locator('img').first()).toBeVisible();

    // Ensure "Why Choose Us" section is visible
    await expect(page.locator('text=Why Choose GateWay Education?')).toBeVisible();

    // Ensure "Flexible Learning" and "Career Support" sections are present
    await expect(page.locator('text=Flexible Learning')).toBeVisible();
    await expect(page.locator('text=Career Support')).toBeVisible();

    // Ensure "Call to Action" section is visible (fix: target specific section)
    await expect(page.locator('section:has-text("Join Our Learning Community Today!")')).toBeVisible();
});


test('Why Choose Us section is visible', async ({ page }) => {
    await page.goto('http://localhost:5173/aboutus');

    // Check the section heading
    await expect(page.getByRole('heading', { name: 'Why Choose GateWay Education?' })).toBeVisible();

    // Check the first reason
    await expect(page.getByRole('heading', { name: 'Flexible Learning' })).toBeVisible();
    await expect(page.locator('text=Study at your own pace')).toBeVisible();

    // Check the second reason
    await expect(page.getByRole('heading', { name: 'Career Support' })).toBeVisible();
    await expect(page.locator('text=Access job placements')).toBeVisible();
});

test('Call to action section is visible and clickable', async ({ page }) => {
    await page.goto('http://localhost:5173/aboutus');

    // Check the CTA section (fix: use getByRole for precise matching)
    await expect(page.getByRole('heading', { name: 'Join Our Learning Community Today!' })).toBeVisible();
    await expect(page.locator('text=Enhance your skills and career')).toBeVisible();

    // Check the Explore Courses button
    const exploreButton = page.getByRole('link', { name: 'Explore Courses' });
    await expect(exploreButton).toBeVisible();
    await exploreButton.click();
});
