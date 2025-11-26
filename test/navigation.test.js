/**
 * Navigation Tests for Lalita Sahasranama Website
 * Tests URL structure, redirects, and navigation flows
 *
 * Run with: npm test
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

describe('Website Navigation Tests', () => {
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

    describe('Homepage Tests', () => {
        test('Root URL should load homepage', async () => {
            await page.goto(`${BASE_URL}/`);

            // Check for homepage elements
            const title = await page.title();
            expect(title).toBe('KaamakshiDarpanam');

            // Check for goddess image
            const image = await page.locator('img.kamakshi');
            expect(await image.count()).toBe(1);

            // Check for slokas
            const slokas = await page.locator('.sloka');
            expect(await slokas.count()).toBeGreaterThan(0);
        });

        test('Homepage should have link to names list', async () => {
            await page.goto(`${BASE_URL}/`);

            const namesLink = await page.locator('a.main-link');
            expect(await namesLink.getAttribute('href')).toBe('naamani/');
            expect(await namesLink.textContent()).toContain('ललितासहस्रनामानि');
        });

        test('Homepage should load CSS correctly', async () => {
            await page.goto(`${BASE_URL}/`);

            // Check that CSS is loaded
            const styles = await page.locator('link[rel="stylesheet"]');
            const hrefs = await styles.evaluateAll(links => links.map(l => l.href));

            expect(hrefs.some(href => href.includes('home/styles.css'))).toBe(true);
        });
    });

    describe('Names List Tests', () => {
        test('Names list should be accessible at /naamani/', async () => {
            await page.goto(`${BASE_URL}/naamani/`);

            const title = await page.title();
            expect(title).toContain('All Names Index');

            // Check for search box
            const searchBox = await page.locator('#searchBox');
            expect(await searchBox.count()).toBe(1);
        });

        test('Home button should navigate to root', async () => {
            await page.goto(`${BASE_URL}/naamani/`);

            const homeButton = await page.locator('a.home-button');
            expect(await homeButton.getAttribute('href')).toBe('../');
        });

        test('Names list should load 1000 names', async () => {
            await page.goto(`${BASE_URL}/naamani/`);

            // Wait for names to load
            await page.waitForSelector('.name-card', { timeout: 5000 });

            const nameCards = await page.locator('.name-card');
            const count = await nameCards.count();
            expect(count).toBe(1000);
        });

        test('Clicking a name should navigate to individual page', async () => {
            await page.goto(`${BASE_URL}/naamani/`);

            await page.waitForSelector('.name-card', { timeout: 5000 });

            // Click first name
            const firstNameCard = await page.locator('.name-card').first();
            await firstNameCard.click();

            // Should navigate to /naamani/1/
            await page.waitForURL('**/naamani/1/**');
            expect(page.url()).toContain('/naamani/1/');
        });
    });

    describe('Individual Name Page Tests', () => {
        test('Individual name page should load', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const title = await page.title();
            expect(title).toContain('Lalita Sahasranama');

            // Check for navigation buttons
            const prevBtn = await page.locator('#prevBtn');
            const nextBtn = await page.locator('#nextBtn');
            expect(await prevBtn.count()).toBe(1);
            expect(await nextBtn.count()).toBe(1);
        });

        test('Sanskrit numerals should be displayed', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const numberDisplay = await page.locator('#nameNumber');
            const text = await numberDisplay.textContent();

            // Should show Sanskrit numeral १ for 1
            expect(text).toBe('१');
        });

        test('Navigation buttons should work correctly', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            // Previous button should be disabled on first page
            const prevBtn = await page.locator('#prevBtn');
            expect(await prevBtn.isDisabled()).toBe(true);

            // Next button should work
            const nextBtn = await page.locator('#nextBtn');
            await nextBtn.click();

            await page.waitForURL('**/naamani/2/**');
            expect(page.url()).toContain('/naamani/2/');
        });

        test('Arrow key navigation should work', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            // Press right arrow
            await page.keyboard.press('ArrowRight');

            await page.waitForURL('**/naamani/2/**');
            expect(page.url()).toContain('/naamani/2/');
        });

        test('Home button should navigate to root', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const upButton = await page.locator('.number-row');
            await upButton.click();

            await page.waitForURL('**/naamani/**');
            expect(page.url()).toMatch(/\/naamani\/?$/);
        });

        test('Mantra section should be visible', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const mantraSection = await page.locator('#mantra-section');
            expect(await mantraSection.isVisible()).toBe(true);
            expect(await mantraSection.textContent()).toContain('नाममन्त्रः');
        });

        test('Balatapa section should be visible', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const balatapa = await page.locator('#balatapa-section');
            expect(await balatapa.isVisible()).toBe(true);
            expect(await balatapa.textContent()).toContain('बालातपा');
        });

        test('Commentary sections should be collapsible', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const jayamangalaHeader = await page.locator('.collapsible-commentary-header.jayamangala');
            const jayamangalaContent = await page.locator('#jayamangala-collapsible');

            // Should start collapsed
            expect(await jayamangalaHeader.evaluate(el => el.classList.contains('collapsed'))).toBe(true);

            // Click to expand
            await jayamangalaHeader.click();

            // Should be expanded
            expect(await jayamangalaContent.evaluate(el => el.classList.contains('expanded'))).toBe(true);
        });
    });

    describe('URL Structure Tests', () => {
        test('No unnecessary redirects', async () => {
            const urls = [
                `${BASE_URL}/`,
                `${BASE_URL}/naamani/`,
                `${BASE_URL}/naamani/1/`,
                `${BASE_URL}/naamani/500/`,
                `${BASE_URL}/naamani/1000/`
            ];

            for (const url of urls) {
                const response = await page.goto(url);

                // Should load directly without redirects (status 200)
                expect(response.status()).toBe(200);

                // Final URL should match requested URL
                expect(page.url()).toBe(url);
            }
        });

        test('Relative paths work correctly', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            // Click next button (uses relative path)
            await page.locator('#nextBtn').click();
            await page.waitForURL('**/naamani/2/**');

            // Should navigate correctly
            expect(page.url()).toContain('/naamani/2/');
        });
    });

    describe('Data Loading Tests', () => {
        test('Name data should load correctly', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            // Wait for name to load
            await page.waitForSelector('.name-title');

            const nameTitle = await page.locator('.name-title');
            const text = await nameTitle.textContent();

            // Should not show "Loading..."
            expect(text).not.toBe('Loading...');

            // Should show actual name
            expect(text.length).toBeGreaterThan(0);
        });

        test('Commentary should load without errors', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            // Wait for content to load
            await page.waitForSelector('#content');

            const content = await page.locator('#content');
            const html = await content.innerHTML();

            // Should not show error message
            expect(html).not.toContain('Error loading');
        });
    });

    describe('Cache Busting Tests', () => {
        test('Files should be fetched with cache-busting timestamps', async () => {
            const requests = [];

            page.on('request', request => {
                if (request.url().includes('.txt') || request.url().includes('.json')) {
                    requests.push(request.url());
                }
            });

            await page.goto(`${BASE_URL}/naamani/1/`);

            // Wait for data to load
            await page.waitForTimeout(2000);

            // Check that requests have timestamp parameters
            const hasTimestamps = requests.some(url => url.includes('?t='));
            expect(hasTimestamps).toBe(true);
        });
    });

    describe('Accessibility Tests', () => {
        test('Page should have proper title', async () => {
            await page.goto(`${BASE_URL}/`);
            const title = await page.title();
            expect(title.length).toBeGreaterThan(0);
        });

        test('Images should have alt text', async () => {
            await page.goto(`${BASE_URL}/`);

            const images = await page.locator('img');
            const count = await images.count();

            for (let i = 0; i < count; i++) {
                const img = images.nth(i);
                const alt = await img.getAttribute('alt');
                expect(alt).toBeTruthy();
            }
        });

        test('Navigation buttons should have proper labels', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const prevBtn = await page.locator('#prevBtn');
            const nextBtn = await page.locator('#nextBtn');

            expect(await prevBtn.textContent()).toBeTruthy();
            expect(await nextBtn.textContent()).toBeTruthy();
        });
    });
});
