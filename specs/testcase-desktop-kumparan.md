# Kumparan Web Desktop — Comprehensive Test Case Specifications & Risk Analysis

**Document Version:** 1.0  
**Author:** Senior QA Engineer & Senior Test Analyst  
**Platform:** Web Desktop (`https://kumparan.com/`)  
**Source Baseline:** `test-data/Test Execution and Risk Analyst.xlsx` (`Testcases - Desktop`, `Test Summary`)  
**Date:** 2026-11-10  

---

## 1. Executive Summary & Test Execution Metrics

This document details the test specification, execution status, defect tracking, and risk analysis for the desktop web platform of **kumparan.com**. The test suite targets core user journeys across five functional pillars: Authentication (Login), Content Discovery (Navigation), Search, Editorial Article Interactions, and Content Creation (Submit Article).

### 1.1 Desktop Execution Overview

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Test Cases** | **20** | **100%** |
| **Passed Cases** | 18 | 90.0% |
| **Failed Cases (Active Bugs)** | 2 | 10.0% |
| **Automated: DONE** | 12 | 60.0% |
| **Automated: HALF (Blocked by CAPTCHA/Turnstile)** | 3 | 15.0% |
| **Automated: UNABLE (Requires Login Session / Auth State)** | 5 | 25.0% |

### 1.2 Breakdown by Functionality

| Functionality | Total Cases | Passed | Failed | Automated: DONE | Automated: HALF | Automated: UNABLE | Automation Progress |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Login (`LGN`)** | 6 | 6 | 0 | 2 | 3 | 1 | 33.3% |
| **Navigation (`NAV`)** | 4 | 4 | 0 | 4 | 0 | 0 | 100% |
| **Search (`SRC`)** | 3 | 2 | 1 | 3 | 0 | 0 | 100% |
| **Article (`ATC`)** | 5 | 5 | 0 | 3 | 0 | 2 | 60.0% |
| **Submit Article (`SBA`)** | 2 | 1 | 1 | 0 | 0 | 2 | 0% |
| **Total** | **20** | **18** | **2** | **12** | **3** | **5** | **60.0%** |

---

## 2. Risk & Feasibility Analysis (Senior QA Analyst Insights)

### 2.1 Bot Protection & Authentication Barrier (Cloudflare Turnstile)
- **Impacted Cases:** `LGN-001`, `LGN-002`, `LGN-003` (classified as `HALF`).
- **Risk:** In the live production environment, the `/login` route triggers Cloudflare Turnstile token validation upon credential submission. Automated end-to-end regression without a test environment bypass or mock token is prevented by anti-bot constraints.
- **Mitigation Strategy:** Establish deterministic pre-validation tests (field rendering, empty submission prevention, masked/unmasked toggle) and inject verified session cookies/tokens for downstream authenticated tests.

### 2.2 Authenticated State Dependency
- **Impacted Cases:** `LGN-006` (Logout), `ATC-002` (Comment as user), `ATC-004` (Vote polling), `SBA-001` (Story description limit), `SBA-002` (Draft deletion).
- **Risk:** Classified as `UNABLE` because executing these tests requires an active authenticated session. Running them end-to-end without shared credentials or storage state injection leads to test fragility.
- **Mitigation Strategy:** Implement Playwright `storageState` fixture to pre-populate authentication tokens in browser context prior to navigating.

### 2.3 Critical Defects Identified
1. **`SRC-003` (Search with Symbols `$%^&*`):**
   - **Observed Behavior:** Searching for special characters (`$%^&*`) does not render an empty state or validation message; instead, it continues displaying arbitrary articles.
   - **Severity:** Medium (Input sanitization / Query fallback flaw).
   - **Defect Report:** [Google Docs Bug Link](https://docs.google.com/document/d/1dGLF-Vd7Zgjdm9ZJ9JtJwmvvIHKxEE7CPjvNK7qVaUU/edit?usp=sharing)
2. **`SBA-002` (Draft Article Deletion):**
   - **Observed Behavior:** Confirming draft deletion in the confirmation modal fails to decrement the draft counter or remove the item from "My Content".
   - **Severity:** High (Data persistence / State mutation failure).
   - **Defect Report:** [Google Docs Bug Link](https://docs.google.com/document/d/1TQfomyUrwHRHR4TbixI-Dimon_ZfBIDfFUkSZjAHRzY/edit?usp=sharing)

---

## 3. Comprehensive Test Case Specifications

---

### Suite 1: Authentication & Session Management (`LGN`)

#### `LGN-001`: Verifikasi Login menggunakan Kredensial yang Valid
* **Test Case ID:** `LGN-001`
* **Functionality:** Login
* **Category:** Positive
* **Priority:** HIGH
* **Automation Feasibility:** HALF *(Form filling and navigation are automated; final submit is gated by Turnstile in production)*
* **Execution Status:** **PASSED**
* **Precondition:** User holds a valid registered account; user is currently unauthenticated.
* **Test Data:**
  - Email: `davinson.works@gmail.com`
  - Password: `Davinson123!@#`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/` | Browser navigates to homepage | As expected |
| 2 | Click `Masuk` button on top-right header (`button[data-qa-id="hd-login"]`) | Browser navigates to `https://kumparan.com/login` | As expected |
| 3 | Enter valid email into `input[data-qa-id="input-email"]` | Field receives text input cleanly | As expected |
| 4 | Enter valid password into `input[data-qa-id="input-password"]` | Field receives masked text input | As expected |
| 5 | Click submit button `button[data-qa-id="btn-save"]` | 1. Redirected to Homepage.<br>2. Profile photo rendered on top-right navigation header. | As expected |

---

#### `LGN-002`: Verifikasi Login menggunakan email yang invalid
* **Test Case ID:** `LGN-002`
* **Functionality:** Login
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** HALF
* **Execution Status:** **PASSED**
* **Precondition:** Non-existent email account; user is unauthenticated.
* **Test Data:**
  - Email: `davinson.works999@gmail.com`
  - Password: `Davinson123!@#`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/` | Browser navigates to homepage | As expected |
| 2 | Click `Masuk` button on top-right header | Browser navigates to `https://kumparan.com/login` | As expected |
| 3 | Enter invalid email into email field | Field receives text input | As expected |
| 4 | Enter valid password into password field | Field receives masked input | As expected |
| 5 | Click submit button `button[data-qa-id="btn-save"]` | System displays error alert: *"email atau password salah"* | As expected |

---

#### `LGN-003`: Verifikasi Login menggunakan password yang invalid
* **Test Case ID:** `LGN-003`
* **Functionality:** Login
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** HALF
* **Execution Status:** **PASSED**
* **Precondition:** Valid email, wrong password; user is unauthenticated.
* **Test Data:**
  - Email: `davinson.works@gmail.com`
  - Password: `Davinson123`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/` | Browser navigates to homepage | As expected |
| 2 | Click `Masuk` button on top-right header | Browser navigates to `https://kumparan.com/login` | As expected |
| 3 | Enter valid email into email field | Field receives text input | As expected |
| 4 | Enter invalid password into password field | Field receives masked input | As expected |
| 5 | Click submit button `button[data-qa-id="btn-save"]` | System displays error alert: *"email atau password salah"* | As expected |

---

#### `LGN-004`: Verifikasi tidak bisa login saat fields email dan password kosong
* **Test Case ID:** `LGN-004`
* **Functionality:** Login
* **Category:** Negative
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is on login page; both input fields are empty.
* **Test Data:**
  - Email: `""` (empty string)
  - Password: `""` (empty string)

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/` | Browser navigates to homepage | As expected |
| 2 | Click `Masuk` button on top-right header | Browser navigates to `https://kumparan.com/login` | As expected |
| 3 | Attempt to click submit button `button[data-qa-id="btn-save"]` | Submit button has `disabled` attribute; submission is prevented, and URL remains `/login` | As expected |

---

#### `LGN-005`: Bisa akses Halaman Homepage tanpa perlu login
* **Test Case ID:** `LGN-005`
* **Functionality:** Login
* **Category:** Positive
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is in a clean, unauthenticated browser context.
* **Test Data:** N/A

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/` | Browser successfully loads homepage with full editorial feed, navigation, and guest header controls | As expected |

---

#### `LGN-006`: Bisa Logout dari dalam Sistem
* **Test Case ID:** `LGN-006`
* **Functionality:** Login
* **Category:** Positive
* **Priority:** HIGH
* **Automation Feasibility:** UNABLE *(Requires pre-authenticated session)*
* **Execution Status:** **PASSED**
* **Precondition:** User is actively logged in with valid session.
* **Test Data:** N/A

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/` | User is on homepage in authenticated state | As expected |
| 2 | Click profile image icon in top-right navigation | Displays profile dropdown menu | As expected |
| 3 | Click `Keluar` (Logout) button | 1. User session is invalidated and redirected to homepage.<br>2. `Masuk` button is restored in header. | As expected |

---

### Suite 2: Global Navigation (`NAV`)

#### `NAV-001`: Bisa berpindah page artikel melalui channel navigation
* **Test Case ID:** `NAV-001`
* **Functionality:** Navigation
* **Category:** Positive
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is on homepage.
* **Test Data:** Channel: `"Tekno"`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/` | Browser loads homepage | As expected |
| 2 | Click `Tekno` link on top main menu (`nav[data-qa-id="main-menu"]`) | Redirects to `https://kumparan.com/channel/tekno`; renders `Tekno` page title and category feed | As expected |

---

#### `NAV-002`: Bisa berpindah page melalui kumparan highlighted article
* **Test Case ID:** `NAV-002`
* **Functionality:** Navigation
* **Category:** Positive
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is on homepage.
* **Test Data:** Highlighted topic: `"Breaking News"`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/` | Browser loads homepage | As expected |
| 2 | Click `Breaking News` in highlighted sub-menu navigation | Navigates to `https://kumparan.com/breakingnews` feed | As expected |

---

#### `NAV-003`: Bisa berpindah page dengan valid URL
* **Test Case ID:** `NAV-003`
* **Functionality:** Navigation
* **Category:** Positive
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Valid destination URL known.
* **Test Data:** URL: `https://kumparan.com/trending`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate directly to `https://kumparan.com/trending` | Browser loads Trending topics feed with correct URL and heading | As expected |

---

#### `NAV-004`: Verifikasi berpindah page dengan invalid URL
* **Test Case ID:** `NAV-004`
* **Functionality:** Navigation
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Invalid / non-existent route URL.
* **Test Data:** URL: `https://kumparan.com/trendingssds`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Navigate to `https://kumparan.com/trendingssds` | Displays Kumparan 404 *"Halaman tidak Ditemukan"* error page | As expected |

---

### Suite 3: Search Engine (`SRC`)

#### `SRC-001`: Mencari Artikel dengan valid Keyword
* **Test Case ID:** `SRC-001`
* **Functionality:** Search
* **Category:** Positive
* **Priority:** HIGH
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is on homepage.
* **Test Data:** Query: `"penyadapan"`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Click search bar `input[data-qa-id="input-search"]` | Focuses input; navigates to `/search` landing | As expected |
| 2 | Type `"penyadapan"` into search input | Displays autocomplete suggestion popup matching keyword | As expected |
| 3 | Press `Enter` | URL updates to `/search/penyadapan`; displays matching article result cards | As expected |

---

#### `SRC-002`: Menghapus kata kunci setelah melakukan search article
* **Test Case ID:** `SRC-002`
* **Functionality:** Search
* **Category:** Negative
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Search results page currently open with an active query.
* **Test Data:** Query: `"penyadapan"`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Click search bar and submit `"penyadapan"` | Search results page loads matching stories | As expected |
| 2 | Click the `x` (clear) icon inside the search input | 1. Input field clears.<br>2. Restores popular searches (*Pencarian Populer*) section. | As expected |

---

#### `SRC-003`: Mencari artikel dengan kata kunci simbol-simbol
* **Test Case ID:** `SRC-003`
* **Functionality:** Search
* **Category:** Negative
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **FAILED**
* **Bug Tracking Link:** [Bug Report Document](https://docs.google.com/document/d/1dGLF-Vd7Zgjdm9ZJ9JtJwmvvIHKxEE7CPjvNK7qVaUU/edit?usp=sharing)
* **Precondition:** User is on homepage.
* **Test Data:** Query: `"$%^&*"`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Click search bar | Navigates to `/search` | As expected |
| 2 | Type `"$%^&*"` into search field and press `Enter` | Displays clean empty state (*"Story tidak ditemukan"*) | **FAILED:** System continues displaying an unfiltered list of articles instead of empty state feedback |

---

### Suite 4: Editorial Article & Engagement (`ATC`)

#### `ATC-001`: Bisa melihat detail artikel
* **Test Case ID:** `ATC-001`
* **Functionality:** Article
* **Category:** Positive
* **Priority:** HIGH
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** Homepage is loaded with rendered news feed.
* **Test Data:** N/A (Dynamic first standard editorial card)

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Click headline of first standard editorial article card | Navigates to article detail page | As expected |
| 2 | Validate article breadcrumbs | Breadcrumbs display hierarchy: `Beranda > <Nama Channel>` | As expected |

---

#### `ATC-002`: Bisa memberikan comment pada artikel ketika sudah login
* **Test Case ID:** `ATC-002`
* **Functionality:** Article
* **Category:** Positive
* **Priority:** MEDIUM
* **Automation Feasibility:** UNABLE *(Requires pre-authenticated session)*
* **Execution Status:** **PASSED**
* **Precondition:** User is logged in and viewing an article detail page.
* **Test Data:** Comment Text: `"lorem ipsum bla bla bla"`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Open article detail page | Article loads successfully | As expected |
| 2 | Click comment icon beneath article title | Opens comments section / drawer | As expected |
| 3 | Enter comment text into input box | Input box accepts user text | As expected |

---

#### `ATC-003`: Tidak bisa memberikan comment pada article ketika belum login
* **Test Case ID:** `ATC-003`
* **Functionality:** Article
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is unauthenticated on an article detail page.
* **Test Data:** Comment Text: `"lorem ipsum bla bla bla"`

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Open article detail page | Article loads in guest mode | As expected |
| 2 | Click comment icon beneath article title | Opens comments section | As expected |
| 3 | Type comment text and click `Send` | Submission is blocked; redirects user to `/login` | As expected |

---

#### `ATC-004`: Bisa melakukan polling news ketika sudah login
* **Test Case ID:** `ATC-004`
* **Functionality:** Article
* **Category:** Positive
* **Priority:** LOW
* **Automation Feasibility:** UNABLE *(Requires login & active polling widget)*
* **Execution Status:** **PASSED**
* **Precondition:** User is logged in; active polling article present on homepage.
* **Test Data:** N/A

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Scroll down to Polling Section on homepage | Displays active news polling widget | As expected |
| 2 | Click the top polling option | 1. Vote is recorded in system.<br>2. UI transitions to display percentage breakdown. | As expected |

---

#### `ATC-005`: Tidak bisa melakukan polling news ketika belum login
* **Test Case ID:** `ATC-005`
* **Functionality:** Article
* **Category:** Negative
* **Priority:** LOW
* **Automation Feasibility:** DONE
* **Execution Status:** **PASSED**
* **Precondition:** User is unauthenticated; active polling widget on homepage.
* **Test Data:** N/A

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Scroll down to Polling Section on homepage | Displays active news polling widget | As expected |
| 2 | Click any polling option | Vote is blocked; redirects user to `/login` | As expected |

---

### Suite 5: Content Creation (`SBA`) — Desktop Exclusive

#### `SBA-001`: Verifikasi batas jumlah karakter untuk deskripsi artikel pribadi
* **Test Case ID:** `SBA-001`
* **Functionality:** Submit Article
* **Category:** Negative
* **Priority:** MEDIUM
* **Automation Feasibility:** UNABLE *(Requires logged in creator session)*
* **Execution Status:** **PASSED**
* **Precondition:** User is authenticated with creator permissions on homepage.
* **Test Data:** Description string exceeding 200 characters.

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Click `Buat Tulisan` button in top-right header | Navigates to article editor page | As expected |
| 2 | In the right-hand Description field, enter text > 200 characters | Description field enforces strict 200-character max limit | As expected |

---

#### `SBA-002`: Bisa melakukan penghapusan draft article
* **Test Case ID:** `SBA-002`
* **Functionality:** Submit Article
* **Category:** Positive
* **Priority:** LOW
* **Automation Feasibility:** UNABLE *(Requires creator session & existing draft)*
* **Execution Status:** **FAILED**
* **Bug Tracking Link:** [Bug Report Document](https://docs.google.com/document/d/1TQfomyUrwHRHR4TbixI-Dimon_ZfBIDfFUkSZjAHRzY/edit?usp=sharing)
* **Precondition:** User is authenticated; at least one article draft exists in "My Content".
* **Test Data:** Navigation to Profile $\rightarrow$ My Content.

| Step | Action / Interaction | Expected Result | Actual Result |
| :---: | :--- | :--- | :--- |
| 1 | Click `Buat Tulisan` / Navigate to My Content | Navigates to My Content draft list | As expected |
| 2 | Click `Hapus` (Delete) button on existing draft | Displays modal confirmation popup | As expected |
| 3 | Click `Yes` in modal confirmation popup | 1. Draft is removed from list.<br>2. Total draft count decrements by 1. | **FAILED:** Draft count does not decrement and remains unchanged |

---

## 4. Multi-Phase Playwright Automation Implementation Roadmap (Desktop)

To ensure systematic, high-reliability delivery without context overload or execution bottlenecks, the automation implementation is partitioned into **5 distinct phases**. Each phase corresponds to a single functionality domain and includes Page Object Model (POM) architecture, test fixtures, assertion strategies, and verification commands.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   DESKTOP AUTOMATION MULTI-PHASE ROADMAP                    │
├─────────┬───────────────────────────────┬────────────┬──────────────────────┤
│ Phase   │ Functional Domain             │ Cases      │ Target Specs         │
├─────────┼───────────────────────────────┼────────────┼──────────────────────┤
│ Phase 1 │ Authentication & Session      │ LGN-001..6 │ tests/auth.spec.ts   │
│ Phase 2 │ Global Navigation & Routing   │ NAV-001..4 │ tests/nav.spec.ts    │
│ Phase 3 │ Search Engine & Input Limits  │ SRC-001..3 │ tests/search.spec.ts │
│ Phase 4 │ Article & Engagement Drawer   │ ATC-001..5 │ tests/article.spec.ts│
│ Phase 5 │ Creator Studio (Drafting)     │ SBA-001..2 │ tests/sba.spec.ts    │
└─────────┴───────────────────────────────┴────────────┴──────────────────────┘
```

---

### Phase 1: Authentication & User Session Management (`LGN`)

#### 1. Objective & Scope
Automate the end-to-end guest access, login navigation, client validation, credential entry, and session lifecycle (`LGN-001` through `LGN-006`).

#### 2. Page Object Model Requirements
- **Target Page Objects:**
  - `pages/HomePage.ts`: Reusable header trigger `loginButton` (`button[data-qa-id="hd-login"]`), user profile trigger `userProfileAvatar`.
  - `pages/LoginPage.ts`: Email input `input[data-qa-id="input-email"]`, password input `input[data-qa-id="input-password"]`, submit button `button[data-qa-id="btn-save"]`, error alert container `[data-qa-id="alert-error"]`.
  - `pages/ProfileMenu.ts` *(New Component)*: Profile drawer popover, logout button `button:has-text("Keluar")`.

#### 3. Step-by-Step Implementation Strategy
1. **`LGN-004` & `LGN-005` (Guest Baseline - Already Automated):**
   - Test guest homepage access and ensure submit button disabled attribute is validated via `{ force: true }` click simulation.
2. **`LGN-001`, `LGN-002`, `LGN-003` (Form Interactions & Validation Feedback):**
   - Implement `LoginPage.fillCredentials(email, password)` and trigger submit.
   - Assert presence of `alert` popup *"email atau password salah"* for `LGN-002` and `LGN-003`.
   - For `LGN-001`, document Turnstile token bypass / mock token injection to allow full automated verification of post-login state (profile photo rendering).
3. **`LGN-006` (Session Invalidation / Logout):**
   - Implement Playwright authentication setup fixture (`playwright/.auth/user.json`) storing active cookies and localStorage session keys.
   - Test navigates with pre-authenticated state $\rightarrow$ clicks profile avatar $\rightarrow$ clicks `Keluar` $\rightarrow$ verifies session cookie removal and header button reverts to `Masuk`.

#### 4. Assertions & Verification Plan
- `await expect(page).toHaveURL('https://kumparan.com/login')`
- `await expect(loginPage.submitButton).toBeDisabled()`
- `await expect(page.locator('text=/email atau password salah/i')).toBeVisible()`
- `await expect(homePage.loginButton).toBeVisible()`

#### 5. Phase Verification Command
```powershell
npx playwright test tests/auth.spec.ts --project=chromium
```

---

### Phase 2: Global Navigation & Routing Resilience (`NAV`)

#### 1. Objective & Scope
Automate desktop channel navigation, highlighted story feeds, direct URL transitions, and 404 page error handling (`NAV-001` through `NAV-004`).

#### 2. Page Object Model Requirements
- **Target Page Objects:**
  - `pages/HomePage.ts`: Reuse `channelNavigation` (`nav[data-qa-id="main-menu"]`), highlighted submenu (`nav[data-qa-id="sub-menu"]`).
  - `pages/ChannelPage.ts`: Reuse `channelTitle` (`h1[data-qa-id="channel-title"]`), `channelArticles`.
  - `pages/NotFoundPage.ts` *(New Component)*: Container `div[data-qa-id="not-found"]`, error headline text *"Halaman tidak Ditemukan"*.

#### 3. Step-by-Step Implementation Strategy
1. **`NAV-001` (Channel Navigation):**
   - Call `homePage.navigateToChannel('Tekno')`.
   - Assert URL changes to `/\/channel\/tekno$/`.
   - Assert `channelPage.channelTitle` is visible with text `'Tekno'`.
2. **`NAV-002` (Highlighted Sub-Menu Navigation):**
   - Add `homePage.clickHighlightedMenu('Breaking News')`.
   - Assert URL changes to `/\/breakingnews$/`.
   - Assert feed articles load with positive count.
3. **`NAV-003` (Direct Deep Linking):**
   - Call `page.goto('https://kumparan.com/trending')`.
   - Assert title, URL, and trending article list rendered.
4. **`NAV-004` (Invalid Route 404 Handling):**
   - Call `page.goto('https://kumparan.com/trendingssds')`.
   - Assert 404 container is visible and renders expected text *"Halaman tidak Ditemukan"*.

#### 4. Assertions & Verification Plan
- Web-first assertions with `{ timeout: 15000 }` to absorb Next.js dynamic route chunking.
- Explicit non-empty assertions on channel headlines and feeds.

#### 5. Phase Verification Command
```powershell
npx playwright test tests/navigation.spec.ts --project=chromium
```

---

### Phase 3: Search Engine & Input Limits (`SRC`)

#### 1. Objective & Scope
Automate keyword search, autocomplete suggestions, clear search actions, and special symbol query regression tracking (`SRC-001` through `SRC-003`).

#### 2. Page Object Model Requirements
- **Target Page Objects:**
  - `pages/HomePage.ts`: Search input trigger `clickSearchInput()`.
  - `pages/SearchPage.ts`: Search input `input[data-qa-id="input-search"]`, suggestion list `[data-qa-id="search-suggestion-item"]`, clear button `[data-qa-id="btn-clear-search"]` (or SVG clear icon), result cards `[data-qa-id="story-result-card"]`, popular search container `[data-qa-id="popular-search-section"]`, empty state container `[data-qa-id="story-not-found"]`.

#### 3. Step-by-Step Implementation Strategy
1. **`SRC-001` (Keyword Search with Autocomplete):**
   - Type `"penyadapan"` into `searchInput`.
   - Assert autocomplete suggestion list is rendered containing `"penyadapan"`.
   - Submit via `Enter`. Assert URL `/search/penyadapan` and verify result card titles contain query substring (case-insensitive).
2. **`SRC-002` (Clear Search Action):**
   - After executing search, click clear icon.
   - Assert search input value reverts to `""`.
   - Assert `popularSearchSection` is restored on page.
3. **`SRC-003` (Symbol Query Bug Regression Test):**
   - Submit `"$%^&*"`.
   - Expected behavior per requirements: Empty state rendered (`"Story tidak ditemukan"`).
   - Defect Regression Check: Assert whether system fails by rendering unfiltered stories (assert against known bug [Google Docs Report](https://docs.google.com/document/d/1dGLF-Vd7Zgjdm9ZJ9JtJwmvvIHKxEE7CPjvNK7qVaUU/edit?usp=sharing)).

#### 4. Assertions & Verification Plan
- `await expect(searchPage.resultCards.first()).toBeVisible({ timeout: 15000 })`
- `await expect(searchPage.popularSearchSection).toBeVisible()`
- Negative assertion asserting absent or present empty feedback.

#### 5. Phase Verification Command
```powershell
npx playwright test tests/search.spec.ts --project=chromium
```

---

### Phase 4: Article & Engagement Drawer (`ATC`)

#### 1. Objective & Scope
Automate editorial article reading, breadcrumb navigation, comment drawer authorization gate, and news polling authorization gate (`ATC-001` through `ATC-005`).

#### 2. Page Object Model Requirements
- **Target Page Objects:**
  - `pages/ArticlePage.ts`: Reusable breadcrumbs `homeBreadcrumb`, `channelBreadcrumb`, story headline `storyTitle`.
  - `pages/CommentDrawer.ts` *(New Component)*: Comment icon trigger `button[data-qa-id="btn-comment"]`, comment input `textarea[data-qa-id="input-comment"]`, send button `button[data-qa-id="btn-send-comment"]`.
  - `pages/PollingWidget.ts` *(New Component)*: Polling container `[data-qa-id="polling-section"]`, option buttons `button[data-qa-id="polling-option"]`, percentage results `[data-qa-id="polling-percentage"]`.

#### 3. Step-by-Step Implementation Strategy
1. **`ATC-001` (Detail Article & Breadcrumb Navigation - Baseline):**
   - Open first editorial article from homepage.
   - Assert breadcrumbs hierarchy: `Beranda > <Channel>`.
2. **`ATC-003` (Unauthenticated Comment Barrier):**
   - Click comment icon beneath title in unauthenticated session.
   - Type `"lorem ipsum bla bla bla"` and click send.
   - Assert user is immediately redirected to `https://kumparan.com/login`.
3. **`ATC-005` (Unauthenticated Polling Barrier):**
   - Scroll down to polling section on homepage in unauthenticated session.
   - Click top polling option.
   - Assert vote is blocked and user is redirected to `https://kumparan.com/login`.
4. **`ATC-002` & `ATC-004` (Authenticated Engagement via `storageState`):**
   - Load browser with authenticated storage state.
   - `ATC-002`: Submit comment and verify comment item renders in feed.
   - `ATC-004`: Click poll option and verify UI transitions to display percentage breakdown.

#### 4. Assertions & Verification Plan
- `await expect(articlePage.channelBreadcrumb).toBeVisible({ timeout: 15000 })`
- `await expect(page).toHaveURL(/login/)` (for unauthenticated guards).
- Web-first polling assertions for vote tally update.

#### 5. Phase Verification Command
```powershell
npx playwright test tests/article.spec.ts --project=chromium
```

---

### Phase 5: Creator Studio & Article Submission (`SBA`) — Desktop Exclusive

#### 1. Objective & Scope
Automate article drafting form boundary checks (200-character description limit) and draft article deletion workflow in "My Content" (`SBA-001`, `SBA-002`).

#### 2. Page Object Model Requirements
- **Target Page Objects:**
  - `pages/HomePage.ts`: Creator trigger button `button[data-qa-id="hd-create-story"]` ("Buat Tulisan").
  - `pages/StoryEditorPage.ts` *(New Component)*: Story title input `input[data-qa-id="story-title-input"]`, story body editor, right-side settings panel, description input `textarea[data-qa-id="input-description"]`, character counter `[data-qa-id="char-counter"]`.
  - `pages/MyContentPage.ts` *(New Component)*: Drafts tab `[data-qa-id="tab-drafts"]`, draft list cards `[data-qa-id="draft-card"]`, delete button `button[data-qa-id="btn-delete-draft"]`, confirmation modal `[data-qa-id="modal-confirm"]`, modal confirm button `button[data-qa-id="btn-confirm-yes"]`.

#### 3. Step-by-Step Implementation Strategy
1. **Pre-requisite / Fixture:**
   - Requires authenticated creator account session via `storageState`.
2. **`SBA-001` (Description 200-Character Maximum Boundary):**
   - Click `Buat Tulisan` $\rightarrow$ navigate to story editor.
   - Generate test payload with 250 characters.
   - Type/paste into description textarea.
   - Assert that input value length is strictly truncated at 200 characters (`expect(val.length).toBe(200)`).
3. **`SBA-002` (Draft Deletion & Counter Synchronization):**
   - Ensure at least one test draft exists in "My Content" $\rightarrow$ drafts tab.
   - Read initial total draft count.
   - Click `Hapus` on first draft card $\rightarrow$ assert modal confirmation appears.
   - Click `Yes` in modal.
   - Assert draft is removed from DOM and total draft count decrements by 1 (or track failure against known bug [Google Docs Report](https://docs.google.com/document/d/1TQfomyUrwHRHR4TbixI-Dimon_ZfBIDfFUkSZjAHRzY/edit?usp=sharing)).

#### 4. Assertions & Verification Plan
- `expect(await editorPage.descriptionInput.inputValue()).toHaveLength(200)`
- `await expect(myContentPage.confirmModal).toBeVisible()`
- `await expect(myContentPage.draftCards).toHaveCount(initialCount - 1)`

#### 5. Phase Verification Command
```powershell
npx playwright test tests/submit-article.spec.ts --project=chromium
```


