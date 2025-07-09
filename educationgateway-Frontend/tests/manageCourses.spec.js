// import { expect, test } from '@playwright/test';

// test('Manage Courses page renders correctly', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin/courses'); // Adjust the URL as needed
//     await page.waitForLoadState('domcontentloaded');

//     // Check if the heading "Manage Courses" is visible
//     await expect(page.locator('text=Manage Courses')).toBeVisible();

//     // Check if the "Add Course" button is present
//     await expect(page.locator('text=+ Add Course')).toBeVisible();
// });

// test('Add Course button opens the modal', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin/courses');
//     await page.waitForLoadState('domcontentloaded');

//     // Click the "Add Course" button
//     await page.locator('text=+ Add Course').click();

//     // Check if the "Add New Course" modal is visible
//     await expect(page.locator('text=Add New Course')).toBeVisible();
// });

// test('Courses table loads when courses exist', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin/courses');
//     await page.waitForLoadState('domcontentloaded');

//     // Check if the table headers are present
//     await expect(page.locator('text=Title')).toBeVisible();
//     await expect(page.locator('text=Price')).toBeVisible();
//     await expect(page.locator('text=Video')).toBeVisible();
//     await expect(page.locator('text=Image')).toBeVisible();

//     // If courses exist, check that at least one row is present
//     const rows = await page.locator('tbody tr').count();
//     expect(rows).toBeGreaterThanOrEqual(1);
// });

// test('Edit button opens the Edit Course modal', async ({ page }) => {
//     await page.goto('http://localhost:5173/admin/courses');
//     await page.waitForLoadState('domcontentloaded');

//     // Check if there's at least one edit button
//     const editButtons = page.locator('button >> nth=0');
//     await expect(editButtons).toBeVisible();

//     // Click the first edit button
//     await editButtons.click();

//     // Check if the "Edit Course" modal appears
//     await expect(page.locator('text=Edit Course')).toBeVisible();
// });
