import { expect, test } from '@playwright/test';

// test('Reset Password page renders correctly', async ({ page }) => {
//     await page.goto('http://localhost:5173/reset-password?token=dummyToken'); // Adjust the URL as needed
//     await page.waitForLoadState('domcontentloaded');

//     // Check if Navbar is visible
//     await expect(page.locator('nav').first()).toBeVisible();

//     // Check if Reset Password heading is visible
//     await expect(page.locator('text=Reset Password')).toBeVisible();

//     // Check if instruction text is visible
//     await expect(page.locator('text=Enter a new password for your account')).toBeVisible();
// });

test('Password input field is functional', async ({ page }) => {
    await page.goto('http://localhost:5173/reset-password?token=dummyToken');
    await page.waitForLoadState('domcontentloaded');

    // Locate password input field
    const passwordInput = page.locator('input[placeholder="Enter new password"]');
    await expect(passwordInput).toBeVisible();

    // Type a password into the input field
    await passwordInput.fill('NewSecurePassword123');
    await expect(passwordInput).toHaveValue('NewSecurePassword123');
});

// test('Reset Password button is clickable', async ({ page }) => {
//     await page.goto('http://localhost:5173/reset-password?token=dummyToken');
//     await page.waitForLoadState('domcontentloaded');

//     // Locate and check the Reset Password button
//     const resetButton = page.locator('text=Reset Password');
//     await expect(resetButton).toBeVisible();
//     await resetButton.click();
// });
