// import { expect, test } from '@playwright/test';

// test('Login page renders correctly', async ({ page }) => {
//     // Navigate to the login page
//     await page.goto('http://localhost:5173/login'); // Adjust if needed

//     // Verify the login modal is visible
//     await expect(page.locator('text=Welcome Back!')).toBeVisible();

//     // Ensure email input field exists
//     await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible();

//     // Ensure password input field exists
//     await expect(page.locator('input[placeholder="Enter your password"]')).toBeVisible();

//     // Ensure Forgot Password link exists
//     await expect(page.locator('text=Forgot Password?')).toBeVisible();

//     // Ensure login button exists
//     await expect(page.locator('text=Log In')).toBeVisible();
// });

// test('Signup link is visible on login page', async ({ page }) => {
//     await page.goto('http://localhost:5173/login');

//     // Check if "Sign Up" button exists
//     await expect(page.locator('text=Sign Up')).toBeVisible();
// });
