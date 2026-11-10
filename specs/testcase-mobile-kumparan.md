# Kumparan Mobile Web — Comprehensive Test Case Specifications & Risk Analysis

**Document Version:** 1.0  
**Author:** Senior QA Engineer & Senior Test Analyst  
**Platform:** Mobile Web (`https://m.kumparan.com/` / Mobile Emulation)  
**Source Baseline:** `test-data/Test Execution and Risk Analyst.xlsx` (`Testcases - Mobile`, `Test Summary`)  
**Date:** 2026-11-10  

---

## 1. Executive Summary & Mobile Test Execution Metrics

This document details the test specification, mobile UX interaction flows, execution status, defect tracking, and risk analysis for the mobile web platform of **kumparan.com**. The mobile test suite addresses the viewport constraints, touch gestures, drawer navigation, and responsive component adaptations across four core functionalities: Authentication (Login), Content Discovery (Navigation), Search, and Editorial Article Interactions.

### 1.1 Mobile Execution Overview

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Test Cases** | **18** | **100%** |
| **Passed Cases** | 17 | 94.4% |
| **Failed Cases (Active Bugs)** | 1 | 5.6% |
| **Automated: DONE** | 11 | 61.1% |
| **Automated: HALF (Blocked by CAPTCHA/Turnstile)** | 3 | 16.7% |
| **Automated: UNABLE (Requires Login Session / Auth State)** | 4 | 22.2% |

### 1.2 Breakdown by Functionality

| Functionality | Total Cases | Passed | Failed | Automated: DONE | Automated: HALF | Automated: UNABLE | Automation Progress |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Login (`LGN`)** | 6 | 6 | 0 | 2 | 3 | 1 | 33.3% |
| **Navigation (`NAV`)** | 4 | 4 | 0 | 4 | 0 | 0 | 100% |
| **Search (`SRC`)** | 3 | 2 | 1 | 2 | 0 | 1 | 66.7% |
| **Article (`ATC`)** | 5 | 5 | 0 | 3 | 0 | 2 | 60.0% |
| **Total** | **18** | **17** | **1** | **11** | **3** | **4** | **61.1%** |

---

## 2. Mobile-Specific Risk & Feasibility Analysis

### 2.1 Viewport, Drawer, & Touch Interaction Risks
- **Hamburger Navigation Drawer (`LGN-001` - `LGN-006`):**
  - Unlike desktop where the `Masuk` button is always visible in the header, mobile hides user account controls inside a slide-out drawer menu (`Burger Menu` top-left).
  - *Risk:* Drawer animations and backdrop overlays can intercept tap actions if client-side hydration has not attached event handlers.
- **Horizontal Channel Swiping (`NAV-001`, `NAV-002`):**
  - Channels (`Tekno`, `Breaking News`) are placed in an overflow-x scroll container beneath the search bar.
  - *Risk:* Automated tests must execute horizontal scroll gestures or use `.scrollIntoViewIfNeeded()` before tapping to prevent off-screen element click failures.
- **Floating Sticky Engagement Bar (`ATC-002`, `ATC-003`):**
  - On mobile, comment interactions are triggered via a sticky floating bottom element rather than static desktop links.
  - *Risk:* Sticky bottom bars can clash with mobile cookie banners, ads, or viewport resize events.

### 2.2 Bot Protection & Production Constraints
- **Cloudflare Turnstile:**
  - Identical to desktop, mobile login submission (`LGN-001`, `002`, `003`) is gated by Cloudflare Turnstile bot verification on `m.kumparan.com`.
  - Automated tests can validate form interaction and client-side validation, but automated credential submission requires test environment bypass or mock tokens.

### 2.3 Critical Defects Identified
- **`SRC-003` (Search with Symbols `$%^&*`):**
  - **Observed Behavior:** Submitting special characters (`$%^&*`) in the mobile search input fails to trigger an empty state; the search results feed continues to render unfiltered articles.
  - **Severity:** Medium (Input sanitization / Query fallback flaw).
  - **Defect Report:** [Google Docs Bug Link](https://docs.google.com/document/d/10Z15HkBVP5JI7Va6W-nEMGT9eO9D1GO26MDbwtDae-g/edit?usp=sharing)

---

## 3. Comprehensive Mobile Test Case Specifications

---

### Suite 1: Authentication & Session Management (`LGN`)

#### `LGN-001`: Verifikasi Login menggunakan Kredensial yang Valid
* **Test Case ID:** `LGN-001`
* **Functionality:** Login
* **Category:** Positive
* **Priority:** HIGH
* **Automation Feasibility:** HALF *(Form filling and navigation are automated; final submit is gated by Turnstile in production)*
* **Execution Status:** **PASSED**
* **Precondition:**
  1. Valid registered user account.
  2. Currently unauthenticated.
* **Test Data:**
  - Email: `davinson.works@gmail.com`
  - Password: `Davinson123!@#`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/` | Browser navigates to mobile homepage | As expected |
| 2 | Tap Burger Menu icon in top-left header | Slide-out navigation sidebar opens | As expected |
| 3 | Tap `Menu Masuk` in navigation drawer | Redirected to mobile login page | As expected |
| 4 | Enter valid email into `input[data-qa-id="input-email"]` | Field receives text input | As expected |
| 5 | Enter valid password into `input[data-qa-id="input-password"]` | Field receives masked text input | As expected |
| 6 | Tap `Menu Masuk` (Submit button) | 1. Redirected to Homepage.<br>2. Profile photo rendered on top navigation. | As expected |

---

#### `LGN-002`: Verifikasi Login menggunakan email yang invalid
* **Test Case ID:** `LGN-002`
* **Functionality:** Login
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** HALF
* **Execution Status:** **PASSED**
* **Precondition:**
  1. Non-existent email account.
  2. Currently unauthenticated.
* **Test Data:**
  - Email: `davinson.works999@gmail.com`
  - Password: `Davinson123!@#`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/` | Browser loads mobile homepage | As expected |
| 2 | Tap Burger Menu icon in top-left header | Slide-out navigation sidebar opens | As expected |
| 3 | Tap `Menu Masuk` in navigation drawer | Redirected to mobile login page | As expected |
| 4 | Enter invalid email into email field | Field receives text input | As expected |
| 5 | Enter valid password into password field | Field receives masked input | As expected |
| 6 | Tap `Menu Masuk` (Submit button) | System displays error alert: *"email atau password salah"* | As expected |

---

#### `LGN-003`: Verifikasi Login menggunakan password yang invalid
* **Test Case ID:** `LGN-003`
* **Functionality:** Login
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** HALF
* **Execution Status:** **PASSED**
* **Precondition:**
  1. Valid email, invalid password.
  2. Currently unauthenticated.
* **Test Data:**
  - Email: `davinson.works@gmail.com`
  - Password: `Davinson123`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/` | Browser loads mobile homepage | As expected |
| 2 | Tap Burger Menu icon in top-left header | Slide-out navigation sidebar opens | As expected |
| 3 | Tap `Menu Masuk` in navigation drawer | Redirected to mobile login page | As expected |
| 4 | Enter valid email into email field | Field receives text input | As expected |
| 5 | Enter invalid password into password field | Field receives masked input | As expected |
| 6 | Tap `Menu Masuk` (Submit button) | System displays error alert: *"email atau password salah"* | As expected |

---

#### `LGN-004`: Verifikasi tidak bisa login saat fields email dan password kosong
* **Test Case ID:** `LGN-004`
* **Functionality:** Login
* **Category:** Negative
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is on mobile login page; both input fields are empty.
* **Test Data:**
  - Email: `""` (empty string)
  - Password: `""` (empty string)

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/` | Browser loads mobile homepage | As expected |
| 2 | Tap Burger Menu icon in top-left header | Slide-out navigation sidebar opens | As expected |
| 3 | Tap `Menu Masuk` in navigation drawer | Redirected to mobile login page | As expected |
| 4 | Attempt to tap submit button | Submit button has `disabled` attribute; tap action is prevented, and URL remains `/login` | As expected |

---

#### `LGN-005`: Bisa akses Halaman Homepage tanpa perlu login
* **Test Case ID:** `LGN-005`
* **Functionality:** Login
* **Category:** Positive
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Clean, unauthenticated mobile browser context.
* **Test Data:** N/A

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/` | Browser loads mobile homepage with full responsive feed, breaking news, and guest burger menu | As expected |

---

#### `LGN-006`: Bisa Logout dari dalam Sistem
* **Test Case ID:** `LGN-006`
* **Functionality:** Login
* **Category:** Positive
* **Priority:** HIGH
* **Automation Feasibility:** UNABLE *(Requires pre-authenticated session)*
* **Execution Status:** **PASSED**
* **Precondition:** User is logged in on mobile web.
* **Test Data:** N/A

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/` | User is on homepage in authenticated state | As expected |
| 2 | Tap Burger Menu icon in top-left header | Slide-out navigation sidebar opens showing user profile | As expected |
| 3 | Scroll down inside drawer and tap `Keluar` button | 1. User is redirected to homepage in logged-out state.<br>2. `Menu Masuk` is displayed in burger menu drawer. | As expected |

---

### Suite 2: Mobile Navigation (`NAV`)

#### `NAV-001`: Bisa berpindah page artikel melalui channel navigation
* **Test Case ID:** `NAV-001`
* **Functionality:** Navigation
* **Category:** Positive
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is on mobile homepage.
* **Test Data:** Channel: `"Tekno"`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/` | Browser loads mobile homepage | As expected |
| 2 | Scroll horizontal navigation bar beneath Search Bar and locate `Tekno` | `Tekno` channel tab becomes visible | As expected |
| 3 | Tap `Tekno` | Redirected to `https://m.kumparan.com/channel/tekno`; renders `Tekno` page title and feed | As expected |

---

#### `NAV-002`: Bisa berpindah page melalui kumparan highlighted article
* **Test Case ID:** `NAV-002`
* **Functionality:** Navigation
* **Category:** Positive
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is on mobile homepage.
* **Test Data:** Highlighted topic: `"Breaking News"`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/` | Browser loads mobile homepage | As expected |
| 2 | Scroll navigation bar beneath Search Bar and locate `Breaking News` | `Breaking News` tab becomes visible | As expected |
| 3 | Tap `Breaking News` | Navigates to `https://m.kumparan.com/breakingnews` feed | As expected |

---

#### `NAV-003`: Bisa berpindah page dengan valid URL
* **Test Case ID:** `NAV-003`
* **Functionality:** Navigation
* **Category:** Positive
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Valid destination URL known.
* **Test Data:** URL: `https://m.kumparan.com/trending`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate directly to `https://m.kumparan.com/trending` | Browser loads Trending topics feed with correct responsive mobile layout | As expected |

---

#### `NAV-004`: Verifikasi berpindah page dengan invalid URL
* **Test Case ID:** `NAV-004`
* **Functionality:** Navigation
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Invalid / non-existent route URL.
* **Test Data:** URL: `https://m.kumparan.com/trendingssds`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://m.kumparan.com/trendingssds` | Displays Kumparan mobile 404 *"Halaman tidak Ditemukan"* error page | As expected |

---

### Suite 3: Mobile Search Engine (`SRC`)

#### `SRC-001`: Mencari Artikel dengan valid Keyword
* **Test Case ID:** `SRC-001`
* **Functionality:** Search
* **Category:** Positive
* **Priority:** HIGH
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is on mobile homepage.
* **Test Data:** Query: `"penyadapan"`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Tap Search Bar | Focuses input; navigates to mobile `/search` landing | As expected |
| 2 | Type `"penyadapan"` and submit via Enter/Virtual Keyboard | URL updates to `/search/penyadapan`; renders matching responsive story cards | As expected |

---

#### `SRC-002`: Menghapus kata kunci setelah melakukan search article
* **Test Case ID:** `SRC-002`
* **Functionality:** Search
* **Category:** Negative
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Mobile search results page currently open with an active query.
* **Test Data:** Query: `"penyadapan"`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Tap search bar and submit `"penyadapan"` | Search results page loads matching stories | As expected |
| 2 | Tap the `x` (clear) icon inside the search input | 1. Input field clears.<br>2. Restores popular search recommendations (*Pencarian Populer*). | As expected |

---

#### `SRC-003`: Mencari artikel dengan kata kunci simbol-simbol
* **Test Case ID:** `SRC-003`
* **Functionality:** Search
* **Category:** Negative
* **Priority:** LOW
* **Automation Feasibility:** UNABLE *(Marked unable due to unhandled search query state on mobile)*
* **Execution Status:** **FAILED**
* **Bug Tracking Link:** [Mobile Bug Report Document](https://docs.google.com/document/d/10Z15HkBVP5JI7Va6W-nEMGT9eO9D1GO26MDbwtDae-g/edit?usp=sharing)
* **Precondition:** User is on mobile homepage.
* **Test Data:** Query: `"$%^&*"`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Tap Search Bar | Navigates to `/search` | As expected |
| 2 | Type `"$%^&*"` into search field and submit | Displays clean empty state feedback (*"Story tidak ditemukan"*) | **FAILED:** System continues displaying an unfiltered list of articles instead of empty state feedback |

---

### Suite 4: Mobile Article Interaction & Engagement (`ATC`)

#### `ATC-001`: Bisa melihat detail artikel
* **Test Case ID:** `ATC-001`
* **Functionality:** Article
* **Category:** Positive
* **Priority:** HIGH
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Mobile homepage is loaded with rendered news feed.
* **Test Data:** N/A (First standard editorial card in feed)

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Tap any editorial article card in mobile feed | Navigates to responsive article detail page | As expected |
| 2 | Validate article breadcrumbs | Breadcrumbs display hierarchy: `Beranda > <Nama Channel>` | As expected |

---

#### `ATC-002`: Bisa memberikan comment ketika pada artikel ketika sudah login
* **Test Case ID:** `ATC-002`
* **Functionality:** Article
* **Category:** Positive
* **Priority:** MEDIUM
* **Automation Feasibility:** UNABLE *(Requires pre-authenticated session)*
* **Execution Status:** **PASSED**
* **Precondition:** User is logged in and viewing an article on mobile.
* **Test Data:** Comment Text: `"lorem ipsum bla bla bla"`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Tap article card on mobile homepage | Article loads in authenticated mobile view | As expected |
| 2 | Tap comment icon located on the **floating bottom action element** | Opens mobile comment sheet / drawer | As expected |
| 3 | Enter comment text into input box | Input box accepts user text | As expected |

---

#### `ATC-003`: Tidak bisa memberikan comment pada article ketika belum login
* **Test Case ID:** `ATC-003`
* **Functionality:** Article
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:**
  1. Currently unauthenticated.
  2. Viewing an article detail page on mobile.
* **Test Data:** Comment Text: `"lorem ipsum bla bla bla"`

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Tap article card on mobile homepage | Article loads in guest mode | As expected |
| 2 | Tap comment icon on the **floating bottom action element** | Opens mobile comment sheet | As expected |
| 3 | Type comment text and tap `Send` | Submission is blocked; redirects user to `/login` | As expected |

---

#### `ATC-004`: Bisa melakukan polling news ketika sudah login
* **Test Case ID:** `ATC-004`
* **Functionality:** Article
* **Category:** Positive
* **Priority:** LOW
* **Automation Feasibility:** UNABLE *(Requires login & active polling widget)*
* **Execution Status:** **PASSED**
* **Precondition:**
  1. User is logged in.
  2. Active polling article present on homepage.
  3. Homepage loaded.
* **Test Data:** N/A

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Scroll down to Polling Section on mobile homepage | Displays active news polling widget | As expected |
| 2 | Tap top polling option | 1. Vote is recorded in system.<br>2. UI updates to display percentage breakdown. | As expected |

---

#### `ATC-005`: Tidak bisa melakukan polling news ketika belum login
* **Test Case ID:** `ATC-005`
* **Functionality:** Article
* **Category:** Negative
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:**
  1. User is unauthenticated.
  2. Active polling article present on homepage.
  3. Homepage loaded.
* **Test Data:** N/A

| Step | Action / Touch Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Scroll down to Polling Section on mobile homepage | Displays active news polling widget | As expected |
| 2 | Tap top polling option | Vote is blocked; redirects user to `/login` | As expected |

---

## 4. Multi-Phase Playwright Automation Implementation Roadmap (Mobile)

To guarantee reliable execution across mobile viewports, touch emulation, and dynamic drawer menus, the mobile automation implementation is structured into **4 dedicated phases**. Each phase addresses one functionality domain using mobile device fixtures (`devices['Pixel 5']` or `Mobile Chrome`), dedicated Page Object extensions, and touch interaction handling.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MOBILE AUTOMATION MULTI-PHASE ROADMAP                    │
├─────────┬───────────────────────────────┬────────────┬──────────────────────┤
│ Phase   │ Functional Domain             │ Cases      │ Target Specs         │
├─────────┼───────────────────────────────┼────────────┼──────────────────────┤
│ Phase 1 │ Mobile Authentication Drawer  │ LGN-001..6 │ tests/m-auth.spec.ts │
│ Phase 2 │ Mobile Channel Swiping & Nav  │ NAV-001..4 │ tests/m-nav.spec.ts  │
│ Phase 3 │ Mobile Search Engine          │ SRC-001..3 │ tests/m-srch.spec.ts │
│ Phase 4 │ Sticky Engagement & Polling   │ ATC-001..5 │ tests/m-art.spec.ts  │
└─────────┴───────────────────────────────┴────────────┴──────────────────────┘
```

---

### Phase 1: Mobile Authentication & Drawer Menu (`LGN`)

#### 1. Objective & Scope
Automate mobile login flows through the slide-out hamburger navigation drawer, touch triggers, client-side input validation, disabled button guards, and logout lifecycle (`LGN-001` through `LGN-006`).

#### 2. Mobile Device Configuration & Page Object Model
- **Device Emulation:** Playwright `devices['Pixel 5']` (viewport: 393 x 851, `hasTouch: true`, `isMobile: true`).
- **Target Page Objects:**
  - `pages/mobile/MobileHomePage.ts`: Hamburger menu button `button[data-qa-id="btn-burger-menu"]` (or icon with `alt="menu"`).
  - `pages/mobile/MobileDrawerMenu.ts` *(New Component)*: Slide-out drawer container `[data-qa-id="drawer-menu"]`, `Menu Masuk` link `a[data-qa-id="drawer-login"]`, `Keluar` button `button[data-qa-id="drawer-logout"]`.
  - `pages/LoginPage.ts`: Reusable mobile inputs `input[data-qa-id="input-email"]`, `input[data-qa-id="input-password"]`, submit button `button[data-qa-id="btn-save"]`.

#### 3. Step-by-Step Implementation Strategy
1. **`LGN-004` & `LGN-005` (Mobile Guest Baseline):**
   - Navigate to `https://m.kumparan.com/`. Verify guest feed loads cleanly.
   - Tap burger menu $\rightarrow$ tap `Menu Masuk` $\rightarrow$ navigate to `/login`.
   - Assert submit button is disabled when email and password fields are empty.
2. **`LGN-001`, `LGN-002`, `LGN-003` (Mobile Credential Submission & Error Feedback):**
   - Tap drawer $\rightarrow$ navigate to `/login`.
   - Enter credentials via `page.fill()`.
   - For `LGN-002` and `LGN-003`, assert mobile alert banner/toast appears with message *"email atau password salah"*.
   - For `LGN-001`, document Turnstile mock/staging bypass strategy to assert post-login profile photo in drawer.
3. **`LGN-006` (Mobile Logout Flow):**
   - Initialize browser context with authenticated mobile storage state.
   - Tap burger menu $\rightarrow$ scroll down drawer $\rightarrow$ tap `Keluar`.
   - Assert drawer re-renders `Menu Masuk` and session token is invalidated.

#### 4. Assertions & Verification Plan
- `await expect(mobileDrawer.drawerContainer).toBeVisible({ timeout: 10000 })`
- `await expect(loginPage.submitButton).toBeDisabled()`
- `await expect(mobileDrawer.loginLink).toBeVisible()`

#### 5. Phase Verification Command
```powershell
npx playwright test tests/mobile/auth.spec.ts --project=mobile-chrome
```

---

### Phase 2: Mobile Channel Swiping & Navigation (`NAV`)

#### 1. Objective & Scope
Automate horizontal category scrolling beneath the search bar, highlighted breaking news feed transitions, deep links, and mobile 404 error page handling (`NAV-001` through `NAV-004`).

#### 2. Mobile Device Configuration & Page Object Model
- **Device Emulation:** Playwright `devices['Pixel 5']`.
- **Target Page Objects:**
  - `pages/mobile/MobileHomePage.ts`: Horizontal channels container `div[data-qa-id="horizontal-category-scroll"]`, category pills (e.g., `Tekno`, `Breaking News`).
  - `pages/ChannelPage.ts`: Channel title `h1[data-qa-id="channel-title"]`, feed card list.
  - `pages/NotFoundPage.ts`: 404 container and text *"Halaman tidak Ditemukan"*.

#### 3. Step-by-Step Implementation Strategy
1. **`NAV-001` (Horizontal Category Scroll & Selection):**
   - Navigate to `https://m.kumparan.com/`.
   - Use `.scrollIntoViewIfNeeded()` or dispatch horizontal touch scroll gesture on the channel container to bring `Tekno` into viewport.
   - Tap `Tekno`.
   - Assert URL updates to `https://m.kumparan.com/channel/tekno` and title displays `'Tekno'`.
2. **`NAV-002` (Horizontal Highlighted Navigation):**
   - Scroll horizontally to locate `Breaking News` pill.
   - Tap `Breaking News`.
   - Assert URL updates to `/breakingnews` and article cards are rendered.
3. **`NAV-003` (Direct Mobile Deep Linking):**
   - Navigate directly to `https://m.kumparan.com/trending`.
   - Assert mobile responsive feed loads correctly.
4. **`NAV-004` (Mobile 404 Route Handling):**
   - Navigate to `https://m.kumparan.com/trendingssds`.
   - Assert mobile 404 page renders *"Halaman tidak Ditemukan"*.

#### 4. Assertions & Verification Plan
- `await expect(mobileChannelPage.channelTitle).toBeVisible({ timeout: 15000 })`
- `await expect(page).toHaveURL(/channel\/tekno/)`
- `await expect(notFoundPage.errorHeadline).toBeVisible()`

#### 5. Phase Verification Command
```powershell
npx playwright test tests/mobile/navigation.spec.ts --project=mobile-chrome
```

---

### Phase 3: Mobile Search Engine (`SRC`)

#### 1. Objective & Scope
Automate search bar activation, keyword submission via mobile virtual enter, clear search button interaction, and special character defect tracking (`SRC-001` through `SRC-003`).

#### 2. Mobile Device Configuration & Page Object Model
- **Device Emulation:** Playwright `devices['Pixel 5']`.
- **Target Page Objects:**
  - `pages/mobile/MobileHomePage.ts`: Search input trigger `input[data-qa-id="input-search"]`.
  - `pages/mobile/MobileSearchPage.ts`: Search input, clear icon `[data-qa-id="btn-clear-search"]`, responsive result cards `[data-qa-id="story-result-card"]`, popular search recommendations `[data-qa-id="popular-search-section"]`.

#### 3. Step-by-Step Implementation Strategy
1. **`SRC-001` (Mobile Search Submission):**
   - Tap search bar on mobile homepage.
   - Type `"penyadapan"` and submit using `page.keyboard.press('Enter')`.
   - Assert destination URL is `https://m.kumparan.com/search/penyadapan`.
   - Assert result cards load with matching headlines.
2. **`SRC-002` (Clear Search Keyword):**
   - Execute search for `"penyadapan"`.
   - Tap `x` clear icon on the search input.
   - Assert input value clears to `""`.
   - Assert popular search section (*Pencarian Populer*) is restored on mobile view.
3. **`SRC-003` (Special Symbol Query Defect Tracking):**
   - Submit `"$%^&*"`.
   - Assert whether application renders clean empty state or reproduces known bug ([Mobile Bug Report](https://docs.google.com/document/d/10Z15HkBVP5JI7Va6W-nEMGT9eO9D1GO26MDbwtDae-g/edit?usp=sharing)) where unfiltered stories continue to be displayed.

#### 4. Assertions & Verification Plan
- `await expect(mobileSearchPage.resultCards.first()).toBeVisible({ timeout: 15000 })`
- `await expect(mobileSearchPage.searchInput).toHaveValue('')`
- `await expect(mobileSearchPage.popularSection).toBeVisible()`

#### 5. Phase Verification Command
```powershell
npx playwright test tests/mobile/search.spec.ts --project=mobile-chrome
```

---

### Phase 4: Sticky Engagement & Polling (`ATC`)

#### 1. Objective & Scope
Automate mobile article reading, breadcrumb navigation, comment authorization gate via the **sticky floating action element**, and mobile news polling (`ATC-001` through `ATC-005`).

#### 2. Mobile Device Configuration & Page Object Model
- **Device Emulation:** Playwright `devices['Pixel 5']`.
- **Target Page Objects:**
  - `pages/mobile/MobileArticlePage.ts`: Article title, breadcrumb links (`Beranda > <Channel>`).
  - `pages/mobile/MobileFloatingBar.ts` *(New Component)*: Sticky bottom action bar `[data-qa-id="floating-action-bar"]`, comment icon `button[data-qa-id="btn-floating-comment"]`, mobile comment sheet `[data-qa-id="comment-bottom-sheet"]`, send comment button `button[data-qa-id="btn-send-comment"]`.
  - `pages/mobile/MobilePollingWidget.ts` *(New Component)*: Mobile polling container, option touch targets, percentage results.

#### 3. Step-by-Step Implementation Strategy
1. **`ATC-001` (Mobile Detail Article & Breadcrumbs):**
   - Tap first standard editorial article card in mobile feed.
   - Assert article detail page loads.
   - Assert breadcrumb hierarchy displays: `Beranda > <Channel>`.
2. **`ATC-003` (Unauthenticated Comment Barrier via Sticky Floating Bar):**
   - On article detail page in unauthenticated session, locate sticky floating bottom bar.
   - Tap floating comment button $\rightarrow$ bottom sheet opens.
   - Type `"lorem ipsum bla bla bla"` and tap `Send`.
   - Assert submission is blocked and user is redirected to `https://m.kumparan.com/login`.
3. **`ATC-005` (Unauthenticated Mobile Polling Barrier):**
   - Scroll down to polling section on mobile homepage in unauthenticated session.
   - Tap top polling option.
   - Assert vote is blocked and user is redirected to `/login`.
4. **`ATC-002` & `ATC-004` (Authenticated Mobile Engagement via `storageState`):**
   - Load browser context with pre-authenticated mobile session.
   - `ATC-002`: Post comment through sticky bottom sheet and assert comment appears in stream.
   - `ATC-004`: Tap polling option and assert UI transitions to show vote percentage breakdown.

#### 4. Assertions & Verification Plan
- `await expect(mobileArticlePage.storyTitle).toBeVisible({ timeout: 15000 })`
- `await expect(mobileFloatingBar.bottomSheet).toBeVisible()`
- `await expect(page).toHaveURL(/login/)` (for unauthenticated guards).

#### 5. Phase Verification Command
```powershell
npx playwright test tests/mobile/article.spec.ts --project=mobile-chrome
```


