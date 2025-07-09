// import { expect, test } from '@playwright/test';

// test.describe('Navbar Component Tests', () => {

//     test.beforeEach(async ({ page }) => {
//         await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
//     });

//     test('should navigate to Contact Us page', async ({ page }) => {
//         // Select the first matching "Contact Us" link explicitly
//         const contactUsLink = page.getByRole("link", { name: "Contact Us" }).first();

//         // Ensure the link is visible and enabled before clicking
//         await expect(contactUsLink).toBeVisible();
//         await expect(contactUsLink).toBeEnabled();

//         // Click the link
//         await contactUsLink.click();

//         // Wait for navigation to complete
//         await page.waitForURL('http://localhost:5173/contactus', { timeout: 5000 });

//         // Validate the URL
//         await expect(page).toHaveURL('http://localhost:5173/contactus');
//     });

// });



// // test('should render Navbar correctly', async ({ page }) => {
// //     await expect(page.locator('img[alt="Logo"]')).toBeVisible();
// //     await expect(page.locator('text=Home')).toBeVisible();
// //     await expect(page.locator('text=About Us')).toBeVisible();
// //     await expect(page.locator('text=Contact Us')).toBeVisible();
// //     await expect(page.locator('button:text("Sign In")')).toBeVisible();
// //     await expect(page.locator('button:text("Sign Up")')).toBeVisible();
// // });

// // test('should navigate to About Us page', async ({ page }) => {
// //     await page.click('text=About Us');
// //     await expect(page).toHaveURL('http://localhost:5173/aboutus');
// // });

// // test('should open Sign In modal when clicking Sign In button', async ({ page }) => {
// //     await page.click('button:text("Sign In")');
// //     await expect(page.locator('h1:text("Welcome Back!")')).toBeVisible();
// // });

// // test('should open Sign Up modal when clicking Sign Up button', async ({ page }) => {
// //     await page.click('button:text("Sign Up")');
// //     await expect(page.locator('h1:text("Create an Account")')).toBeVisible();
// // });

// // test('should show cart icon and update cart count', async ({ page }) => {
// //     await expect(page.locator('svg[aria-label="cart"]')).toBeVisible();

// //     // Simulate adding an item to the cart
// //     await page.evaluate(() => {
// //         localStorage.setItem('cart', JSON.stringify([{ id: 1, name: 'Test Course' }]));
// //         window.dispatchEvent(new Event('storage'));
// //     });

// //     await page.reload();
// //     await expect(page.locator('text=1')).toBeVisible(); // Cart count should be updated
// // });

// // test('should log in, show user name, and logout', async ({ page }) => {
// //     // Simulate login
// //     await page.evaluate(() => {
// //         localStorage.setItem('user', JSON.stringify({ name: 'John Doe', role: 'Student' }));
// //         localStorage.setItem('authToken', 'fake-token');
// //         window.dispatchEvent(new Event('storage'));
// //     });

// //     await page.reload();

// //     await expect(page.locator('text=Welcome, John Doe')).toBeVisible();
// //     await expect(page.locator('button:text("Logout")')).toBeVisible();

// //     // Click Logout
// //     await page.click('button:text("Logout")');

// //     await expect(page.locator('button:text("Sign In")')).toBeVisible();
// //     await expect(page.locator('button:text("Sign Up")')).toBeVisible();
// // });
// // });
