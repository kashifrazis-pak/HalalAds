# Islamic Ad Network — Testing Guide

## Overview

Islamic Ad Network uses a three-layer testing strategy to ensure quality across every environment:

| Layer | Framework | Location | Coverage target |
|---|---|---|---|
| Unit | Jest + ts-jest | `apps/web/__tests__/unit/` | All lib functions and API routes |
| Component | Jest + React Testing Library | `apps/web/__tests__/components/` | All shared UI components |
| Integration | Jest | `apps/web/__tests__/integration/` | API route request/response cycles |
| E2E | Playwright | `apps/web/e2e/` | All critical user journeys |

---

## Running Tests Locally

All commands run from `apps/web/`.

```bash
cd apps/web

# Unit + component + integration tests (single run)
npm test

# Watch mode (reruns on file change)
npm run test:watch

# With coverage report
npm run test:coverage

# CI mode (no watch, coverage enforced, fails on threshold breach)
npm run test:ci

# E2E tests (requires running server on port 3001)
npm run dev &          # or: npm start
npm run test:e2e

# E2E with browser UI
npm run test:e2e:ui

# E2E with visible browser
npm run test:e2e:headed

# View last E2E HTML report
npm run test:e2e:report

# Full suite (unit CI + E2E)
npm run test:all
```

### Required environment variables for tests

Unit and integration tests do not need real credentials. For E2E tests, set these in `.env.local`:

```
NEXTAUTH_SECRET=any-local-secret
NEXTAUTH_URL=http://localhost:3001
```

---

## Test Case Catalogue

### Unit Tests — `__tests__/unit/`

#### `utils.test.ts` — `lib/utils.ts` · `cn()` class name merger
| ID | Description | Expected |
|---|---|---|
| TC-U-001 | Merges simple class strings | `"foo bar"` |
| TC-U-002 | Deduplicates conflicting Tailwind classes | Last wins: `"bg-green-500"` |
| TC-U-003 | Handles conditional classes via clsx | Falsy values excluded |
| TC-U-004 | Handles undefined and null gracefully | Ignored |
| TC-U-005 | Object syntax from clsx | Only truthy keys included |
| TC-U-006 | Empty input returns empty string | `""` |
| TC-U-007 | Merges padding conflicts correctly | `"py-2 px-8"` |

#### `blog.test.ts` — `lib/blog.ts`
| ID | Description | Expected |
|---|---|---|
| TC-U-010 | `getAllPosts()` returns an array | `Array.isArray` is true |
| TC-U-011 | Each post has required frontmatter fields | slug, title, description, date, author, category, readTime |
| TC-U-012 | Posts sorted newest first | Dates descending |
| TC-U-013 | At least 2 seeded posts exist | `length >= 2` |
| TC-U-014 | `getPost(slug)` returns full content | content field truthy |
| TC-U-015 | `getPost()` returns null for unknown slug | `null` |
| TC-U-016 | Returned post has all metadata fields | title, description, category |

#### `api-waitlist.test.ts` — `POST /api/waitlist`
| ID | Description | Expected |
|---|---|---|
| TC-U-020 | Valid advertiser payload | 201, `success: true` |
| TC-U-021 | Valid publisher payload | 201 |
| TC-U-022 | Missing name | 400 |
| TC-U-023 | Missing email | 400 |
| TC-U-024 | Missing type | 400 |
| TC-U-025 | Invalid email format | 400 |
| TC-U-026 | Content-Type header | `application/json` |

#### `api-tracking.test.ts` — `GET /api/track/impression` and `GET /api/track/click`
| ID | Description | Expected |
|---|---|---|
| TC-U-030 | Valid impression request | 200, `image/gif` |
| TC-U-031 | Missing aid or pub | 204 |
| TC-U-032 | No-cache headers set | `no-store` in Cache-Control |
| TC-U-033 | CORS header present | `access-control-allow-origin: *` |
| TC-U-034 | Click redirect with UTM params | 302, utm_source=islamicadnetwork, utm_medium=display |
| TC-U-035 | Click with missing URL | 302 (fallback home) |
| TC-U-036 | Click with invalid URL | 302 (fallback home) |

---

### Component Tests — `__tests__/components/`

#### `StatCard.test.tsx`
| ID | Description | Expected |
|---|---|---|
| TC-C-001 | Renders label and value | Both visible |
| TC-C-002 | Renders positive change indicator | Change % visible |
| TC-C-003 | Renders negative change indicator | Change % visible in red |
| TC-C-004 | Renders without change prop | No change element |
| TC-C-005 | Default icon color is green | `.bg-brand-green/10` class present |
| TC-C-006 | Gold icon color when specified | `.bg-brand-gold/10` class present |

#### `Navbar.test.tsx`
| ID | Description | Expected |
|---|---|---|
| TC-C-010 | Brand name renders | "Ads" visible |
| TC-C-011 | All nav links rendered | Advertisers, Publishers, Pricing, About, Blog |
| TC-C-012 | Get Started CTA present | Link to `/waitlist` |
| TC-C-013 | Sign in link present | Link to `/login` |
| TC-C-014 | Mobile menu toggle exists | aria-label="Toggle menu" |
| TC-C-015 | Mobile menu opens on click | Duplicate nav links appear |
| TC-C-016 | Mobile menu closes after link click | Single nav link visible again |

#### `WaitlistSection.test.tsx`
| ID | Description | Expected |
|---|---|---|
| TC-C-020 | Heading and button rendered | "Join the Waitlist" visible |
| TC-C-021 | Advertiser tab active by default | `bg-brand-green` class on advertiser button |
| TC-C-022 | Publisher tab switch works | Publisher tab gets active class |
| TC-C-023 | Name and email inputs present | Placeholder text visible |
| TC-C-024 | Submit button enabled | Not disabled |
| TC-C-025 | Loading indicator during submission | "Joining…" visible |
| TC-C-026 | Success state after submission | "You're on the list!" visible |
| TC-C-027 | Success message mentions social follow | LinkedIn/Twitter mention |

---

### Integration Tests — `__tests__/integration/`

#### `waitlist-api.test.ts`
| ID | Description | Expected |
|---|---|---|
| TC-I-001 | Full advertiser signup | 201, `{success: true, message: string}` |
| TC-I-002 | Full publisher signup | 201 |
| TC-I-003 | CORS header present | `*` |
| TC-I-004 | Missing name → error field | 400, `{error: string}` |
| TC-I-005 | Missing email | 400 |
| TC-I-006 | Invalid email format | 400 |
| TC-I-007 | Missing type | 400 |
| TC-I-008 | Content-Type header | `application/json` |

#### `tracking-api.test.ts`
| ID | Description | Expected |
|---|---|---|
| TC-I-010 | Valid impression — binary GIF returned | 200, non-empty body |
| TC-I-011 | GIF magic bytes (GIF89a) present | bytes 0–2 = `G`, `I`, `F` |
| TC-I-012 | Missing aid → 204 | 204 |
| TC-I-013 | Missing pub → 204 | 204 |
| TC-I-014 | Cache-Control includes no-store | Header set |
| TC-I-015 | CORS header present | `access-control-allow-origin: *` |
| TC-I-016 | Click with URL → 302 with all UTM params | utm_source, utm_medium, utm_campaign |
| TC-I-017 | Click without URL → 302 fallback | Redirects to home |
| TC-I-018 | Click with invalid URL → 302 fallback | No invalid URL in location header |

---

### E2E Tests — `e2e/`

#### `homepage.spec.ts`
| ID | Description | Expected |
|---|---|---|
| TC-E-001 | Page loads successfully | h1 visible |
| TC-E-002 | Hero contains "1.8 Billion" | Text visible |
| TC-E-003 | Navbar visible with brand | "Ads" text visible |
| TC-E-004 | Nav link to Advertisers works | URL contains `/advertisers` |
| TC-E-005 | Get Started navigates to waitlist | URL contains `/waitlist` |
| TC-E-006 | Page title contains Islamic Ad Network | `<title>` matches |
| TC-E-007 | Footer is visible | `<footer>` in DOM |
| TC-E-008 | No console errors on load | Zero error-level console logs |

#### `navigation.spec.ts`
| ID | Description |
|---|---|
| TC-E-010–016 | All public pages (`/`, `/advertisers`, `/publishers`, `/pricing`, `/about`, `/blog`, `/waitlist`) load with status < 400 |
| TC-E-017 | 404 for unknown route |

#### `waitlist.spec.ts`
| ID | Description | Expected |
|---|---|---|
| TC-E-020 | Waitlist page renders form | Heading visible |
| TC-E-021 | Advertiser tab default | Tab visible |
| TC-E-022 | Switch to publisher tab | Placeholder changes |
| TC-E-023 | Empty submit shows validation | Form still visible |
| TC-E-024 | Valid submission shows success | "You're on the list!" |
| TC-E-025 | Loading indicator appears | "Joining…" text |
| TC-E-026 | Success state hides form fields | Email input gone |

#### `blog.spec.ts`
| ID | Description | Expected |
|---|---|---|
| TC-E-030 | Blog index loads | Heading visible |
| TC-E-031 | Post cards visible | At least one link |
| TC-E-032 | Clicking post navigates | URL changes to post slug |
| TC-E-033 | Article renders content | `<article>` visible |
| TC-E-034 | Article has page title | title.length > 5 |
| TC-E-035 | Non-existent post → 404 | HTTP 404 |
| TC-E-036 | Blog links are valid slugs | Count ≥ 1 |

#### `auth.spec.ts`
| ID | Description | Expected |
|---|---|---|
| TC-E-040 | Sign-in page loads | Heading visible |
| TC-E-041 | Google OAuth button present | Button with "Google" text |
| TC-E-042 | Magic link email input present | Input visible |
| TC-E-043 | `/dashboard/advertiser` redirects to sign-in | URL contains `/auth/signin` |
| TC-E-044 | `/dashboard/publisher` redirects to sign-in | URL contains `/auth/signin` |
| TC-E-045 | Sign-in page title | Contains "Islamic Ad Network" |

#### `api-tracking.spec.ts`
| ID | Description | Expected |
|---|---|---|
| TC-E-050 | Impression pixel returns GIF | 200, `image/gif` |
| TC-E-051 | Missing params → 204 | 204 |
| TC-E-052 | No-store cache header | Header present |
| TC-E-053 | Click redirect with UTM | 302, utm_source in location |
| TC-E-054 | Click without URL → 302 | 302 |

---

## CI/CD Pipelines

### `ci.yml` — PR Checks (triggers on every PR)

| Job | What it does | Fails on |
|---|---|---|
| `lint-typecheck` | ESLint + TypeScript `tsc --noEmit` | Any lint error or type error |
| `unit-tests` | Jest unit + component + integration with coverage | Test failure OR coverage below 60% threshold |
| `build` | `next build` with placeholder env vars | Build error |

PRs **cannot merge** until all three jobs pass.

### `release.yml` — Release Gate (triggers on push to `main`)

| Job | What it does |
|---|---|
| `lint-typecheck` | Same as CI |
| `unit-tests` | Full Jest suite with coverage artifact upload |
| `e2e-tests` | Playwright (chromium + mobile) against a built app |
| `docker-build` | Verifies multi-stage Docker build succeeds |
| `release-summary` | Fails the workflow if any prior job failed |

The `release-summary` job acts as a **release gate** — no deployment should proceed unless all jobs pass.

### Coverage Thresholds

Enforced in `jest.config.ts` `coverageThreshold`:

| Metric | Minimum |
|---|---|
| Branches | 60% |
| Functions | 60% |
| Lines | 60% |
| Statements | 60% |

These thresholds increase as the codebase matures. Target for launch readiness: **80%**.

---

## Adding New Tests

### Naming convention

- Unit tests: `__tests__/unit/<module>.test.ts`
- Component tests: `__tests__/components/<ComponentName>.test.tsx`
- Integration tests: `__tests__/integration/<feature>.test.ts`
- E2E tests: `e2e/<feature>.spec.ts`

### Test ID convention

Test IDs are prefixed by type and numbered sequentially:
- `TC-U-xxx` — unit
- `TC-C-xxx` — component
- `TC-I-xxx` — integration
- `TC-E-xxx` — E2E

IDs are written in `it()`/`test()` descriptions for full traceability.

### Mocking strategy

- `next/navigation`, `next/headers`, `next-auth/react`, and `@/lib/auth` are globally mocked in `jest.setup.ts`
- `framer-motion` is mocked in component tests to disable animations
- API routes are tested by calling the route handler directly (no network) — no mocking needed
- E2E tests run against a real running server (no mocking)
