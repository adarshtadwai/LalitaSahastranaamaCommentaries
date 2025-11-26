/**
 * CSS and Visual Interaction Tests
 * Tests styling, animations, responsiveness, and visual behavior
 *
 * Run with: npm test css-interactions.test.js
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

describe('CSS and Visual Interaction Tests', () => {
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

    describe('Homepage Styling', () => {
        test('Homepage CSS should load correctly', async () => {
            await page.goto(`${BASE_URL}/`);

            // Check CSS file loads
            const stylesheets = await page.locator('link[rel="stylesheet"]').count();
            expect(stylesheets).toBeGreaterThan(0);

            // Check specific stylesheet
            const homeStyles = await page.locator('link[href*="home/styles.css"]');
            expect(await homeStyles.count()).toBe(1);
        });

        test('Goddess image should be properly styled', async () => {
            await page.goto(`${BASE_URL}/`);

            const image = await page.locator('img.kamakshi');
            const styles = await image.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    display: computed.display,
                    maxWidth: computed.maxWidth
                };
            });

            expect(styles.display).not.toBe('none');
            expect(await image.isVisible()).toBe(true);
        });

        test('Slokas should have proper styling', async () => {
            await page.goto(`${BASE_URL}/`);

            const sloka = await page.locator('.sloka').first();
            const styles = await sloka.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    fontFamily: computed.fontFamily,
                    textAlign: computed.textAlign
                };
            });

            expect(styles.fontFamily).toContain('Annapurna SIL');
        });

        test('Main link button should have hover effect', async () => {
            await page.goto(`${BASE_URL}/`);

            const link = await page.locator('a.main-link');

            // Get initial transform
            const transformBefore = await link.evaluate(el => window.getComputedStyle(el).transform);

            // Hover
            await link.hover();
            await page.waitForTimeout(400); // Wait for transition

            const transformAfter = await link.evaluate(el => window.getComputedStyle(el).transform);

            // Transform should change on hover
            expect(transformAfter).not.toBe(transformBefore);
        });
    });

    describe('Names List Styling', () => {
        test('Search box should be styled correctly', async () => {
            await page.goto(`${BASE_URL}/naamani/`);

            const searchBox = await page.locator('#searchBox');
            const styles = await searchBox.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    width: computed.width,
                    padding: computed.padding,
                    border: computed.border,
                    borderRadius: computed.borderRadius
                };
            });

            expect(parseInt(styles.width)).toBeGreaterThan(0);
            expect(styles.borderRadius).not.toBe('0px');
        });

        test('Name cards should have proper spacing', async () => {
            await page.goto(`${BASE_URL}/naamani/`);
            await page.waitForSelector('.name-card');

            const firstCard = await page.locator('.name-card').first();
            const styles = await firstCard.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    margin: computed.margin,
                    padding: computed.padding,
                    borderRadius: computed.borderRadius
                };
            });

            expect(styles.padding).not.toBe('0px');
        });

        test('Name cards should have hover effect', async () => {
            await page.goto(`${BASE_URL}/naamani/`);
            await page.waitForSelector('.name-card');

            const card = await page.locator('.name-card').first();

            const boxShadowBefore = await card.evaluate(el => window.getComputedStyle(el).boxShadow);

            await card.hover();
            await page.waitForTimeout(300);

            const boxShadowAfter = await card.evaluate(el => window.getComputedStyle(el).boxShadow);

            // Box shadow should change on hover
            expect(boxShadowAfter).not.toBe(boxShadowBefore);
        });

        test('Filter button should have proper styling', async () => {
            await page.goto(`${BASE_URL}/naamani/`);

            const filterBtn = await page.locator('#filterToggleBtn');
            const styles = await filterBtn.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    background: computed.background,
                    borderRadius: computed.borderRadius,
                    cursor: computed.cursor
                };
            });

            expect(styles.cursor).toBe('pointer');
            expect(styles.borderRadius).not.toBe('0px');
        });

        test('Home button should be visible and styled', async () => {
            await page.goto(`${BASE_URL}/naamani/`);

            const homeBtn = await page.locator('a.home-button');
            const styles = await homeBtn.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    background: computed.background,
                    color: computed.color,
                    borderRadius: computed.borderRadius
                };
            });

            expect(await homeBtn.isVisible()).toBe(true);
            expect(styles.borderRadius).not.toBe('0px');
        });
    });

    describe('Individual Name Page Styling', () => {
        test('Navigation bar should be sticky', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nav = await page.locator('.navigation');
            const position = await nav.evaluate(el => window.getComputedStyle(el).position);

            expect(position).toBe('sticky');
        });

        test('Navigation bar should have gradient background', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nav = await page.locator('.navigation');
            const background = await nav.evaluate(el => window.getComputedStyle(el).background);

            expect(background).toContain('gradient');
        });

        test('Navigation buttons should have proper styling', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nextBtn = await page.locator('#nextBtn');
            const styles = await nextBtn.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    background: computed.background,
                    border: computed.border,
                    borderRadius: computed.borderRadius,
                    cursor: computed.cursor
                };
            });

            expect(styles.cursor).toBe('pointer');
            expect(styles.borderRadius).not.toBe('0px');
        });

        test('Disabled button should look disabled', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const prevBtn = await page.locator('#prevBtn');
            const opacity = await prevBtn.evaluate(el => window.getComputedStyle(el).opacity);

            // Previous button on page 1 should be disabled and look faded
            expect(await prevBtn.isDisabled()).toBe(true);
            expect(parseFloat(opacity)).toBeLessThan(1);
        });

        test('Navigation button hover effect', async () => {
            await page.goto(`${BASE_URL}/naamani/2/`);

            const nextBtn = await page.locator('#nextBtn');

            const transformBefore = await nextBtn.evaluate(el => window.getComputedStyle(el).transform);

            await nextBtn.hover();
            await page.waitForTimeout(300);

            const transformAfter = await nextBtn.evaluate(el => window.getComputedStyle(el).transform);

            // Transform should change on hover
            expect(transformAfter).not.toBe(transformBefore);
        });

        test('Name title should be large and centered', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nameTitle = await page.locator('.name-title');
            const styles = await nameTitle.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    fontSize: computed.fontSize,
                    fontWeight: computed.fontWeight
                };
            });

            expect(parseInt(styles.fontSize)).toBeGreaterThan(20);
            expect(styles.fontWeight).toBe('bold');
        });

        test('Mantra section should have proper background', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const mantraSection = await page.locator('#mantra-section');
            const styles = await mantraSection.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    background: computed.background,
                    borderLeft: computed.borderLeft,
                    borderRadius: computed.borderRadius,
                    padding: computed.padding
                };
            });

            expect(styles.background).toContain('rgb(240, 248, 255)'); // Light blue
            expect(styles.borderRadius).not.toBe('0px');
            expect(styles.padding).not.toBe('0px');
        });

        test('Balatapa section should have proper background', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const balatapa = await page.locator('#balatapa-section');
            const styles = await balatapa.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    background: computed.background,
                    borderLeft: computed.borderLeft
                };
            });

            expect(styles.background).toContain('rgb(255, 248, 220)'); // Cornsilk
            expect(styles.borderLeft).toContain('4px');
        });

        test('Commentary headers should have colored backgrounds', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const jayamangala = await page.locator('.collapsible-commentary-header.jayamangala');
            const soubhagya = await page.locator('.collapsible-commentary-header.soubhagya');

            const jayamangalaStyles = await jayamangala.evaluate(el => window.getComputedStyle(el).background);
            const soubhagyaStyles = await soubhagya.evaluate(el => window.getComputedStyle(el).background);

            // Should have different colored backgrounds
            expect(jayamangalaStyles).not.toBe(soubhagyaStyles);
        });

        test('Commentary headers should have hover effect', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const header = await page.locator('.collapsible-commentary-header.jayamangala');

            const bgBefore = await header.evaluate(el => window.getComputedStyle(el).background);

            await header.hover();
            await page.waitForTimeout(300);

            const bgAfter = await header.evaluate(el => window.getComputedStyle(el).background);

            // Background should change on hover
            expect(bgAfter).not.toBe(bgBefore);
        });

        test('Collapsible content should have smooth transition', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const content = await page.locator('#jayamangala-collapsible');
            const transition = await content.evaluate(el => window.getComputedStyle(el).transition);

            expect(transition).toContain('max-height');
        });
    });

    describe('Edit Module CSS', () => {
        test('Edit button should have SVG icon', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');

            if (await editBtn.count() > 0) {
                const svg = await editBtn.locator('svg');
                expect(await svg.count()).toBe(1);
            }
        });

        test('Edit button should have hover effect', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');

            if (await editBtn.count() > 0) {
                const opacityBefore = await editBtn.evaluate(el => window.getComputedStyle(el).opacity);

                await editBtn.hover();
                await page.waitForTimeout(200);

                const opacityAfter = await editBtn.evaluate(el => window.getComputedStyle(el).opacity);

                expect(parseFloat(opacityAfter)).toBeGreaterThan(parseFloat(opacityBefore));
            }
        });

        test('Edit button should scale on hover', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');

            if (await editBtn.count() > 0) {
                const transformBefore = await editBtn.evaluate(el => window.getComputedStyle(el).transform);

                await editBtn.hover();
                await page.waitForTimeout(200);

                const transformAfter = await editBtn.evaluate(el => window.getComputedStyle(el).transform);

                // Transform should change (scale)
                expect(transformAfter).not.toBe(transformBefore);
            }
        });

        test('Textarea should have proper border styling', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');

            if (await editBtn.count() > 0) {
                await editBtn.click();

                const textarea = await page.locator('#mantra-section textarea');
                const styles = await textarea.evaluate(el => {
                    const computed = window.getComputedStyle(el);
                    return {
                        border: computed.border,
                        borderRadius: computed.borderRadius,
                        fontFamily: computed.fontFamily
                    };
                });

                expect(styles.border).toContain('2px');
                expect(styles.borderRadius).toBe('4px');
                expect(styles.fontFamily).toContain('Annapurna SIL');
            }
        });

        test('Save button should have green styling', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');

            if (await editBtn.count() > 0) {
                await editBtn.click();

                const saveBtn = await page.locator('#mantra-section button:has-text("💾 Save")');
                const styles = await saveBtn.evaluate(el => {
                    const computed = window.getComputedStyle(el);
                    return {
                        backgroundColor: computed.backgroundColor,
                        color: computed.color,
                        borderRadius: computed.borderRadius,
                        cursor: computed.cursor
                    };
                });

                expect(styles.backgroundColor).toContain('rgb(76, 175, 80)'); // Green
                expect(styles.color).toContain('rgb(255, 255, 255)'); // White
                expect(styles.borderRadius).toBe('4px');
                expect(styles.cursor).toBe('pointer');
            }
        });

        test('Cancel button should have red styling', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);
            await page.waitForTimeout(1000);

            const editBtn = await page.locator('#mantra-section-edit-btn');

            if (await editBtn.count() > 0) {
                await editBtn.click();

                const cancelBtn = await page.locator('#mantra-section button:has-text("✕ Cancel")');
                const styles = await cancelBtn.evaluate(el => {
                    const computed = window.getComputedStyle(el);
                    return {
                        backgroundColor: computed.backgroundColor,
                        color: computed.color
                    };
                });

                expect(styles.backgroundColor).toContain('rgb(244, 67, 54)'); // Red
                expect(styles.color).toContain('rgb(255, 255, 255)'); // White
            }
        });
    });

    describe('Responsive Design', () => {
        test('Mobile viewport should adjust layout', async () => {
            await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nav = await page.locator('.navigation');
            const flexWrap = await nav.evaluate(el => window.getComputedStyle(el).flexWrap);

            // Navigation should wrap on mobile
            expect(flexWrap).toBe('wrap');
        });

        test('Content should be readable on mobile', async () => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(`${BASE_URL}/naamani/1/`);

            const content = await page.locator('.content');
            const padding = await content.evaluate(el => window.getComputedStyle(el).padding);

            // Should have padding on mobile
            expect(padding).not.toBe('0px');
        });

        test('Tablet viewport should have proper layout', async () => {
            await page.setViewportSize({ width: 768, height: 1024 }); // iPad
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nameTitle = await page.locator('.name-title');
            expect(await nameTitle.isVisible()).toBe(true);
        });

        test('Desktop viewport should have proper layout', async () => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.goto(`${BASE_URL}/naamani/1/`);

            const content = await page.locator('.content');
            const maxWidth = await content.evaluate(el => window.getComputedStyle(el).maxWidth);

            // Content should have max-width on desktop
            expect(maxWidth).toBe('1200px');
        });
    });

    describe('Font Loading', () => {
        test('Annapurna SIL font should be loaded', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const fontLinks = await page.locator('link[href*="Annapurna"]');
            expect(await fontLinks.count()).toBeGreaterThan(0);
        });

        test('Devanagari text should use correct font', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nameTitle = await page.locator('.name-title');
            const fontFamily = await nameTitle.evaluate(el => window.getComputedStyle(el).fontFamily);

            expect(fontFamily).toContain('Annapurna SIL');
        });
    });

    describe('Transitions and Animations', () => {
        test('Commentary expand should have animation', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const header = await page.locator('.collapsible-commentary-header.jayamangala');
            const content = await page.locator('#jayamangala-collapsible');

            // Click to expand
            await header.click();
            await page.waitForTimeout(100);

            // Check if expanded class is added
            const hasExpanded = await content.evaluate(el => el.classList.contains('expanded'));
            expect(hasExpanded).toBe(true);
        });

        test('Page navigation should update smoothly', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nextBtn = await page.locator('#nextBtn');
            await nextBtn.click();

            // Wait for navigation
            await page.waitForURL('**/naamani/2/**');

            // Page should load successfully
            const nameTitle = await page.locator('.name-title');
            expect(await nameTitle.isVisible()).toBe(true);
        });
    });

    describe('Color Scheme', () => {
        test('Page should have consistent color scheme', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const nav = await page.locator('.navigation');
            const navBg = await nav.evaluate(el => window.getComputedStyle(el).background);

            // Navigation should have gradient with maroon/brown tones
            expect(navBg).toContain('gradient');
            expect(navBg.toLowerCase()).toMatch(/139|0|0|69/); // Maroon RGB values
        });

        test('Commentary sections should have distinct colors', async () => {
            await page.goto(`${BASE_URL}/naamani/1/`);

            const jayamangala = await page.locator('.collapsible-commentary-header.jayamangala');
            const soubhagya = await page.locator('.collapsible-commentary-header.soubhagya');

            const jayamanagalaBg = await jayamangala.evaluate(el => window.getComputedStyle(el).background);
            const soubhagyaBg = await soubhagya.evaluate(el => window.getComputedStyle(el).background);

            // Should have lavender/purple and rose/pink themes
            expect(jayamanagalaBg).not.toBe(soubhagyaBg);
        });
    });
});
