# Kumparan Web Application - Comprehensive QA Automation Test Plan

## 1. Executive Summary & Review Notes

* **AUT (Application Under Test):** Kumparan (`https://kumparan.com`)
* **Document Version:** 2.0 (Senior QA Engineer Comprehensive Revision)
* **Target File:** `specs/kumparan-test-plan.md`
* **Exploration Methodology:** Live DOM inspection & accessibility analysis via Playwright MCP in Chromium.
* **Core Architectural Principles:**
  - Strict adherence to `AGENTS.md` and project instructions (`agent-instructions/locator-strategy.md`, `agent-instructions/testing-guidelines.md`, `agent-instructions/coding-standards.md`).
  - Priority on verified, instrumented `data-qa-id` attributes (>200 detected in AUT).
  - Complete elimination of hardcoded live news headlines or ephemeral content.
  - Granular, independent tests following Arrange, Act, Assert (AAA).
  - Explicit demarcation between live-verified behavior and assumptions requiring human/QA lead confirmation.

---

## 2. Core Locator Architecture Reference

| Component | Target Element | Primary Locator (`data-qa-id` / Primary Attribute) | Semantic & Accessible Fallback Locator | Notes on DOM Grounding & Suitability |
| :--- | :--- | :--- | :--- | :--- |
| **Global Header** | Brand Logo (Homepage) | `a[data-qa-id="hd-logo"]` | `page.getByRole('link', { name: 'Kumparan Logo' })` | Grounded on `/`. On inner article pages, `hd-logo` is a non-link `div` (`kumparanNEWS`); use `hd-home` for navigation. |
| **Global Header** | Home Navigation Link | `a[data-qa-id="hd-home"]` | `page.getByRole('link').filter({ has: page.getByAltText('home') })` | Grounded across all pages (`href="/"`, containing `img[alt="home"]`). Reliable universal home link. |
| **Global Header** | Search Input Field | `input[data-qa-id="input-search"]` | `page.getByPlaceholder('Cari di sini...')` | Grounded. Primary locator uniquely matches the search text input. |
| **Global Header** | Theme Switcher Button | `button[data-qa-id="hd-theme"]` | `page.getByRole('button').filter({ has: page.locator('img[alt="moon"], img[alt="sun"]') })` | Grounded. Contains dynamic SVG/img reflecting current theme mode. |
| **Global Header** | Login Trigger ("Masuk")| `button[data-qa-id="hd-login"]` | `page.getByRole('button', { name: 'Masuk', exact: true })` | Grounded. Navigates unauthenticated sessions to `/login`. |
| **Main Navigation**| Category Menu Container | `nav[data-qa-id="main-menu"]` | `page.getByRole('navigation', { name: 'headermain menu' })` | Grounded. Accessible fallback relies on `aria-label="headermain menu"`. |
| **Main Navigation**| Tekno Channel Link | `nav[data-qa-id="main-menu"] a[href="/channel/tekno"]` | `page.getByRole('navigation', { name: 'headermain menu' }).getByRole('link', { name: 'Tekno', exact: true })` | Grounded. Exact name matching avoids collision with sub-topic links. |
| **Feed Cards** | Article Link Card | `a[aria-label="news-card-label-link"]` *(ARIA Locator)* | `page.getByLabel('news-card-label-link')` | **Note:** Grounded in DOM via `aria-label`, not `data-qa-id`. Multiple instances exist on homepage feed; index or filter by title. |
| **Article Detail** | Story Headline | `h1[data-qa-id="story-title"]` | `page.getByRole('heading', { level: 1 })` | Grounded on article view. Accessible fallback matches the single main article `h1`. |
| **Article Detail** | Publisher / Author Name| `span[data-qa-id="author-name"]` | `page.locator('header span[data-qa-id="author-name"]')` | Grounded. Unsuitable for generic `getByRole` since it is a plain `span`; scoped header locator is required. |
| **Article Detail** | Published Timestamp | `time[data-qa-id="publish-date"]`| `page.locator('time')` | Grounded. `<time>` semantic HTML tag matches standard editorial articles. |
| **Article Detail** | Reading Time Estimate | `span[data-qa-id="reading-time"]`| `page.getByText(/waktu baca/i)` | Grounded on standard editorial stories; may be absent on video/photo galleries. |
| **Article Detail** | Story Paragraph | `p[data-qa-id="story-paragraph"]` | `page.locator('p[data-qa-id="story-paragraph"]')` | Grounded. Multiple paragraph instances represent the editorial article body. |
| **Article Detail** | Breadcrumb: Home | `a[data-qa-id="home-breadcrumb"]`| `page.getByRole('link', { name: 'Beranda' })` | Grounded. Points to `/` with accessible name `"Beranda"`. |
| **Article Detail** | Breadcrumb: Channel | `a[data-qa-id="channel-name"]` | `page.locator('a[data-qa-id="channel-name"]')` | Grounded. Contains channel name text and links to `/channel/<name>`. |
| **Article Detail** | Like Engagement Button | `button[data-qa-id="btn-like"]` | `page.locator('button[data-qa-id="btn-like"]')` | Grounded. Contains like count and SVG icon. |
| **Article Detail** | Comment Link Button | `a[data-qa-id="btn-comment"]` | `page.locator('a[data-qa-id="btn-comment"]')` | Grounded. Links to response/comment thread. |
| **Search Page** | Search Results Title | `h1` | `page.getByRole('heading', { level: 1, name: 'Hasil Pencarian' })` | Grounded on `/search/<query>`. Heading 1 displays `"Hasil Pencarian"`. |
| **Login Form** | Email Field | `input[data-qa-id="input-email"]` | `page.getByRole('textbox', { name: 'Email' })` | Grounded. Attribute `placeholder="Email"`, `name="email"`. |
| **Login Form** | Password Field | `input[data-qa-id="input-password"]` | `page.getByPlaceholder('Password')` | Grounded. Attribute `placeholder="Password"`, `type="password"`. |
| **Login Form** | Submit Button | `button[data-qa-id="btn-save"]` | `page.getByRole('button', { name: 'Masuk', exact: true })` | Grounded. Button labeled `"Masuk"` inside the login container. |

---

## 3. Test Cases Specification

### Suite 1: Homepage & Feed Verification

#### `TC-HOME-001`: Verify Homepage Initial Load and Core Components
* **Test Case ID:** `TC-HOME-001`
* **Preconditions:** Browser has no active session; network connection is stable.
* **Test Steps:**
  1. Navigate to `https://kumparan.com/`.
  2. Verify document title.
  3. Verify visibility of brand logo `a[data-qa-id="hd-logo"]`.
  4. Verify visibility of primary channel menu `nav[data-qa-id="main-menu"]`.
  5. Verify visibility of search bar `input[data-qa-id="input-search"]`.
* **Test Data:** URL: `https://kumparan.com/`
* **Expected Result:**
  - Page title matches regex `/kumparan\.com - Bicara Fakta Lewat Berita/`.
  - Brand logo, channel navigation, and search input are visible in the DOM.
* **Priority:** Critical
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Observed on initial navigation (`page.goto('https://kumparan.com/')`).

#### `TC-HOME-002`: Verify News Feed Article Cards Rendering
* **Test Case ID:** `TC-HOME-002`
* **Preconditions:** User is on Kumparan homepage (`https://kumparan.com/`).
* **Test Steps:**
  1. Locate all feed article cards matching `a[aria-label="news-card-label-link"]`.
  2. Count rendered article cards in the primary viewport feed.
  3. Verify that the first card has a valid non-empty `href` matching the two-segment article URL pattern: `/^\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+-[0-9a-zA-Z]{11}$/`.
  4. Verify that the card contains readable text content (headline).
* **Test Data:** N/A (Dynamic feed items)
* **Expected Result:**
  - Count of rendered cards is greater than zero (typically $\ge 10$ cards on desktop viewport).
  - First card contains an article URL matching the two-path segment structure: `/<channel-or-section>/<article-slug>-<articleId>` (e.g., `/kumparannews/polda-metro-jaya-...-28XpN107B7J`), where `<articleId>` is an exact 11-character alphanumeric identifier.
* **Priority:** Critical
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live MCP DOM query revealed 20 article cards on the homepage with `aria-label="news-card-label-link"`, each adhering to the two-segment channel and 11-character ID path convention.

---

### Suite 2: Channel Navigation

#### `TC-NAV-001`: Navigate from Homepage to Specific Channel Feed
* **Test Case ID:** `TC-NAV-001`
* **Preconditions:** User is on Kumparan homepage.
* **Test Steps:**
  1. Locate `nav[data-qa-id="main-menu"]`.
  2. Click the `"Tekno"` channel link (`nav[data-qa-id="main-menu"] a[href="/channel/tekno"]`).
  3. Wait for URL transition.
  4. Verify page heading `h1`.
  5. Verify page title.
* **Test Data:** Channel: `"Tekno"`, Expected Path: `"/channel/tekno"`
* **Expected Result:**
  - URL updates to `https://kumparan.com/channel/tekno`.
  - Page heading `h1` renders text `"Tekno"`.
  - Page title matches `/Teknologi.*kumparan/i`.
* **Priority:** High
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live click on `a[href="/channel/tekno"]` changed URL to `/channel/tekno` and rendered `h1` `"Tekno"`.

---

### Suite 3: Article Navigation & Detail Inspection

#### `TC-ART-001`: Open Article from Feed and Validate Dynamic Metadata
* **Test Case ID:** `TC-ART-001`
* **Preconditions:** User is on Kumparan homepage with loaded news feed. The target article must be a standard text/news editorial story (e.g. from kumparanNEWS or channel feeds). *Note: Alternative content formats such as Video Stories (`/video-story`), Photo Galleries (`Galeri Foto`), or short multimedia posts do not expose identical metadata structures and are excluded from this specific test.*
* **Test Steps:**
  1. Locate the first standard news article card matching `a[aria-label="news-card-label-link"]`.
  2. Dynamically extract the headline text and expected destination URL.
  3. Click the article card.
  4. Verify URL navigates to the expected story URL.
  5. Verify core universal metadata:
     - Article heading `h1[data-qa-id="story-title"]` is visible and non-empty.
     - Author/publisher badge `span[data-qa-id="author-name"]` is displayed.
  6. Verify editorial content fields (for standard editorial articles):
     - Published timestamp `time[data-qa-id="publish-date"]` is displayed.
     - At least one story paragraph `p[data-qa-id="story-paragraph"]` is rendered.
  7. Verify reading time `span[data-qa-id="reading-time"]` conditionally if present for text-based articles (text matches `/waktu baca/i`).
* **Test Data:** Dynamic (extracted from target card at runtime; no hardcoded news text).
* **Expected Result:**
  - URL matches pattern `https://kumparan.com/<channel>/<slug>-<articleId>`.
  - Core metadata (headline `h1`, author badge) loads universally.
  - Standard editorial fields (`time[data-qa-id="publish-date"]` and body `p[data-qa-id="story-paragraph"]`) load successfully on standard text articles without assuming uniform presence across non-text content formats.
* **Priority:** Critical
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live MCP navigation verified all metadata fields exist on standard editorial news articles, while video/gallery formats exhibit alternate layouts.

#### `TC-ART-002`: Breadcrumb Navigation from Article to Channel Feed
* **Test Case ID:** `TC-ART-002`
* **Preconditions:** User is currently on an article detail page (e.g., `/kumparannews/...`).
* **Test Steps:**
  1. Locate the channel breadcrumb link: `a[data-qa-id="channel-name"]`.
  2. Extract expected channel name (e.g., `"News"`).
  3. Click `a[data-qa-id="channel-name"]`.
  4. Verify URL transitions to `/channel/<channelName>`.
* **Test Data:** Dynamic based on loaded article.
* **Expected Result:**
  - URL navigates cleanly to the corresponding `/channel/<name>`.
  - Target channel page heading matches clicked breadcrumb text.
* **Priority:** Medium
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Inspected element: `a[data-qa-id="channel-name"]` with `href="/channel/news"` and text `"News"`.

#### `TC-ART-003`: Breadcrumb Navigation from Article to Homepage
* **Test Case ID:** `TC-ART-003`
* **Preconditions:** User is currently on an article detail page.
* **Test Steps:**
  1. Locate breadcrumb homepage link: `a[data-qa-id="home-breadcrumb"]` (displaying `"Beranda"`).
  2. Click `a[data-qa-id="home-breadcrumb"]`.
  3. Verify URL returns to `https://kumparan.com/`.
* **Test Data:** Expected URL: `https://kumparan.com/`
* **Expected Result:**
  - URL updates to `https://kumparan.com/`.
  - Homepage brand logo `a[data-qa-id="hd-logo"]` is visible.
* **Priority:** Medium
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live click on `a[data-qa-id="home-breadcrumb"]` directly returned browser session to `https://kumparan.com/`.

---

### Suite 4: Search Engine

#### `TC-SRCH-001`: Search with Valid Query Yields Relevant Result Cards
* **Test Case ID:** `TC-SRCH-001`
* **Preconditions:** User is on Kumparan homepage.
* **Test Steps:**
  1. Fill `input[data-qa-id="input-search"]` with `"teknologi"`.
  2. Press `Enter`.
  3. Verify URL changes to `https://kumparan.com/search/teknologi`.
  4. Verify heading `h1` contains `"Hasil Pencarian"`.
  5. Verify tab list contains `"Konten"`, `"Video Story"`, `"kumparanPLUS"`, `"Topik"`.
  6. Verify at least one result card is rendered in the result container.
* **Test Data:** Search Query: `"teknologi"`
* **Expected Result:**
  - URL transitions to `/search/teknologi`.
  - Filter tabs and result items are visible and populated.
* **Priority:** High
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live query `"teknologi"` resulted in URL `/search/teknologi`, heading `Hasil Pencarian`, and 22 result cards.

#### `TC-SRCH-002`: Search with Unmatched Query Displays Observed Empty State
* **Test Case ID:** `TC-SRCH-002`
* **Preconditions:** User is on Kumparan homepage.
* **Test Steps:**
  1. Fill `input[data-qa-id="input-search"]` with non-existent keyword `"xyz999nonexistentquery123"`.
  2. Press `Enter`.
  3. Verify URL changes to `https://kumparan.com/search/xyz999nonexistentquery123`.
  4. Verify presence of empty state feedback.
  5. Verify exact observed text messages:
     - Primary headline: `"Story tidak ditemukan"`
     - Sub-headline: `"Sudah benarkah story yang dicari?"`
* **Test Data:** Search Query: `"xyz999nonexistentquery123"`
* **Expected Result:**
  - Search page loads with zero result cards.
  - Container displays verified Indonesian empty-state strings without throwing application errors.
* **Priority:** Medium
* **Test Type:** Negative
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Verified live via Playwright MCP DOM query on `/search/xyz999nonexistentquery123`.

#### `TC-SRCH-003`: Clicking Search Input from Homepage Navigates to Search Landing
* **Test Case ID:** `TC-SRCH-003`
* **Preconditions:** User is on Kumparan homepage.
* **Test Steps:**
  1. Click `input[data-qa-id="input-search"]` without typing.
  2. Verify URL transition.
  3. Verify search landing page renders.
* **Test Data:** N/A
* **Expected Result:**
  - URL navigates to `https://kumparan.com/search`.
  - Page renders heading `"Pencarian"` and popular search topics section (`"Pencarian populer"`).
* **Priority:** Medium
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live click on `input[data-qa-id="input-search"]` redirected browser to `https://kumparan.com/search` with popular query pills.

#### `TC-SRCH-004`: Whitespace Query Encodes and Fallbacks to Default Feed
* **Test Case ID:** `TC-SRCH-004`
* **Preconditions:** User is on Kumparan homepage.
* **Test Steps:**
  1. Fill `input[data-qa-id="input-search"]` with 3 whitespace characters `"   "`.
  2. Press `Enter`.
  3. Inspect destination URL and rendered DOM.
* **Test Data:** Query: `"   "` (three spaces)
* **Expected Result:**
  - **Observed Behavior:** Browser navigates to `https://kumparan.com/search/%20%20%20`; backend treats whitespace as an unconstrained query and renders default trending content cards (`cardsCount: 39`) under `"Relevansi"` / `"Terbaru"` rather than the empty state.
  - **Pending Product Confirmation:** Expected business outcome is pending product/design confirmation on whether whitespace-only queries should be trimmed/rejected or allowed to return trending articles.
* **Priority:** Low
* **Test Type:** Boundary
* **Automation Feasibility:** **Pending Product Confirmation** *(Documented for tracking; not approved for automated regression until business rule is officially confirmed).*
* **Evidence / Observation:** Re-exploration confirmed `cardsCount: 39`, URL `/search/%20%20%20`, and `hasEmptyMessage: false`.

---

### Suite 5: Theme Personalization (Dark & Light Mode)

#### `TC-THM-001`: Switch Theme from Initial Light Mode to Dark Mode
* **Test Case ID:** `TC-THM-001`
* **Preconditions:** Fresh isolated browser context starting at `about:blank`.
* **Test Steps:**
  1. **Arrange:** Register initialization script via `await page.addInitScript(() => { localStorage.setItem('theme', 'light'); });` to safely set storage prior to document scripts executing, avoiding `about:blank` storage access exceptions.
  2. Navigate to `https://kumparan.com/`.
  3. Verify baseline state: `button[data-qa-id="hd-theme"]` contains `img[alt="moon"]` and `localStorage.getItem('theme') === 'light'`.
  4. **Act:** Click `button[data-qa-id="hd-theme"]`.
  5. **Assert:** Verify `localStorage.getItem('theme')` updates to `'dark'`.
  6. **Assert:** Verify button icon changes to `img[alt="sun"]`.
* **Test Data:** N/A
* **Expected Result:**
  - Storage value `'dark'` is written to `localStorage`.
  - Icon visual cue changes from moon to sun.
* **Priority:** Medium
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live toggle verified: transition from light mode sets localStorage `'dark'` and icon `alt="sun"`.

#### `TC-THM-002`: Switch Theme from Dark Mode back to Light Mode
* **Test Case ID:** `TC-THM-002`
* **Preconditions:** Fresh isolated browser context starting at `about:blank`. Independent of previous tests.
* **Test Steps:**
  1. **Arrange:** Register initialization script via `await page.addInitScript(() => { localStorage.setItem('theme', 'dark'); });` to deterministically launch the session directly in dark mode, avoiding any cross-test dependencies.
  2. Navigate to `https://kumparan.com/`.
  3. Verify baseline state: `button[data-qa-id="hd-theme"]` contains `img[alt="sun"]` and `localStorage.getItem('theme') === 'dark'`.
  4. **Act:** Click `button[data-qa-id="hd-theme"]`.
  5. **Assert:** Verify `localStorage.getItem('theme')` updates to `'light'`.
  6. **Assert:** Verify button icon reverts to `img[alt="moon"]`.
* **Test Data:** N/A
* **Expected Result:**
  - Theme state cleanly updates to light mode in `localStorage`.
  - Icon visual cue reverts from sun to moon.
* **Priority:** Medium
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live toggle verified: clicking while in dark mode sets localStorage `'light'` and icon `alt="moon"`.

#### `TC-THM-003`: Theme Preference Persistence Across Page Reload
* **Test Case ID:** `TC-THM-003`
* **Preconditions:** Fresh isolated browser context starting at `about:blank`. Independent of previous tests.
* **Test Steps:**
  1. **Arrange:** Register initialization script via `await page.addInitScript(() => { localStorage.setItem('theme', 'dark'); });` and navigate to `https://kumparan.com/`.
  2. Verify initial session loaded in dark mode (icon is `img[alt="sun"]` and `localStorage.getItem('theme') === 'dark'`).
  3. **Act:** Reload page via `await page.reload()`.
  4. **Assert:** Verify `localStorage.getItem('theme')` remains `'dark'`.
  5. **Assert:** Verify button icon remains `img[alt="sun"]` after reload.
* **Test Data:** N/A
* **Expected Result:**
  - Theme preference persists through full page reload without reverting to default.
* **Priority:** Medium
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live verification confirmed persistence of `'dark'` key in browser storage after reload.

---

### Suite 6: Authentication Scope & Form Validation

#### `TC-AUTH-001`: Navigate to Login Page from Header Trigger
* **Test Case ID:** `TC-AUTH-001`
* **Preconditions:** User is unauthenticated on Kumparan homepage.
* **Test Steps:**
  1. Locate header login button `button[data-qa-id="hd-login"]` ("Masuk").
  2. Click `button[data-qa-id="hd-login"]`.
  3. Verify URL navigation.
  4. Verify visibility of login form container, email input, password input, and submit button.
* **Test Data:** N/A
* **Expected Result:**
  - URL updates to `https://kumparan.com/login`.
  - Elements `input[data-qa-id="input-email"]`, `input[data-qa-id="input-password"]`, and `button[data-qa-id="btn-save"]` are visible.
* **Priority:** High
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Live click on `[data-qa-id="hd-login"]` navigated directly to `https://kumparan.com/login`.

#### `TC-AUTH-002`: Submit Empty Credentials on Login Form
* **Test Case ID:** `TC-AUTH-002`
* **Preconditions:** User is on `https://kumparan.com/login`.
* **Test Steps:**
  1. Ensure `input[data-qa-id="input-email"]` and `input[data-qa-id="input-password"]` are empty.
  2. Click submit button `button[data-qa-id="btn-save"]`.
  3. Inspect page URL, DOM attributes, and native constraint validation states.
* **Test Data:** Email: `""`, Password: `""`
* **Expected Result:**
  - **Actual Observable Behavior:** Form submission is blocked; browser URL remains `https://kumparan.com/login` without redirection (`await expect(page).toHaveURL(/login/)`) and no authenticated session is created.
  - **Native Validation Limitation:** DOM inspection confirmed that the input fields do not have the HTML `required` attribute, `validity.valid` evaluates to `true`, and `:invalid` does not match. Because no native HTML5 constraint attributes or inline error messages exist in the DOM, reliable assertions are limited strictly to URL stability and absence of session cookies.
  - **Pending Human / Product Confirmation:** Specific field-level error messages (e.g., inline text, toast notifications, or invalid input border states) are not currently exposed in the DOM upon submission. Expected visual error cues are explicitly marked as requiring confirmation from Product/Engineering.
* **Priority:** High
* **Test Type:** Negative
* **Automation Feasibility:** Partially automatable *(URL non-navigation assertion is automatable immediately; field-level validation messages/attributes are not present in DOM and require product confirmation).*
* **Evidence / Observation:** Live MCP DOM evaluation confirmed `hasAttribute('required') === false`, `validity.valid === true`, and `:invalid === false`. Clicking `btn-save` with empty inputs does not trigger navigation or session creation, but injects no observable text error in the DOM.

#### `TC-AUTH-003`: Toggle Password Input Visibility
* **Test Case ID:** `TC-AUTH-003`
* **Preconditions:** User is on `https://kumparan.com/login`.
* **Test Steps:**
  1. Enter test password `"TestSecret123!"` into `input[data-qa-id="input-password"]`.
  2. Verify input attribute `type="password"`.
  3. Locate eye toggle button adjacent to password field and click.
  4. Verify input attribute `type` changes to `"text"`.
  5. Click eye toggle button again.
  6. Verify input attribute `type` reverts to `"password"`.
* **Test Data:** Password text: `"TestSecret123!"`
* **Expected Result:**
  - Input field attribute dynamically toggles between `"password"` (masked) and `"text"` (revealed).
* **Priority:** Low
* **Test Type:** Positive
* **Automation Feasibility:** Fully automatable
* **Evidence / Observation:** Inspected element: button containing `img[alt="eye"]` inside the password container.

#### `TC-AUTH-004`: Full User Login Submission with Credentials
* **Test Case ID:** `TC-AUTH-004`
* **Preconditions:** Valid test credentials available; test environment bypass or mock configured for Cloudflare Turnstile.
* **Test Steps:**
  1. Navigate to `/login`.
  2. Enter valid email and password.
  3. Solve or bypass Turnstile token.
  4. Click `button[data-qa-id="btn-save"]`.
  5. Verify successful authentication redirect to homepage or user profile.
* **Test Data:** Valid QA test account credentials.
* **Expected Result:**
  - User session is established and authenticated header shows user avatar.
* **Priority:** Critical
* **Test Type:** Positive
* **Automation Feasibility:** Blocked in production *(Cloudflare Turnstile token input name="cf-turnstile-response" active on live site; anti-bot challenge cannot be bypassed without authorized staging bypass or pre-authenticated session fixture).*
* **Evidence / Observation:** DOM evaluation revealed active Turnstile iframe widget and hidden input.

---

## 4. Automation Strategy & Execution Feasibility Summary

```
Total Test Cases: 17
├── By Scenario Type:
│   ├── Positive Scenarios: 14 (82.4%)
│   ├── Negative Scenarios:  2 (11.8%)
│   └── Boundary Scenarios:  1  (5.8%)
│   Total = 14 + 2 + 1 = 17
│
└── By Automation Status:
    ├── Fully automatable:            14 (82.4%)
    ├── Partially automatable:         1  (5.9%) [TC-AUTH-002]
    ├── Pending product confirmation:  1  (5.9%) [TC-SRCH-004]
    └── Blocked in production:         1  (5.9%) [TC-AUTH-004]
    Total = 14 + 1 + 1 + 1 = 17
```

### Detailed Breakdown:
* **Scenario Type Distribution (17 total):**
  * **Positive (14):** `TC-HOME-001`, `TC-HOME-002`, `TC-NAV-001`, `TC-ART-001`, `TC-ART-002`, `TC-ART-003`, `TC-SRCH-001`, `TC-SRCH-003`, `TC-THM-001`, `TC-THM-002`, `TC-THM-003`, `TC-AUTH-001`, `TC-AUTH-003`, `TC-AUTH-004`.
  * **Negative (2):** `TC-SRCH-002`, `TC-AUTH-002`.
  * **Boundary (1):** `TC-SRCH-004`.
* **Automation Feasibility Distribution (17 total):**
  * **Fully automatable (14):** `TC-HOME-001`, `TC-HOME-002`, `TC-NAV-001`, `TC-ART-001`, `TC-ART-002`, `TC-ART-003`, `TC-SRCH-001`, `TC-SRCH-002`, `TC-SRCH-003`, `TC-THM-001`, `TC-THM-002`, `TC-THM-003`, `TC-AUTH-001`, `TC-AUTH-003`.
  * **Partially automatable (1):** `TC-AUTH-002` (URL non-navigation assertion is automatable immediately; field-level validation cues are absent from DOM and require product confirmation).
  * **Pending product confirmation (1):** `TC-SRCH-004` (whitespace query fallback to trending cards vs. client-side trim/rejection).
  * **Blocked in production (1):** `TC-AUTH-004` (end-to-end credential authentication blocked by Cloudflare Turnstile bot challenge on production).

---

## 5. Items Requiring Human / QA Lead Confirmation

1. **Cloudflare Turnstile on `/login` (`TC-AUTH-004`):**
   - *Confirmation Needed:* Confirm whether the development team will provide a staging environment without Turnstile, custom bypass request headers, or a pre-authenticated `storageState.json` fixture for CI/CD runs.
2. **Whitespace Search Behavior (`TC-SRCH-004`):**
   - *Confirmation Needed:* Re-exploration confirmed that whitespace search currently navigates to `/search/%20%20%20` and returns default trending content (`cardsCount: 39`). Confirm whether Product Management approves this as intended fallback behavior before adding this test to the automated regression suite.
3. **Empty Credential Visual Validation (`TC-AUTH-002`):**
   - *Confirmation Needed:* While form submission is demonstrably halted, no inline error messages or validation borders appear in the DOM. Confirm whether specific visual validation messages are planned or expected.
4. **Article Metadata Across Alternative Formats (`TC-ART-001`):**
   - *Confirmation Needed:* Standard editorial news articles expose `publish-date`, `reading-time`, and body paragraphs. Confirm whether video stories, photo galleries, or sponsored posts require separate, format-specific test specifications.
5. **Advertisement Handling & Layout Stability:**
   - *Strategy Clarification:* Do not make ad blockers a default requirement for functional tests. Recommend Playwright web-first assertions (`await expect(locator).toBeVisible()`) and auto-waiting on `data-qa-id` elements to ensure functional test resilience against dynamic ad loading. Treat advertisement layout stability, cumulative layout shifts (CLS), and banner rendering as a separate visual/layout regression concern if required, rather than gating functional test execution.
