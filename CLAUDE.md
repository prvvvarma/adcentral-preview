# AdCentral Website — Project Handoff / Context

> Single source of truth for continuing this build in a new session.
> Last updated after commit `4e04414`. **READ §16 FIRST** — it is the most recent, authoritative state (home-light.html was DELETED, home flow sections were split into card rows, images were made transparent/rounded, the Live Network Snapshot was merged into the problem section, a Privacy Policy page + a Work-in-Progress page were added, and all dead links were fixed). §16 supersedes §1–§15 where they conflict.
> ⚠️ **Environment note:** the shell is **Windows PowerShell** (not git-bash). Use the PowerShell splice/bulk-edit recipes in §14e and §15g.

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

---

## 15. SESSION-2 LATEST WORK (authoritative — READ THIS FIRST)

Everything below is the **current state** as of commit `8006e71`. Where it conflicts with §1–§14, **this wins**. Pages list now: `index.html` (3D), `home.html`, `home-light.html`, `advertisers.html`, `screen-owners.html`, `partners.html`, `adcl.html`, `help.html`, **`about.html` (NEW)**, **`terms.html` (NEW)**.

### 15a. NEW: About / "Our Team" page (`about.html`)
- Built from the `help.html` shell. Linked from nav "About Us" everywhere. Title: `About Us - AdCentral`.
- **Final design = minimal editorial team page** (modeled on a light SaaS team-page sample the user shared, rebuilt for dark): a **two-column `.team-layout`** — left **sticky `.team-intro`** ("About Us" eyebrow + `<h2>Our Team` + one paragraph), right a **2-col grid `.team-members`** of minimal cards.
- **Card = `.tm-card`**: a rounded **4:5 portrait `.tm-photo`** (photos are now **ORIGINAL COLOUR — grayscale filter was removed**; hover does a subtle `scale(1.04)` only), then `.tm-meta` (flex space-between) = left `.tm-name` + `.tm-role`, right `.tm-social` (icon-only LinkedIn/X buttons `.tm-soc`).
- **5 members, in this order** (user-specified): 1) **Afsal KH** — Platform Architect (`Afsal.jpg`; LI `senzonafsal`, X `senzonafsal`); 2) **Strategy / Planning** — role-based, **no name shown** (title hidden), discipline IS the sub-line; photo `Strategy.png` (dark silhouette); no socials; 3) **Nishab PM** — Director - Content Marketing (`Nishab.jpg`; LI `nishabpm`, X `pmnishab555`); 4) **Karim Sahyoun** — Advisory Consultant (`Karim.jpg`; LI `karim1970`, X `sahyounk`); 5) **Web3 / Tokenomics** — role-based, no name, sub-line is the discipline; photo `tokenomics.png` (faceless avatar); X `heyitspraxis`.
- **RULES (still apply):** never use "Founder"/"Co-Founder"; for the two role-based members the **name/title is intentionally hidden** and the discipline ("Strategy / Planning", "Web3 / Tokenomics") is the only visible label — do NOT add "Contributor"/"Specialist"/"anonymous"/"hidden".
- Team photos live in **`assets/images/team/`**: `Afsal.jpg`, `Karim.jpg`, `Nishab.jpg`, `Strategy.png`, `tokenomics.png` (the two `.png` are ~1.4-1.5MB — could be optimized).
- The page went through MANY iterations (circular avatars → bigger → editorial split with a "what the team covers" panel → this minimal grid). Old `.team-grid/.team-card/.team-ava/.tm-*` and a few `.contrib-*`/`.opening-head .lead`/`.hero-*` rules may linger as harmless dead CSS.

### 15b. NEW: Terms & Conditions page (`terms.html`)
- Built from `help.html` shell. Title `Terms and Conditions - AdCentral`. Full legal content: hero (`.legal-hero`: "LEGAL" eyebrow + h1 + lead + Effective/Last-Updated **07 January 2026**) then `.legal` body with **22 numbered `<h2>` sections** (hairline divider per section) and red-dot `.legal-list` bullets. Operated by **"Adora AI Solutions - FZCO"** (en-dash changed to hyphen per no-dash rule). Contact `legal@adcentralglobal.com` (mailto).
- **All footer "Terms" links are wired to `terms.html`** site-wide. **Privacy Policy is still `#`** — user will supply Privacy content next; build it the same way and §15 of Terms references it.

### 15c. Help Center (`help.html`) — reworked again
- **No hero now.** Page = 2 sections: **`#areas`** ("What do you need help with?" — 4 `.route-card`: Advertisers / Screen Owners / Partners → their `*.html#faq`, + "Still not clear?" general) → **`#contact`** ("Still need help? / Couldn't find your answer?" centered, with **WhatsApp** `wa.me/971509506897` + **Call** `tel:+971509506897`). Flow: find answer via cards/FAQ first, then contact.
- Already stripped earlier: search bar, ADCL card, Web3 wording, Book-a-Demo/contact-form CTA, the old safety note, "Ask AdCentral". (`.help-search`, `.safety-*`, etc. are dead CSS.)
- Top eyebrow still reads "Help Areas" + the heading is an `<h2>` (no `<h1>` now) — open nicety to relabel/promote if asked.

### 15d. Site-wide nav / footer cleanup
- **About menu → single "About Us" link** (no dropdown) on every page → `about.html`. Desktop = `<a class="nav-btn nav-solo">` (chevron hidden via `.nav-solo::after{content:none}`); mobile = `<a class="mobile-solo-link">` (NOT `.mobile-acc`, so the accordion JS does not choke on a null sibling). `about.html` marks it `active`.
- **Removed everywhere:** all "Book a Demo" buttons (nav + content; they pointed to a deleted `#final-cta`), all dead "Contact" links (About dropdown, footer "About" column, footer legal row), and the dead **"Want the deeper details?" Resources section** on `home.html`/`home-light.html` (its cards linked to `#resources` itself).
- **Footer now:** "About" column = just **About Us**; legal row = **Privacy Policy** (`#`) + **Terms** (`terms.html`). Solutions/Resources columns unchanged. "Login" nav button still `#`. Discord social = `https://t.co/0ADa5ZBSoQ` (kept — user says it's a real short URL to their Discord).
- `index.html` (3D) is intentionally NOT linked into and uses none of this shared nav/footer.

### 15e. Premium ambient background (variant "A", site-wide) — IMPORTANT
- The whole **dark** site now uses one fixed, layered backdrop instead of the WebGL aurora. Applied to: `home`, `advertisers`, `screen-owners`, `partners`, `adcl`, `help`, `about`, `terms` (8 pages). **NOT applied to `index.html` (3D scene) or `home-light.html` (light variant).**
- CSS marker comment: **`Premium ambient background (site-wide A)`** (about.html's says `(trial)`). It: `.hero-wave-canvas { display:none }`; `body { background-color:#110d1a }`; `body::before` = faint diamond lattice (data-URI SVG) + vignette + 3 colour blooms (red bottom-left `#F5365C`, violet top-right, faint blue bottom-right) + `linear-gradient(162deg,#1e1838,#16121f,#100d1a)`; `body::after` = film-grain (feTurbulence data-URI SVG, `mix-blend-mode:overlay`, `opacity:.085`); plus translucent nav `.site-nav,.site-nav.scrolled { background:rgba(24,18,40,.55)!important; backdrop-filter:blur }`.
- **Brand reality check:** the LIVE brand site `adcentralglobal.com` is **LIGHT (white #FFFFFF) with red #FF3355** + warm peach glows. This repo is **dark by deliberate choice**; user picked dark "A" anyway. If a light/brand-match theme is ever wanted, that's a full re-theme (text/cards/nav), not just a background swap.

### 15f. Other polish this session
- **Mobile buttons** trimmed: each shell page has a `@media (max-width:640px)` block (marker `Mobile button sizing`) shrinking `.btn-lg`/`.btn-md` padding/font/min-height.
- **FAQ sections** (the `.pf-grid` "spotlight + FAQ" on `advertisers/screen-owners/partners/adcl`): a `@media (min-width:961px)` block (marker `align left/right card tops`) makes the FAQ list top line up with the partner card top by lifting `.faq-head` out of flow (`position:absolute; bottom:100%`).
- **Home "AdCentral Marketplace" diagram** now merges with the bg: created **`assets/images/home/AdcentralMarketplace-merged.png`** (background made transparent) and removed the glass-card frame on `.problem-img-single`. `home.html` uses `-merged.png`; **`home-light.html` keeps the original opaque `AdcentralMarketplace.png`** (transparent would vanish on light). Original PNG untouched.

### 15g. Tooling notes learned this session (IMPORTANT)
- **Preview server CACHES files in memory.** After editing a file, `preview_start` "reused" still serves the OLD version → you must **`preview_stop` then `preview_start`** (fresh server) to see edits. (`?v=` cache-busts the browser, not the server cache.)
- **`preview_screenshot` times out very often** on these pages. **Verify via `preview_eval`** (read DOM/computed styles/counts) — that's reliable. For screenshots, hiding/removing the canvas, setting `document.documentElement.style.scrollBehavior='auto'`, revealing `.sr`, and nudging viewport width by 1px sometimes helps; often it just won't cooperate — don't block on it.
- **Image editing IS possible** via PowerShell + .NET: `Add-Type` a C# class doing `Bitmap` + `LockBits` + `Marshal.Copy` over the byte[] (fast). Used it for background-removal (detect dark bluish-purple → alpha 0). No ImageMagick/Python/Node-CLI available.
- **Claude-in-Chrome browser tool** is connected — used it to view the live `adcentralglobal.com` (the in-app preview is sandboxed to localhost and can't load external URLs).
- **Commit footer this session** was `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` (system-instructed format; note it differs from §14f's older "(1M context)" variant — pick one and be consistent).

### 15h. Open / next items
- **Privacy Policy page** — not built; footer link is `#`; user will provide content (Terms §15 references it). Build like `terms.html`. *(DONE in §16 — `privacy.html` now exists.)*
- **Help Center** top: optionally relabel eyebrow "Help Areas" → "Help Center" and/or promote the `<h2>` to `<h1>`.
- **Login** + any future **Book a Demo** form/route — still placeholders/removed. *(Now routed to `work-in-progress.html` — see §16.)*
- **Image weight:** `Strategy.png`/`tokenomics.png` (~1.5MB each) and `AdcentralMarketplace-merged.png` (2.7MB) could be compressed. *(merged PNG deleted in §16.)*

---

## 16. SESSION-3 LATEST WORK (authoritative — READ THIS FIRST)

Current state as of commit `4e04414`. Where this conflicts with §1–§15, **this wins**.

**Pages list now (10):** `index.html` (3D), `home.html`, `advertisers.html`, `screen-owners.html`, `partners.html`, `adcl.html`, `help.html`, `about.html`, `terms.html`, **`privacy.html` (NEW)**, **`work-in-progress.html` (NEW)**. ⚠️ **`home-light.html` was DELETED** — the light variant is gone; the site is dark-only now. Don't try to "keep it in sync" anymore.

### 16a. `home.html` "How it works" flow sections — split into card rows
- The two single flow images (`Advertiser Flow.png`, `Screen Owner FLow.png`) were **replaced** with **3-step card rows** built in HTML.
- New markup inside each `.hiw-sc-card`: a `.flow3` flex row of three `.flow3-step` (each = `.flow3-head` [`.flow3-num` red badge + `.flow3-label` + `.flow3-sub`] over a `.flow3-img`), separated by `.flow3-arrow` (red dashed SVG arrow). CSS marker: `ADVERTISER 3-STEP FLOW`. Collapses to a vertical stack at `max-width:768px` (arrows rotate 90°).
- Advertiser row = **Plan / Run / Track**; Screen-Owner row = **Connect / Display / Monitor**. Images: `Plan.png Run.png Track.png Connect.png Display.png Monitor.png` in `assets/images/home/`.
- The old `Advertiser Flow.png` / `Screen Owner FLow.png` were **deleted** (were only used by the now-deleted home-light).

### 16b. Card images processed to transparent rounded cards (IMPORTANT technique)
- All 6 flow images **+ `Campagin Dashboard.png`** were reprocessed: **light lattice background removed → transparent, content cropped, composited onto a white rounded card** (radius ~28-34, even padding), saved back as PNG. The 6 flow cards are normalized to **one identical canvas size** (1058×1272) so they render equal-height in the row.
- `assets/images/home/AdcentralMarketplace.png` is a **new asset** the user dropped in (clean dark-bg diagram) — but it's **no longer used on a page** (see §16c). It replaced the deleted `-merged.png` reference temporarily before the snapshot merge.
- **Originals backed up to `assets/images/home/flow_orig_backup/`** (NOT committed — gitignored by omission; kept locally for reversibility/re-processing).
- **Detection gotchas (for re-processing):** background base is white (254) with faint gray lattice lines (243) — card and bg overlap in color, so detect the card by **dark/colored content** (`max(r,g,b) < 235` OR saturation > 18), take the full min/max bbox, and **skip the outer ~40px border** to ignore a faint corner artifact in Run.png. ⚠️ **PowerShell vars are CASE-INSENSITIVE** — `$b` (blue byte) silently clobbers `$B` (border const). Use distinct names. The image pipeline = `Bitmap` + `LockBits`/`Marshal.Copy` for detection, then `Graphics.FillPath`(rounded-rect white) + `SetClip` + `DrawImage` for compositing; save UTF-8/no-BOM not needed for PNG.

### 16c. `#problem` section merged with Live Network Snapshot (premium)
- The marketplace **image was removed** from `#problem` (the "Out of Home advertising is still too fragmented" section). Its right column is now a **premium "Live Network Snapshot" glass card** (`.netsnap` + `.netsnap-head` with a pulsing `.netsnap-dot` "LIVE" pill + `.netsnap-list` of 3 `.netsnap-stat` rows: **50+ Live Screens / 45 Active Venues / 340+ Campaigns Delivered**, each icon + big number + label + desc). CSS marker: `LIVE NETWORK SNAPSHOT CARD`. A bridging `.lead` was added under the left h2.
- The **standalone `#network` "Live Network Snapshot" section was DELETED** (its stats live in `#problem` now). `.snapshot-strip`/`.snap-*` CSS is now dead but harmless. Stats are still **placeholder values** (kept the amber `.dev-note` → wire to `GET /api/network/stats`).
- Net effect: `AdcentralMarketplace*.png` is no longer referenced anywhere on `home.html`.

### 16d. NEW: `privacy.html`
- Built by cloning the `terms.html` shell (same nav/footer/legal CSS). Title `Privacy Policy - AdCentral`. Hero (`.legal-hero`, "LEGAL" eyebrow, Effective/Last-Updated **07 January 2026**) + `.legal` body with **14 numbered `<h2>` sections** and `.legal-list` bullet groups. Operator **Adora AI Solutions - FZCO**, contact `legal@adcentralglobal.com` (mailto). **All footer "Privacy Policy" links site-wide now point to `privacy.html`** (were `#`/`#footer`).

### 16e. NEW: `work-in-progress.html` (placeholder target for unbuilt links)
- Cloned from the `help.html` shell; `<main>` replaced with a centered hero ("COMING SOON" eyebrow + "This page is a work in progress." + Back-to-Home + WhatsApp buttons). Title `Work in Progress - AdCentral`.
- **All non-functional links now route here** so they can be swapped later: every **Login** button (nav + mobile + hero), every **"Discuss Partnership"** CTA, and the old `/login`, `/login?role=advertiser…`, `/book-demo?intent=partner` routes. To wire a real destination later, just edit those `href="work-in-progress.html"` occurrences.

### 16f. Link audit + cleanup
- **Fixed 3 broken logo links** (`href="#"` → `home.html`) that were on the footer/nav logos.
- **"Discuss Partnership"** now appears on **all 3 personas** (added a `.partner-actions` button to the screen-owners ADCL card; advertisers & partners already had it). **"Learn More"** button removed from advertisers.
- **`screen-owners.html`:** the hero **"Connect Your Screen"** primary button was removed (only "Login" remains in that hero).
- **Full audit result: 0 dead links** — every `<a>` resolves to a real page, the WIP placeholder, or a valid external/mailto/tel/wa.me URL. `#faq` anchors verified present on advertisers/screen-owners/partners/adcl.
- **Deleted unused files:** `home-light.html`, `AdcentralMarketplace-merged.png`, `AdcentralMarketplace_1.png`, `AdcentralMarketplace_bkup.png`, `Advertiser Flow.png`, `Screen Owner FLow.png`.

### 16g. Open / next items
- **Login / Book-a-Demo** still unbuilt — currently all point to `work-in-progress.html`. Build real auth/booking and repoint.
- **Stats** in the Live Network Snapshot (`#problem`) are placeholders — wire to backend.
- **`index.html` (3D)** remains standalone (own design, not the shared shell) — untouched.
- **Image weight:** team `Strategy.png`/`tokenomics.png` (~1.5MB each) and the new `AdcentralMarketplace.png` (large, currently unused) could be compressed or removed.
- **Commit footer used this session:** `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
