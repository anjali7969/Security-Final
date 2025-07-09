// import { expect, test } from '@playwright/test';

// test.describe('Student Dashboard Component Tests', () => {

//     test.beforeEach(async ({ page }) => {
//         await page.goto('http://localhost:5173/student', { waitUntil: 'networkidle' });

//         // Simulating User Login
//         await page.evaluate(() => {
//             localStorage.setItem('user', JSON.stringify({ _id: '12345', fullName: 'John Doe' }));
//             localStorage.setItem('authToken', 'fake-token');
//             window.dispatchEvent(new Event('storage'));
//         });

//         await page.reload(); // Reload to apply auth state
//     });

//     test('should render Student Dashboard correctly', async ({ page }) => {
//         await expect(page.getByRole('banner')).toBeVisible(); // Navbar
//         await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible(); // Logout Button
//         await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
//         await expect(page.getByRole('button', { name: 'Courses' })).toBeVisible();
//         await expect(page.getByRole('button', { name: 'Wishlist' })).toBeVisible();
//         await expect(page.getByRole('button', { name: 'Purchase History' })).toBeVisible();
//         await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
//     });

//     test('should navigate between dashboard tabs', async ({ page }) => {
//         // Click Courses Tab
//         await page.getByRole('button', { name: 'Courses' }).click();
//         await expect(page.getByText('Courses (')).toBeVisible();

//         // Click Wishlist Tab
//         await page.getByRole('button', { name: 'Wishlist' }).click();
//         await expect(page.getByText('Wishlist (')).toBeVisible();

//         // Click Purchase History Tab
//         await page.getByRole('button', { name: 'Purchase History' }).click();
//         await expect(page.getByText('Purchase History')).toBeVisible();

//         // Click Settings Tab
//         await page.getByRole('button', { name: 'Settings' }).click();
//         await expect(page.getByText('Account Settings')).toBeVisible();
//     });

//     test('should enroll in a course and update cart count', async ({ page }) => {
//         // Simulating adding a course
//         await page.evaluate(() => {
//             localStorage.setItem('cart', JSON.stringify([{ id: 'course1', name: 'React for Beginners' }]));
//             window.dispatchEvent(new Event('storage'));
//         });

//         await page.reload();
//         await page.waitForTimeout(2000); // Wait for UI update

//         // Check that the cart count is updated
//         await expect(page.locator('span.bg-red-500')).toContainText('1');
//     });

//     test('should add and remove course from wishlist', async ({ page }) => {
//         // Click Wishlist Tab
//         await page.getByRole('button', { name: 'Wishlist' }).click();

//         // Simulate Adding a Course to Wishlist
//         await page.evaluate(() => {
//             localStorage.setItem('wishlist', JSON.stringify([{ _id: 'course1', title: 'React for Beginners' }]));
//             window.dispatchEvent(new Event('storage'));
//         });

//         await page.reload();
//         await page.waitForTimeout(2000); // Ensure UI update

//         // Verify Course Appears in Wishlist
//         await expect(page.getByText('React for Beginners')).toBeVisible();

//         // Simulate Removing the Course
//         await page.evaluate(() => {
//             localStorage.setItem('wishlist', JSON.stringify([]));
//             window.dispatchEvent(new Event('storage'));
//         });

//         await page.reload();
//         await page.waitForTimeout(2000);

//         // Ensure Wishlist is Empty
//         await expect(page.getByText('No courses in wishlist')).toBeVisible();
//     });

//     test('should log out and redirect to login page', async ({ page }) => {
//         await page.getByRole('button', { name: 'Logout' }).click();
//         await expect(page).toHaveURL('http://localhost:5173/login');
//     });

// });
