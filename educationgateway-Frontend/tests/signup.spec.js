// import { expect, test } from '@playwright/test';

// test.describe('Signup Component Tests', () => {
//     test.beforeEach(async ({ page }) => {
//         // ✅ Start by navigating to the site
//         await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

//         // ✅ Ensure "Sign Up" button is visible
//         const signUpButton = page.locator('button:has-text("Sign Up")').first();
//         await expect(signUpButton).toBeVisible({ timeout: 10000 });

//         // ✅ Click the Sign-Up button to open the modal
//         await signUpButton.click();

//         // ✅ Wait for the modal to fully appear
//         await expect(page.locator('h1:text("Create an Account")')).toBeVisible({ timeout: 10000 });
//     });

//     test('should render signup modal correctly', async ({ page }) => {
//         await expect(page.locator('h1:text("Create an Account")')).toBeVisible();
//         await expect(page.locator('input[placeholder="Enter your full name"]')).toBeVisible();
//         await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible();
//         await expect(page.locator('input[placeholder="Enter your phone number"]')).toBeVisible();
//         await expect(page.locator('input[placeholder="Enter your password"]')).toBeVisible();
//         await expect(page.locator('button:text("Sign Up")')).toBeVisible(); // Fixed button selector
//     });

//     test('should toggle password visibility when clicking the eye button', async ({ page }) => {
//         await page.fill('input[placeholder="Enter your password"]', 'password123');

//         const eyeButton = page.locator('button[aria-label="toggle password visibility"]');
//         await eyeButton.click();
//         await page.waitForTimeout(200);

//         const inputType = await page.getAttribute('input[placeholder="Enter your password"]', 'type');
//         expect(inputType).toBe('text'); // Password should be visible

//         await eyeButton.click();
//         const hiddenType = await page.getAttribute('input[placeholder="Enter your password"]', 'type');
//         expect(hiddenType).toBe('password'); // Password should be hidden again
//     });




// });
