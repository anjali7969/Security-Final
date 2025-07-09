// import { expect, test } from '@playwright/test';

// test('Admin Panel renders correctly', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin'); // Adjust URL if needed
//     await page.waitForLoadState('domcontentloaded');

//     // Check if logo is visible
//     await expect(page.locator('img[alt="Logo"]')).toBeVisible();

//     // Check if the sidebar is visible
//     await expect(page.locator('text=Dashboard')).toBeVisible(); // Adjust based on actual sidebar menu items

//     // Check if "Welcome, Admin!" text is displayed
//     await expect(page.locator('text=Welcome, Admin!')).toBeVisible();
// });

// test('Sidebar is functional', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin');
//     await page.waitForLoadState('domcontentloaded');

//     // Check if Sidebar navigation is present
//     await expect(page.locator('text=Dashboard')).toBeVisible();
//     await expect(page.locator('text=Manage Courses')).toBeVisible();
//     await expect(page.locator('text=Manage Users')).toBeVisible();
//     await expect(page.locator('text=Logout')).toBeVisible();
// });

// test('Dynamic content area is displayed', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin');
//     await page.waitForLoadState('domcontentloaded');

//     // Ensure the dynamic content area (Outlet) is visible
//     await expect(page.locator('text=Welcome, Admin!')).toBeVisible();

//     // Ensure that a default page loads inside the Outlet (Modify if needed)
//     await expect(page.locator('text=Total Users')).toBeVisible(); // Example check for Admin Dashboard
// });
