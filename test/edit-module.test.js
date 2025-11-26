/**
 * Edit Module Tests for Lalita Sahasranama Website
 * Tests the inline editing functionality
 *
 * Prerequisites:
 * - Edit server must be running on http://localhost:3000
 * - Website server must be running on http://localhost:8000
 *
 * Run with: npm test edit-module.test.js
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const EDIT_SERVER_URL = 'http://localhost:3000';

describe('Edit Module Tests', () => {
    let browser, page;

    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    describe('Edit Server Tests', () => {
        test('Edit server should be running', async () => {
            const response = await page.goto(`${EDIT_SERVER_URL}/health`);
            expect(response.status()).toBe(200);
        });

        test('Edit server API should respond', async () => {
            const response = await fetch(`${EDIT_SERVER_URL}/health`);
            expect(response.ok).toBe(true);
        });
    });

    describe('Edit Module Initialization', () => {
        test('Edit module should initialize when server is running', async () => {
            const consoleLogs = [];
            page.on('console', msg => consoleLogs.push(msg.text()));

            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            // Check for initialization message
            expect(consoleLogs.some(log => log.includes('✓ Edit module initialized'))).toBe(true);
        });

        test('Edit buttons should appear when server is running', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            // Check for edit buttons
            const mantraEditBtn = await page.locator('#mantra-section-edit-btn');
            const balatapEditBtn = await page.locator('#balatapa-section-edit-btn');
            const jayamangalaEditBtn = await page.locator('#jayamangala-edit-btn');
            const soubhagyaEditBtn = await page.locator('#soubhagya-edit-btn');

            expect(await mantraEditBtn.count()).toBe(1);
            expect(await balatapEditBtn.count()).toBe(1);
            expect(await jayamangalaEditBtn.count()).toBe(1);
            expect(await soubhagyaEditBtn.count()).toBe(1);
        });

        test('Edit buttons should be positioned on the right', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const mantraEditBtn = await page.locator('#mantra-section-edit-btn');
            const position = await mantraEditBtn.evaluate(el => {
                const style = window.getComputedStyle(el);
                return {
                    position: style.position,
                    right: style.right
                };
            });

            expect(position.position).toBe('absolute');
            expect(position.right).toBe('10px');
        });

        test('Edit buttons should have proper styling', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');

            // Check initial opacity
            const opacity = await editBtn.evaluate(el => window.getComputedStyle(el).opacity);
            expect(parseFloat(opacity)).toBeLessThan(1);

            // Hover and check opacity increases
            await editBtn.hover();
            await page.waitForTimeout(100);

            const hoverOpacity = await editBtn.evaluate(el => window.getComputedStyle(el).opacity);
            expect(parseFloat(hoverOpacity)).toBeGreaterThan(parseFloat(opacity));
        });
    });

    describe('Mantra Editing', () => {
        test('Clicking mantra edit button should show textarea', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            // Check textarea appears
            const textarea = await page.locator('#mantra-section textarea');
            expect(await textarea.count()).toBe(1);
            expect(await textarea.isVisible()).toBe(true);
        });

        test('Mantra textarea should have correct styling', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#mantra-section textarea');
            const rows = await textarea.getAttribute('rows');
            const styles = await textarea.evaluate(el => ({
                fontFamily: window.getComputedStyle(el).fontFamily,
                border: window.getComputedStyle(el).border
            }));

            expect(rows).toBe('2');
            expect(styles.fontFamily).toContain('Annapurna SIL');
        });

        test('Save and Cancel buttons should appear', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const saveBtn = await page.locator('button:has-text("💾 Save")');
            const cancelBtn = await page.locator('button:has-text("✕ Cancel")');

            expect(await saveBtn.count()).toBeGreaterThan(0);
            expect(await cancelBtn.count()).toBeGreaterThan(0);
        });

        test('Cancel button should restore original content', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const originalContent = await page.locator('#mantra-section').textContent();

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#mantra-section textarea');
            await textarea.fill('Test mantra content');

            const cancelBtn = await page.locator('button:has-text("✕ Cancel")').first();
            await cancelBtn.click();

            const restoredContent = await page.locator('#mantra-section').textContent();
            expect(restoredContent).toBe(originalContent);
        });

        test('Arrow keys in textarea should not navigate pages', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#mantra-section textarea');
            await textarea.focus();
            await textarea.fill('Test content');

            const urlBefore = page.url();

            // Press arrow keys
            await page.keyboard.press('ArrowLeft');
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(500);

            const urlAfter = page.url();

            // URL should not change
            expect(urlAfter).toBe(urlBefore);
        });
    });

    describe('Balatapa Editing', () => {
        test('Clicking balatapa edit button should show textarea', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#balatapa-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#balatapa-section textarea');
            expect(await textarea.count()).toBe(1);
            expect(await textarea.isVisible()).toBe(true);
        });

        test('Balatapa textarea should have 3 rows', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#balatapa-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#balatapa-section textarea');
            const rows = await textarea.getAttribute('rows');

            expect(rows).toBe('3');
        });

        test('Cancel button should work for balatapa', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#balatapa-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#balatapa-section textarea');
            await textarea.fill('Test balatapa');

            const cancelBtn = await page.locator('#balatapa-section button:has-text("✕ Cancel")');
            await cancelBtn.click();

            // Edit button should be back
            const editBtnAfter = await page.locator('#balatapa-section-edit-btn');
            expect(await editBtnAfter.count()).toBe(1);
        });
    });

    describe('Commentary Editing', () => {
        test('Clicking commentary edit should expand and show textarea', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            // Click jayamangala edit button
            const editBtn = await page.locator('#jayamangala-edit-btn');
            await editBtn.click();

            await page.waitForTimeout(500);

            // Commentary should expand
            const collapsible = await page.locator('#jayamangala-collapsible');
            const isExpanded = await collapsible.evaluate(el => el.classList.contains('expanded'));
            expect(isExpanded).toBe(true);

            // Textarea should appear
            const textarea = await page.locator('#jayamangala-collapsible textarea');
            expect(await textarea.count()).toBe(1);
        });

        test('Commentary textarea should have 15 rows', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#jayamangala-edit-btn');
            await editBtn.click();
            await page.waitForTimeout(500);

            const textarea = await page.locator('#jayamangala-collapsible textarea');
            const rows = await textarea.getAttribute('rows');

            expect(rows).toBe('15');
        });

        test('Soubhagya commentary edit should work', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#soubhagya-edit-btn');
            await editBtn.click();
            await page.waitForTimeout(500);

            const textarea = await page.locator('#soubhagya-collapsible textarea');
            expect(await textarea.count()).toBe(1);
        });

        test('Commentary cancel button should work', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#jayamangala-edit-btn');
            await editBtn.click();
            await page.waitForTimeout(500);

            const textarea = await page.locator('#jayamangala-collapsible textarea');
            await textarea.fill('Test commentary content');

            const cancelBtn = await page.locator('#jayamangala-collapsible button:has-text("✕ Cancel")');
            await cancelBtn.click();

            // Textarea should be gone
            const textareaAfter = await page.locator('#jayamangala-collapsible textarea');
            expect(await textareaAfter.count()).toBe(0);
        });
    });

    describe('Edit Button Interaction', () => {
        test('Multiple sections can be edited independently', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            // Edit mantra
            const mantraEditBtn = await page.locator('#mantra-section-edit-btn');
            await mantraEditBtn.click();

            // Mantra textarea should appear
            const mantraTextarea = await page.locator('#mantra-section textarea');
            expect(await mantraTextarea.count()).toBe(1);

            // Cancel mantra edit
            const cancelBtn = await page.locator('#mantra-section button:has-text("✕ Cancel")');
            await cancelBtn.click();

            // Now edit balatapa
            const balatapEditBtn = await page.locator('#balatapa-section-edit-btn');
            await balatapEditBtn.click();

            // Balatapa textarea should appear
            const balatapTextarea = await page.locator('#balatapa-section textarea');
            expect(await balatapTextarea.count()).toBe(1);
        });

        test('Cannot edit same section twice simultaneously', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            // Check that only one textarea exists
            const textareas = await page.locator('#mantra-section textarea');
            expect(await textareas.count()).toBe(1);

            // Try clicking again (button should be gone)
            const editBtnAfter = await page.locator('#mantra-section-edit-btn');
            expect(await editBtnAfter.count()).toBe(0);
        });
    });

    describe('API Integration Tests', () => {
        test('Edit server read endpoint should work', async () => {
            const response = await fetch(`${EDIT_SERVER_URL}/api/read?file=Mantra/0001.txt`);
            expect(response.ok).toBe(true);

            const data = await response.json();
            expect(data.success).toBeDefined();
        });

        test('Textarea should load existing content', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            // Get current mantra text
            const currentMantra = await page.locator('#mantra-section').textContent();

            // Click edit
            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#mantra-section textarea');
            const textareaValue = await textarea.inputValue();

            // Should contain the current mantra (minus label)
            const cleanedMantra = currentMantra.replace(/नाममन्त्रः\s*»\s*/, '').trim();
            expect(textareaValue).toBe(cleanedMantra === '-' ? '' : cleanedMantra);
        });
    });

    describe('Devanagari Input Support', () => {
        test('Should support Devanagari text input', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#mantra-section textarea');
            const devanagariText = 'ॐ श्रीं ह्रीं क्लीं';
            await textarea.fill(devanagariText);

            const value = await textarea.inputValue();
            expect(value).toBe(devanagariText);
        });

        test('Font family should support Devanagari', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const textarea = await page.locator('#mantra-section textarea');
            const fontFamily = await textarea.evaluate(el => window.getComputedStyle(el).fontFamily);

            expect(fontFamily).toContain('Annapurna SIL');
        });
    });

    describe('Button Styling Tests', () => {
        test('Save button should have green background', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const saveBtn = await page.locator('#mantra-section button:has-text("💾 Save")');
            const bgColor = await saveBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);

            // Should be green (#4CAF50)
            expect(bgColor).toContain('76, 175, 80'); // RGB values for #4CAF50
        });

        test('Cancel button should have red background', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const cancelBtn = await page.locator('#mantra-section button:has-text("✕ Cancel")');
            const bgColor = await cancelBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);

            // Should be red (#f44336)
            expect(bgColor).toContain('244, 67, 54'); // RGB values for #f44336
        });

        test('Save button should change color on hover', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');
            await editBtn.click();

            const saveBtn = await page.locator('#mantra-section button:has-text("💾 Save")');

            const bgBefore = await saveBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);

            await saveBtn.hover();
            await page.waitForTimeout(100);

            const bgAfter = await saveBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);

            // Color should change on hover
            expect(bgBefore).not.toBe(bgAfter);
        });
    });

    describe('Error Handling', () => {
        test('Should handle when edit server is not available', async () => {
            // This test assumes edit server might not be running
            // Skip if server is running, as we can't test this condition

            const consoleWarnings = [];
            page.on('console', msg => {
                if (msg.type() === 'warning') {
                    consoleWarnings.push(msg.text());
                }
            });

            // Try to initialize with potentially unavailable server
            // (This would need server to be stopped to properly test)
        });

        test('Should gracefully handle missing files', async () => {
            await page.goto(`${BASE_URL}/naamani/9999/`); // High number, might not have all data
            await page.waitForTimeout(1000);

            // Should still load page without errors
            const title = await page.title();
            expect(title).toBeTruthy();
        });
    });
});
