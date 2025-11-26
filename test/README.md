# Lalita Sahasranama Website Tests

Automated tests for the Lalita Sahasranama website to ensure navigation, data loading, editing functionality, CSS styling, and user interactions work correctly.

## Test Files

### 1. `navigation.test.js` - Navigation & Routing Tests
Tests URL structure, page navigation, and data loading.

### 2. `edit-module.test.js` - Edit Feature Tests
Tests inline editing functionality for mantras, balatapa, and commentaries.

### 3. `css-interactions.test.js` - CSS & Visual Tests
Tests styling, hover effects, animations, and responsive design.

## Comprehensive Test Coverage

### Navigation Tests (`navigation.test.js`)
- ✅ Homepage loads correctly at `/`
- ✅ Names list accessible at `/naamani/`
- ✅ Individual name pages load at `/naamani/1/`, etc.
- ✅ Home button navigation works
- ✅ Previous/Next button navigation
- ✅ Keyboard arrow key navigation (Left/Right)
- ✅ No unnecessary redirects
- ✅ Relative paths work correctly
- ✅ URL structure is clean and consistent

### Data Loading Tests (`navigation.test.js`)
- ✅ All 1000 names load in the list
- ✅ Name data loads for individual pages
- ✅ Mantra content displays correctly
- ✅ Balatapa commentary displays
- ✅ Full commentaries (Jayamangala, Soubhagya) load
- ✅ Sanskrit numerals display (०-९)
- ✅ No loading errors

### Edit Module Tests (`edit-module.test.js`)
**Prerequisites:** Edit server must be running on `http://localhost:3000`

- ✅ Edit server health check
- ✅ Edit module initializes correctly
- ✅ Edit buttons appear on right side of sections
- ✅ Edit buttons have proper positioning (absolute, right: 10px)
- ✅ Edit buttons have hover effects (opacity + scale)
- ✅ Mantra editing opens textarea (2 rows)
- ✅ Balatapa editing opens textarea (3 rows)
- ✅ Commentary editing opens textarea (15 rows)
- ✅ Commentary auto-expands when editing
- ✅ Save and Cancel buttons appear
- ✅ Cancel button restores original content
- ✅ Arrow keys in textarea don't navigate pages
- ✅ Multiple sections can be edited independently
- ✅ Cannot edit same section twice
- ✅ Textarea loads existing content
- ✅ Devanagari text input supported
- ✅ Annapurna SIL font used in textareas
- ✅ Save button has green styling
- ✅ Cancel button has red styling
- ✅ Button hover effects work

### CSS & Visual Tests (`css-interactions.test.js`)

#### Homepage Styling
- ✅ CSS files load correctly (`home/styles.css`)
- ✅ Goddess image properly styled
- ✅ Slokas have Annapurna SIL font
- ✅ Main link button hover transform effect

#### Names List Styling
- ✅ Search box styled with border radius
- ✅ Name cards have proper spacing
- ✅ Name cards have hover shadow effect
- ✅ Filter button properly styled
- ✅ Home button visible and styled

#### Individual Name Page Styling
- ✅ Navigation bar is sticky
- ✅ Navigation has gradient background
- ✅ Navigation buttons properly styled
- ✅ Disabled buttons look faded
- ✅ Button hover effects (transform)
- ✅ Name title is large and bold
- ✅ Mantra section has light blue background
- ✅ Balatapa section has cornsilk background
- ✅ Commentary headers have colored backgrounds
  - जयमङ्गला: Light lavender/purple
  - सौभाग्यभास्कर: Light rose/pink
- ✅ Commentary headers have hover effects
- ✅ Collapsible content has smooth transitions

#### Edit Module Styling
- ✅ Edit button SVG icon renders
- ✅ Edit button hover opacity increase
- ✅ Edit button hover scale transform
- ✅ Textarea has 2px border, 4px radius
- ✅ Textarea uses Annapurna SIL font
- ✅ Save button green (#4CAF50) with white text
- ✅ Cancel button red (#f44336) with white text
- ✅ Buttons have 4px border radius

#### Responsive Design
- ✅ Mobile layout (375px - iPhone SE)
- ✅ Tablet layout (768px - iPad)
- ✅ Desktop layout (1920px)
- ✅ Navigation wraps on mobile
- ✅ Content has max-width (1200px) on desktop

#### Font Loading
- ✅ Annapurna SIL font loads
- ✅ Devanagari text uses correct font

#### Transitions & Animations
- ✅ Commentary expand/collapse animation
- ✅ Button hover transitions
- ✅ Page navigation smoothness

#### Color Scheme
- ✅ Maroon/brown navigation gradient
- ✅ Consistent color palette
- ✅ Distinct commentary section colors

### Performance Tests (`navigation.test.js`)
- ✅ Cache-busting for data files (timestamp parameters)
- ✅ No redundant requests

### Accessibility Tests (`navigation.test.js`)
- ✅ Proper page titles
- ✅ Image alt text
- ✅ Button labels

## Setup

### 1. Install Dependencies

```bash
cd test
npm install
```

### 2. Start Local Server

In another terminal, start the website:

```bash
cd ..
python3 -m http.server 8000
```

### 3. Run Tests

```bash
npm test
```

## How to Run Tests

### Quick Start (All Tests)

```bash
# 1. Install dependencies (one-time setup)
cd test
npm install

# 2. Start website server (in separate terminal)
cd ..
python3 -m http.server 8000

# 3. Run all tests
cd test
npm test
```

### Running Edit Module Tests

Edit module tests require the edit server to be running:

```bash
# Terminal 1: Website server
python3 -m http.server 8000

# Terminal 2: Edit server
node editor/server.js

# Terminal 3: Run edit tests
cd test
npx jest edit-module.test.js
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm test:watch

# Run tests with coverage report
npm test:coverage

# Run specific test file
npx jest navigation.test.js           # Navigation tests only
npx jest edit-module.test.js          # Edit feature tests only
npx jest css-interactions.test.js     # CSS tests only

# Run tests matching a pattern
npx jest --testNamePattern="Homepage"      # Only homepage tests
npx jest --testNamePattern="Edit"          # Only edit-related tests
npx jest --testNamePattern="CSS"           # Only CSS tests

# Run tests in a specific file matching pattern
npx jest navigation.test.js --testNamePattern="Navigation"

# Run with verbose output
npx jest --verbose

# Run in headful mode (see browser)
HEADLESS=false npx jest navigation.test.js
```

## Environment Variables

```bash
# Test against different URL (default: http://localhost:8000)
BASE_URL=https://adarshtadwai.github.io/LalitaSahastranaamaCommentaries npm test

# Test edit server on different port (default: http://localhost:3000)
EDIT_SERVER_URL=http://localhost:3001 npx jest edit-module.test.js

# Run browser in headful mode (see what's happening)
HEADLESS=false npm test

# Run with specific browser
BROWSER=firefox npm test
```

## Test Infrastructure

### Technology Stack

- **Test Framework**: Jest (test runner and assertions)
- **Browser Automation**: Playwright (cross-browser testing)
- **Languages**: JavaScript (ES6+)

### Architecture

```
test/
├── navigation.test.js       # 50+ tests for routing and data loading
├── edit-module.test.js      # 40+ tests for edit functionality
├── css-interactions.test.js # 60+ tests for styling and interactions
├── package.json             # Dependencies and scripts
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Test setup and custom matchers
└── README.md                # This file
```

### Dependencies

```json
{
  "@playwright/test": "^1.40.0",    // Browser automation
  "jest": "^29.7.0",                // Test framework
  "jest-playwright-preset": "^4.0.0", // Jest + Playwright integration
  "playwright": "^1.40.0"           // Core Playwright library
}
```

### How Tests Work

1. **Test File**: Jest finds all `*.test.js` files
2. **Browser Launch**: Playwright launches Chromium (or configured browser)
3. **Page Navigation**: Tests navigate to URLs using `page.goto()`
4. **Element Selection**: Tests find elements using `page.locator()`
5. **Assertions**: Tests verify behavior using `expect()` assertions
6. **Cleanup**: Browser closes after tests complete

### Example Test Breakdown

```javascript
describe('Feature Name', () => {           // Test suite
    let browser, page;

    beforeAll(async () => {                // Runs once before all tests
        browser = await chromium.launch();
    });

    beforeEach(async () => {               // Runs before each test
        page = await browser.newPage();
    });

    test('should do something', async () => { // Individual test
        // 1. Navigate to page
        await page.goto(`${BASE_URL}/naamani/1/`);

        // 2. Find element
        const button = await page.locator('#nextBtn');

        // 3. Perform action
        await button.click();

        // 4. Verify result
        expect(page.url()).toContain('/naamani/2/');
    });

    afterEach(async () => {                // Runs after each test
        await page.close();
    });

    afterAll(async () => {                 // Runs once after all tests
        await browser.close();
    });
});
```

## Adding New Tests

### Example Test

```javascript
test('Description of what you're testing', async () => {
    await page.goto(`${BASE_URL}/naamani/1/`);

    // Find element
    const element = await page.locator('#element-id');

    // Assert expectations
    expect(await element.isVisible()).toBe(true);
});
```

### Test Structure

```javascript
describe('Feature Name', () => {
    test('should do something', async () => {
        // Arrange - set up test data

        // Act - perform action

        // Assert - verify result
    });
});
```

## Continuous Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd test
          npm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Start server
        run: python3 -m http.server 8000 &

      - name: Run tests
        run: |
          cd test
          npm test
```

## Troubleshooting

**Tests fail with "page.goto: net::ERR_CONNECTION_REFUSED"**
- Make sure the local server is running: `python3 -m http.server 8000`

**Tests timeout**
- Increase timeout in `jest.config.js`: `testTimeout: 60000`

**Playwright browser not found**
- Install browsers: `npx playwright install`

**Tests pass locally but fail in CI**
- Check that the BASE_URL is set correctly
- Ensure server is started before running tests
- Install Playwright with dependencies: `npx playwright install --with-deps`
