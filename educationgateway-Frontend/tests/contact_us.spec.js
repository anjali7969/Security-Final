import { expect, test } from '@playwright/test';

// test('Contact Us page renders correctly', async ({ page }) => {
//     await page.goto('http://localhost:5173/contactus'); // Ensure the URL is correct
//     await page.waitForLoadState('domcontentloaded'); // Ensures the page is fully loaded

//     // Ensure Navbar is visible
//     await expect(page.locator('nav').first()).toBeVisible();

//     // Ensure Google Map is embedded
//     await expect(page.locator('iframe[title="Google Map"]')).toBeVisible();

//     // Ensure Contact Info section is visible
//     await expect(page.locator('text=Contact Us')).toBeVisible();
//     await expect(page.locator('text=📍 Address: Kathmandu, Nepal')).toBeVisible();
//     await expect(page.locator('text=📧 Email: support@gatewayeducation.com')).toBeVisible();
//     await expect(page.locator('text=📞 Phone: +977 9800000000')).toBeVisible();
// });

test('Contact form fields are present and functional', async ({ page }) => {
    await page.goto('http://localhost:5173/contactus');
    await page.waitForLoadState('domcontentloaded');

    // Ensure the form heading is visible
    await expect(page.locator('text=Send a Message')).toBeVisible();

    // Ensure input fields are present
    const nameInput = page.locator('input[placeholder="Your Name"]');
    const emailInput = page.locator('input[placeholder="Your Email"]');
    const messageInput = page.locator('textarea[placeholder="Your Message"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    // Ensure button is present and clickable
    const sendButton = page.locator('text=Send Message');
    await expect(sendButton).toBeVisible();
    await sendButton.click();
});

test('Technical support details are visible', async ({ page }) => {
    await page.goto('http://localhost:5173/contactus');
    await page.waitForLoadState('domcontentloaded');

    // Ensure technical support contact info is displayed
    await expect(page.locator('text=Technical Support')).toBeVisible();
    await expect(page.locator('text=📧 example@gmail.com')).toBeVisible();

    // Ensure landline and mobile numbers are visible
    await expect(page.locator('text=Land Line')).toBeVisible();
    await expect(page.locator('text=📞 0421 3643')).toBeVisible();
    await expect(page.locator('text=Mobile')).toBeVisible();
    await expect(page.locator('text=📞 +977 9800000000')).toBeVisible();
});

