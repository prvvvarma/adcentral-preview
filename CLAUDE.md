# AdCentral Website — Project Handoff / Context

> Single source of truth for continuing this build in a new session.
> Last updated after commit `f954b83`. **Partners, ADCL, and Help Center pages are now built**, the nav has premium icon tiles, and the home hero is an auto-rotating carousel. See **§14 (latest work)** for everything done since the original handoff — it supersedes older sections where they conflict.
> ⚠️ **Environment note:** the shell is now **Windows PowerShell** (not git-bash). The git-bash splice recipe in §3 is superseded by the PowerShell recipe in §14.

---

## 1. What this project is

A static marketing website for **AdCentral** — a Digital-Out-Of-Home (DOOH) advertising marketplace that connects advertisers' campaigns to real-world venue screens. Live first in the **UAE**, built to scale to more countries.

- **Project root:** `D:\Ad Central\Website`
- **Stack:** Plain static HTML files. **No build step, no framework, no dependencies.** Each page is a single self-contained `.html` file with an inline `<style>` block and inline `<script>`. Three.js (for the 3D page) is loaded via CDN importmap.
- **GitHub repo:** `https://github.com/prvvvarma/adcentral-preview` (branch `main`)
- **Live (GitHub Pages):** `https://prvvvarma.github.io/adcentral-preview/`
  - Pages serves from `main` / root. Rebuilds take ~1–2 min after a push. (A "404" right after pushing a new page is usually just propagation delay.)

---

## 2. Pages (files) and their roles

| File | Role | Theme |
|---|---|---|
| `index.html` | **Entry page** — cinematic 3D scroll experience (Three.js city → AdCentral node lights up screens). Funnels to `home.html` via "Explore AdCentral". | Dark (its own self-contained design, NOT the shared system) |
| `home.html` | **Main dark homepage** — full marketing story (hero, personas, how-it-works, reporting, network snapshot, resources, footer). WebGL aurora background. | Dark (shared design system) |
| `home-light.html` | Light-theme variant of the homepage. Kept in sync for links but **dark is the active/primary theme**. | Light |
| `advertisers.html` | Advertisers sub-page. | Dark (shared system) |
| `screen-owners.html` | Screen Owners sub-page. | Dark (shared system) |
| `partners.html` | **Partners page (BUILT).** Hero network node, Who/Ways/Why+Fit two-column, optional ADCL + FAQ. | Dark (shared system) |
| `adcl.html` | **ADCL page (BUILT).** Renamed from `adcl-holders.html`. Litepaper-v1.6-aligned; single "Read ADCL Docs" CTA. | Dark (shared system) |
| `help.html` | **Help Center (BUILT).** Simple support **routing page** (WhatsApp / call / contact form + FAQ deep-links). | Dark (shared system) |

> All sub-pages now carry **premium nav icon tiles** and the **footer columns mirror the nav menus** (see §5 + §14).

**Page renaming history (already done):** originally `3d.html`→`index.html`, `dark.html`→`home.html`, old `index.html`→`home-light.html`. All internal links already updated.

---

## 3. How to build a new sub-page (THE PATTERN — use this for Partners)

The advertisers and screen-owners pages were built by **copying an existing dark sub-page and replacing the `<main>` content**. This guarantees the header, footer, nav, CSS design system, and JS all stay identical/aligned.

**Recommended for Partners:**
1. `cp screen-owners.html partners.html` (it's the cleanest, most up-to-date shell).
2. Update `<title>` → `Partners — AdCentral`.
3. In the **nav dropdown** + **mobile nav**: set Partners `class="active"`, fix the other links.
4. Replace everything between `<main>` and `</main>` with the new Partners sections.
5. Update the **footer** Solutions list if needed (Partners link → `partners.html`).
6. Add any Partners-specific CSS inside the existing `<style>` block (near the "SCREEN-OWNER HELPERS" area).
7. **Link `partners.html` everywhere** (see §8).

**Splicing large `<main>` content reliably (Windows/git-bash gotchas):**
- Python is NOT available. `/tmp` from the Write tool is NOT visible to git-bash.
- To replace a big block: `Write` the new main HTML to a **project-local** temp file (e.g. `D:\Ad Central\Website\_main.tmp`), then splice with:
  ```bash
  head -n <lineBeforeMain> file.html > _head.tmp
  tail -n +<lineAfterMain> file.html > _tail.tmp
  cat _head.tmp _main.tmp _tail.tmp > file.html
  rm _head.tmp _tail.tmp _main.tmp
  ```
- Heredocs with apostrophes in content can break; prefer the Write tool for content.
- `perl` IS available (used it for em-dash replacement and path rewrites).

---

## 4. Design system (shared across home/advertisers/screen-owners — and partners)

Fonts (Google Fonts): **Inter** (body) + **Plus Jakarta Sans** (headings).

### Design tokens (`:root`) — DARK theme
```css
--red:#F5365C; --red-dark:#D91F47; --red-tint:rgba(245,54,92,0.14); --red-tint-2:rgba(245,54,92,0.28);
--ink:#F0F2F8; --ink-2:#D8DCE8; --body:#A8B0C4; --muted:#6B7590; --subtle:#454D62;
--hairline:rgba(255,255,255,0.09);
--surface-1:#141828; --surface-2:#1A1F30; --white:#111520;
--ph-bg:#1A1F30; --ph-border:#2E3448; --ph-line:#252A3C; --ph-label:#6B7590; --ph-chip-bg:rgba(255,255,255,.06);
--text-xs:.72rem … --text-5xl:3.5rem;   /* xs sm base(.9375) md(1) lg(1.125) xl(1.3) 2xl 3xl 4xl 5xl */
--sp-1:4px … --sp-24:96px;               /* 4px scale: 1,2,3,4,5,6,7,8,10,12,14,16,20,24 */
--r-sm:8px --r-md:12px --r-lg:16px --r-xl:22px --r-2xl:28px;
--container:1200px; --gutter:24px;
--glass-bg:rgba(255,255,255,0.055); --glass-border:rgba(255,255,255,0.11);
--glass-blur:blur(26px) saturate(2.0);
--glass-shadow:0 8px 42px rgba(0,0,0,.58), 0 2px 14px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.09);
--ease-spring:cubic-bezier(.34,1.46,.64,1); --ease-out:cubic-bezier(.22,1,.36,1);
```
- `body { background: transparent }` — the page relies on a fixed **WebGL aurora canvas** `<canvas id="heroWave">` for the dark gradient background.
- Brand red accent: **#F5365C** (sometimes referenced as #FF3355 on the 3D page).

### Reusable layout/utility classes (already defined in the shared `<style>`)
- **Layout:** `.wrap` (max 1200px centered), `.section` (96px y-padding), `.section-off` / `.section-off2` (subtle bg tints), `.section-sm`, `.center`.
- **Type:** `h1`/`h2`/`h3`/`h4`, `.lead`, `.body-sm`, `.eyebrow` (+ `.eyebrow-dot`), `.accent` (red gradient text), `.section-header` (+ `.center`).
- **Buttons:** `.btn` + `.btn-md`/`.btn-lg` + `.btn-primary` (red gradient) / `.btn-secondary` (glass) / `.btn-ghost-brand` / `.btn-outline-ink`.
- **Placeholders (wireframe boxes):** `.ph` + `.ph-169` (16:9) / `.ph-43` (4:3), inner `.ph-inner` > `.ph-icon` + `.ph-name` + `.ph-dim`.
- **Nav:** `.site-nav` (sticky, `rgb(10,10,22)`, `.scrolled` glass), `.nav-inner`, `.nav-links`, `.nav-item`, `.nav-btn`, `.nav-dropdown` (+ `a.active`), `.nav-right`, `.nav-link-plain`, `.nav-burger`, `.mobile-nav` (+ `.mobile-group`/`.mobile-acc`/`.mobile-links`/`.mobile-actions`).
- **Footer:** `.footer` (transparent bg), `.footer-grid`, `.footer-brand`, `.social-row`/`.social-btn`, `.footer-col`, `.footer-bottom`, `.footer-legal`.
- **Scroll reveal:** add class `sr` (and optional `sr-d1`…`sr-d4` for stagger) to any element; an IntersectionObserver adds `.in` to fade/slide it up. **All animated content needs `sr`.**
- **Split grids:** `.opening-split` (hero 2-col), `.gate-grid` (1fr/1.2fr split), `.pf-grid` (0.92fr/1.08fr — used for "card left + FAQ right" merged section), `.uae-grid`.
- **Cards / components reusable for Partners:**
  - `.cmp-list` > `.cmp-item` (icon + `.cmp-info`(`.cmp-name`+`.cmp-tag`) + optional `.cmp-price`) — compact list (used for "Who it's for" / "Who can join").
  - `.who-block` + `.who-label` — labeled compact list block.
  - `.vcard` (premium glass card: `.vcard-icon`+h4+p) in a `.duo` 2-col grid.
  - `.trio` — 3-col responsive card grid; `.brand-tag` (icon+title+`.brand-tag-desc`) cards.
  - `.campaign-rows`/`.campaign-row` — full-width list rows (`.cr-identity`+`.cr-icon`+`.cr-name`, `.cr-desc`, `.cr-price`).
  - `.steps-row` + `.step-h` (`.step-h-num`+h4+p) — horizontal numbered steps (used in screen-owners How-It-Works).
  - `.partner-card` (glass spotlight card: `.partner-eyebrow`, h3, `.lead`, `.partner-fine` for legal text — **use `--body` color for fine print so it's readable**) + `.partner-actions`.
  - `.faq-list` > `.faq-item` > `.faq-btn`(+`.faq-chevron`) + `.faq-body`>`.faq-inner`>p — accordion (JS: one-open-at-a-time).
  - `.final-cta-card`/`.final-cta-inner`/`.final-cta-actions` — centered CTA card (note: final CTA sections were REMOVED from advertisers & screen-owners per user request — see §7).
  - `.device-grid`/`.device-card` — image gallery grid (used for dark device images).
  - `.dev-note` — amber dashed "developer note" callout (see §6).
- **Inline JS (bottom of each page):** desktop dropdown, mobile hamburger accordion, ESC handler, **WebGL aurora background** (`#heroWave`), nav scroll-shadow, scroll-reveal observer, **FAQ accordion**. Copying the shell carries all of this.

### Responsive breakpoints used
`@media (max-width:1024px)`, `960px`, `640px`, `420px`. Split grids collapse to 1 col at 960; nav switches to hamburger at 640. When adding a new multi-col grid, add its collapse rule to these blocks.

---

## 5. Header & footer (must stay identical across all dark pages)

- **Logo (all pages):** `assets/images/home/adcentral_logo_transperant.png` — nav `height="41"`, footer `height="37"`. ⚠️ Filename has an **intentional typo**: "transperant" (not "transparent"). Logo links to `home.html`.
- **Nav dropdowns (CURRENT — updated):**
  - **Solutions:** Advertisers (`advertisers.html`) / Screen Owners (`screen-owners.html`) / Partners (`partners.html`)
  - **Resources:** ADCL (`adcl.html`) / Docs (with external-link **SVG icon**, opens GitBook in a **new tab**) / Help Center (`help.html`)
  - **About:** About AdCentral / Team / Contact (all `#` or `#footer` placeholders)
  - Login + "Book a Demo" on the right (still `#` placeholders).
  - **Every dropdown + mobile menu item has a premium icon tile** (`.nav-ico`: 30px rounded tile + 15px line SVG; tile turns red on hover and on the active item). See §14 for the icon set and the home/home-light CSS caveat.
- **Footer (CURRENT — now mirrors the nav):** brand blurb + 5 social SVG buttons (X, Telegram, Discord, LinkedIn, Medium), then **Solutions / Resources / About** columns (was "Company"):
  - Solutions: Advertisers / Screen Owners / Partners
  - Resources: ADCL / Docs (external icon, new tab) / Help Center
  - About: About AdCentral / Team / Contact
  - Privacy Policy + Terms live only in the **footer-bottom legal row**. Footer is **transparent bg** with glow-on-hover social buttons.
- **Mobile nav** uses dark glass: `.mobile-group { background: rgba(10,8,26,0.92) }`, light-on-dark text.
- ⚠️ **home.html / home-light.html have their own (different) nav CSS** — they were built separately from the shared shell, so bulk CSS edits keyed on the shell's exact strings can silently miss them. Always verify those two pages after any nav/footer CSS change.

---

## 6. Conventions & rules (IMPORTANT — keep consistent)

- **No em-dashes.** Use hyphens `-`. (All em-dashes were already replaced site-wide.)
- **Dev notes:** wherever values are placeholders (pricing, network stats, dashboards, category controls, payouts, eligibility), add an HTML `<!-- ⚠️ DEV NOTE: ... -->` comment AND, where shown on screen, a visible amber `.dev-note` callout telling the developer to wire it to the backend. Never hardcode final production values.
- **CTA route conventions (placeholders for the dev):**
  - Advertiser login: `/login?role=advertiser&next=/advertiser/venues`
  - Screen owner connect: `/login?role=screen-owner&next=/screen-owner/screens/new`
  - Book a Demo / generic Login currently point to `#` (placeholders).
- **Simple language.** Avoid jargon: no DOOH/CTR/CPC/clicks/conversions/APY/staking/wallet/epoch language on public pages. ADCL is mentioned only as an *optional, eligibility-based, not-guaranteed* participation option.
- **Image placeholders** use the `.ph` wireframe boxes until real images are provided.
- **Every new section/element that should animate in needs the `sr` class.**

---

## 7. Section structure of the existing sub-pages (reference for Partners)

**advertisers.html** (after all edits):
1. Hero (`.opening-split`): left intro ("Live in the UAE. Built to scale globally.") + right "Who it's for" `.cmp-list` (Local Businesses / Growing Brands / Multi-location Brands / Agencies & Media Buyers / Monthly Advertisers).
2. UAE Network Preview (`.uae-grid`): 6 stat cards (placeholders + dev note) + real image `assets/images/advertisers/UAE Network.png` + a login nudge.
3. Partnership (left) + FAQ (right) merged in one `.pf-grid` section. (Eyebrow "Advertiser Partnership".)
   - (Final CTA section was **removed**.)

**screen-owners.html** (most recent, best reference):
1. Hero (`.opening-split`): left "Connect your screen. Keep control." + right "Who can join?" `.cmp-list` (7 venue types). Badge: "Live in the UAE · More countries coming".
2. **Why Join + Venue Control** (merged): centered header + two `.vcard`s (Earn from approved ads / Track activity) in `.duo`, then a `.gate-grid` split — copy+examples (left) + a **designed CSS "Category Controls" panel** (`.ctrl-panel` with allowed/blocked chips + toggle) on the right (replaced an image placeholder).
3. **How It Works**: horizontal `.steps-row` (4 numbered `.step-h`) + a dark device gallery `.device-grid` of 6 `assets/images/Screen Owners/*_Dark.png` cards (SmartTV, VideoWall, IndoorSignage, OutdoorSignage, Tablet, InVehicle).
4. **Optional ADCL + FAQ** (merged in `.pf-grid`): ADCL `.partner-card` (left, sticky) + FAQ accordion (right). 8 FAQs.
   - (Final CTA section **removed**.)

> Pattern users like: **merged two-column sections** (a card/spotlight on the left, FAQ or supporting content on the right) and **premium glass cards** over plain placeholders. They removed standalone final-CTA sections and prefer leaner pages. They like real designed components (e.g. the CSS category-control panel, the dark device gallery) instead of grey placeholders when assets exist.

---

## 8. Cross-page linking checklist (do this for Partners too)

When Partners page is built, update the "Partners" link (currently `#` or `#personas`) → `partners.html` in **every** page:
- `home.html`: nav dropdown, mobile nav, persona card button (convert `<button>`→`<a>` like Advertisers/Screen Owners), footer Solutions.
- `home-light.html`: same spots.
- `advertisers.html` & `screen-owners.html`: nav dropdown, mobile nav, footer Solutions.
- Set `class="active"` on the Partners nav entry **within** partners.html.
- `index.html` (3D) audience list is **not** linked (it funnels to home.html) — leave as-is.

Grep helper: `grep -rn "Partners" *.html`

---

## 9. Images

All under `assets/images/` with **three subfolders**:
- `home/` — logos + homepage/persona/flow/dashboard images (e.g. `adcentral_logo_transperant.png`, `logo.png`, `log-small.png`, `hero.png`, `AdcentralMarketplace.png`, `Advertiser Flow.png`, `Screen Owner FLow.png`, `Advertisers.png`, `Screen Owners.png`, `Partners.png`, `Campagin Dashboard.png`).
- `advertisers/` — `Advertiser Platform Preview.png`, `UAE Network.png`.
- `Screen Owners/` — `SmartTV_Dark.png`, `VideoWall_Dark.png`, `IndoorSignage_Dark.png`, `OutdoorSignage_Dark.png`, `Tablet_Dark.png`, `InVehicle_Dark.png`, `Supported Devices.png`.
- Reference paths URL-encode spaces as `%20` in `src` (e.g. `assets/images/home/Screen%20Owner%20FLow.png`).
- There is a `home/Partners.png` persona illustration already available (light style) if useful.
- ⚠️ `logo.svg`, `darkbackground.png`, `lightbackground.png`, `gitbook.jpg` were removed. Favicon on index.html now uses `home/log-small.png`.
- **Image style note:** `home/` persona+flow images are LIGHT/white-background style; the `advertisers/` and `Screen Owners/*_Dark` images are DARK style matching the dark theme. Prefer dark-style assets on dark pages.

---

## 10. Preview / dev workflow

- **Local preview server** is defined in `.claude/launch.json` (a tiny Node static server on port 3000, name "AdCentral Website"). Use the Claude Preview MCP tool: `preview_start` (name "AdCentral Website") then navigate to `http://localhost:3000/<page>.html`.
- **Quirks observed with the preview tool:**
  - Scroll-reveal hides content on load → in eval, run `document.querySelectorAll('.sr').forEach(el=>el.classList.add('in'))` before screenshotting.
  - It sometimes returns **stale/cached screenshots** or times out on the continuously-animating 3D page. Workarounds: resize the viewport to force a repaint, restart the server, or append `?v=Date.now()` to the URL. Servers also sometimes drop ("Server not found") — just `preview_start` again.
- **3D page (`index.html`)** has a cinematic camera path; mid-scroll frames show lots of sky. To verify ad screens, it has a scroll-driven activation (screens light up at scroll ≳0.4).

---

## 11. Git workflow

- Work directly on `main` (this is the user's preview repo; they want the live Pages site updated).
- Commit + push **when the user asks** (they say things like "update github"). They want all changes pushed so the live preview reflects them.
- Commit message footer used this project:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Line-ending warnings (LF→CRLF) on commit are harmless on Windows.

---

## 12. Recent history (most recent first)
- `f954b83` Help Center → simple **routing page** (WhatsApp/call/form + persona-FAQ deep links). Removed search, popular-questions, article lists.
- `39167f8` Hero carousel slide **titles** added (du recognition / clinic / gym).
- `de66cf7` Fixed hero carousel not auto-rotating (removed hover + visibility pauses).
- `315456c` Added **auto-rotating hero carousel** on home (C1/C2/C3).
- `a168d36` Simplified Help Center (first pass landing page).
- `ac592e8` Built 17 Help Center article pages — **then DELETED** in `a168d36`/`f954b83`. (Do not re-create unless asked.)
- `bf38ec9` Help Center landing page + nav wiring (first version).
- `823faaf` Fixed oversized nav icons on home/home-light.
- `184f7f5` **Premium nav icon tiles** on all menu items.
- `fd4c17f` Docs nav link → new tab + SVG external-link icon.
- `4d008a3` Footer columns aligned to nav menus.
- `3c3a74f` About menu → About AdCentral / Team / Contact.
- `d576814` Renamed `adcl-holders.html` → `adcl.html`.
- `f207d17` / `5b40591` Resources menu → ADCL / Docs / Help Center.
- `93a1e9c` Built **Partners** + **ADCL Holders** pages; wired cross-page nav.
- `969d305` Moved home images/logos into `assets/images/home/`.

---

## 13. Open / possible next items
- **Book a Demo form does not exist yet.** Many CTAs route to `/book-demo?intent=<x>` (see §14). Build that form so it reads `?intent=` and preselects the "What do you need help with?" LOV. **Single form / single enquiry workflow** — do NOT split into department forms.
- **Login / Book a Demo nav buttons** still point to `#` placeholders.
- **About menu** (About AdCentral / Team / Contact) links are placeholders — no About/Team/Contact pages exist yet.
- **`home-light.html`** is the secondary light variant — keep links/menus in sync but dark is primary. It also has its own nav CSS (see §5 caveat).
- Carousel slide **eyebrows** ("Recognized by du" / "Now Live" / "Now Live") were author-added; user may want to change/remove.

---

## 14. LATEST WORK (authoritative — read this first)

Everything below was done after the original handoff and reflects the **current state**. Where it conflicts with §2–§13, this wins.

### 14a. Pages built
- **`partners.html`** — built from the `partners.html`/`screen-owners` shell. Sections: Hero (`.opening-split`, left intro + right **designed CSS network node** `.pnet` with chips) → "Who we partner with" (5 `.vcard` in `.partner-grid`, centered 3+2) → "Ways to grow" (5 `.way-card` in `.ways-grid`) → **"Why partner now" + "Partnership Fit"** merged **left/right** (`.why-grid`: reasons left, fit checklist card right) → Optional ADCL + FAQ (`.pf-grid`). **Final CTA removed.**
- **`adcl.html`** (renamed from `adcl-holders.html`) — **Litepaper v1.6 aligned.** Single CTA everywhere: **"Read ADCL Docs" → GitBook** (no Login/portal/participation CTAs). Sections: Hero (node `.pnet`, badge "Utility token · Phase 2 staking and delegation coming soon") → **"Shared Network Economy"** (editorial split: heading left, copy + red-bordered pull-quote `.economy-line` right, then 3 `.trio` cards) → "What ADCL is used for" (4 `.role-grid` cards) → "Staking & delegation coming in Phase 2" (`.duo`) → **"How network incentives are funded"** (`.gate-grid`: copy + `~70/25/5` `.psp-split` + vertical `.flow-vert` settlement flow) → "Who ADCL supports" (4 `.role-grid`) → Docs + FAQ merged (`.pf-grid`, `id="faq"`). **No Final CTA.** Small muted `.transparency-note` lines instead of a big safeguards box.
  - **ADCL language rules:** USE "protocol settlement", "Protocol Settlement Portion (PSP)", "verified campaign activity", "usage-backed network incentives", "policy-governed", "not guaranteed", "no token inflation". AVOID: buyback, passive income, APY, fixed return, dividends, profit share, ownership, investment, token price, staking formulas.
- **`help.html`** — **simple routing page** (NOT a knowledge base). Sections: Hero ("Find the right help path", WhatsApp + Contact Form) → "What do you need help with?" (5 `.route-card` in `.route-grid`, centered 3+2: Advertisers/Screen Owners/Partners/ADCL/"Still not clear?") → "Still need help?" (**one** `.contact-card`: phone, WhatsApp, Call, Form) → "Stay safe" (`.safety-card`). **No search, no Popular Questions, no article pages, no department cards.** Route cards deep-link to persona-page FAQs and pass `?intent=` to the form.
- **17 Help Center article pages were built then deleted** — do not recreate.

### 14b. Contact / CTA routes (used on help.html; reuse elsewhere)
- WhatsApp: `https://wa.me/971509506897` (button class `.btn-wa`, WhatsApp green `#25D366`)
- Call: `tel:+971509506897` — display number: **`+971 50 950 6897`**
- Docs (GitBook): `https://adcentral-1.gitbook.io/adcentral-docs` (Docs nav link + ADCL CTAs open it in a **new tab**)
- Persona FAQ anchors (all exist, verified): `advertisers.html#faq`, `screen-owners.html#faq`, `partners.html#faq`, `adcl.html#faq`
- **Book a Demo / help form (NOT built yet)** — single form path: `/book-demo?intent=help | advertiser-help | screen-owner-help | partner-help | adcl-help | account-help | general-help`. Form should read `intent` and preselect a "What do you need help with?" LOV (Plan a campaign / Advertiser question / Connect my screen / Screen owner question / Partnership discussion / ADCL question / Account question / General / Other). One form, one workflow.

### 14c. Premium nav icon tiles
- Each Solutions/Resources/About item (desktop dropdown **and** mobile) has `<span class="nav-ico"><svg…/></span>` before the label. CSS: `.nav-ico` (30px tile, glass bg, hairline border) + `.nav-ico svg {15px}`; hover/active → red tint + red icon. Icons: Advertisers=megaphone, Screen Owners=monitor, Partners/Team=people, ADCL=gem, Docs=file(+external arrow), Help Center=help-circle, About AdCentral=building, Contact=mail.
- Applied via scoped PowerShell regex (anchor `role="menuitem"` for desktop; the `<nav id="mobile-nav-panel">` substring for mobile — footer never touched). **home.html/home-light.html needed the `.nav-ico` CSS added separately** (their nav CSS differs from the shell — if you bulk-edit nav CSS, re-check these two or the icons render at full size).

### 14d. Home hero carousel (`home.html`)
- Replaced the single `<img>` with `#heroCarousel`: 3 crossfading slides using `assets/images/home/carousel/C1.png` `C2.png` `C3.png` (all **3:4**, 1086×1448). CSS: `.hero-carousel` (max-width 480, `aspect-ratio:3/4`, rounded), `.hero-slide(.active)` (opacity crossfade + Ken Burns `transform: scale`), `.hero-slide-caption` (bottom gradient), `.cap-eyebrow`, `.cap-long` (smaller style for the long C1 title), `.hero-dots`/`.hero-dot`.
- JS lives **inside home.html's main IIFE** (`/* Hero carousel */`): auto-advance every **5500ms**, crossfade, clickable dots. **Rotates continuously — no hover/visibility pause** (those caused it to freeze; do not re-add them).
- Titles (placeholders, user-provided): C1 = du startup recognition thank-you; C2 = "Now Live in a Clinic Waiting Area"; C3 = "Reaching Active Audiences in the Gym".

### 14e. Tooling — PowerShell splice & bulk-edit recipe (replaces the §3 git-bash recipe)
Shell is **Windows PowerShell**. For replacing a page's `<main>`:
1. `Write` new main HTML to `D:\Ad Central\Website\_main.tmp`.
2. Find `<main>`/`</main>` line numbers (Grep). Splice (note 0-indexed array slices), preserving **UTF-8 no BOM** so box-drawing chars/emoji survive:
   ```powershell
   $all=Get-Content $path -Encoding UTF8
   $out=$all[0..($mainLine-2)] + (Get-Content _main.tmp -Encoding UTF8) + $all[$endLine..($all.Count-1)]
   [System.IO.File]::WriteAllLines($path,$out,(New-Object System.Text.UTF8Encoding $false))
   ```
- For bulk cross-file edits use `[Regex]::Replace` / `.Replace()` on `[IO.File]::ReadAllText`, write back with `WriteAllText(..., UTF8Encoding $false)`. **PowerShell tool state does NOT persist between calls** — redefine vars/functions each call.
- **EOL differs per file:** home/home-light/advertisers/screen-owners = **LF**; partners/adcl/help = **CRLF** (created via `WriteAllLines`). Detect per file when matching multi-line strings.

### 14f. Gotchas learned
- **`.accent` class collision:** the global `.accent` utility sets `-webkit-text-fill-color: transparent` (gradient text). Naming a custom modifier `accent` makes the card's text invisible — use a distinct name (e.g. `is-psp`).
- **Preview screenshots time out** on the continuously-animating WebGL aurora. Workarounds that reliably worked: `document.getElementById('heroWave').style.display='none'` + set a dark `document.body.style.background` before screenshot; reveal `.sr` via `forEach(el=>el.classList.add('in'))`; native preview width is ~800px (below the 960 breakpoint) so set `width:1280` to see desktop two-column layouts. **Primary verification = `preview_eval` reading computed styles / counts**, screenshots secondary.
- **Final-CTA sections:** the user consistently removes standalone final-CTA sections — don't add them by default.
- **Commit footer** used: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`. Commit + push to `main` whenever a unit of work is done (user expects the live Pages site updated).
