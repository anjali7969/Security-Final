import { expect, test } from '@playwright/test';

test('Forgot Password page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/forgot'); // Ensure this URL is correct
    await page.waitForLoadState('domcontentloaded'); // Ensures the page is fully loaded

    // Ensure Navbar is visible
    await expect(page.locator('nav').first()).toBeVisible();

    // Ensure Forgot Password heading is visible
    await expect(page.locator('text=Forgot Password')).toBeVisible();

    // Ensure description text is present
    await expect(page.locator('text=Enter your email below and we’ll send you a reset link.')).toBeVisible();
});

test('Email input field is present and functional', async ({ page }) => {
    await page.goto('http://localhost:5173/forgot');
    await page.waitForLoadState('domcontentloaded');

    // Locate email input field
    const emailInput = page.locator('input[placeholder="Enter your email"]');
    await expect(emailInput).toBeVisible();

    // Type an email into the input field
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
});

test('Send Reset Link button is clickable', async ({ page }) => {
    await page.goto('http://localhost:5173/forgot');
    await page.waitForLoadState('domcontentloaded');

    // Locate and click the button
    const sendButton = page.locator('text=Send Reset Link');
    await expect(sendButton).toBeVisible();
    await sendButton.click();
});
