# Nova Design Guide for AI Agents

Design rules for this repo: a responsive, dark, futuristic interactive timeline ("History of Artificial Intelligence", built from `data/timeline.json`) under the "Nova" brand. Read this before changing any UI, styling, layout, copy, or motion. Code conventions and the Next.js warning are in [AGENTS.md](./AGENTS.md); component locations are in [COMPONENTS.md](./COMPONENTS.md).

Verified against the code on 2026-11-13. If the code and this file disagree, the code wins. Fix this file in the same change.

## 1. Read first: the CSS is layered, and the last rule wins

There is no single source of truth for style. The look was redesigned several times by appending rules, so the earliest rules for a selector are usually **not** the ones that apply.

`app/layout.tsx` imports `globals.css`, then `glass.css`. Inside `globals.css`, in file order:

| Layer (comment or position) | What it still contributes | Palette |
|---|---|---|
| Base (first 8 lines) | Skeleton for `header`, `nav`, `footer`, `h1`/`h2`, `.rule`, `.eyebrow`, `.portfolio`, and the `1500/900/680` breakpoints | Olive and lime. **Obsolete.** |
| "A cinematic, sculptural direction" | Overrides of the base; hero and orb geometry (now unused) | Sage. **Obsolete.** |
| "2050: midnight glass, cyan light…" | **Current tokens** (`--background/--foreground/--accent`), header and nav styling, `.rule` | Midnight and cyan. **Current.** |
| "Motion uses independent transforms…" | `.reveal`, `.cursor-light`, entrance keyframes, reduced-motion fallbacks | n/a |
| "Editorial vision…", "Eight independent cinematic loops…" | Footer layout (`footer`, `.footer-brand/-navigation/-bottom`). The rest is **unused** (see section 13). | Current |
| "Component primitives…" | `.ui-button`, `.ui-card` | n/a |
| "Timeline: vertical history…" (end of file) | **Timeline structure and responsive layout** | n/a |

`glass.css` loads last and holds the final surface, color, and typography refinements, including the **Timeline** block at its end.

**Rules**
- Before editing a property, search **both** CSS files for every occurrence of the selector and edit the last one that sets it. A change to an earlier rule will silently do nothing.
- Do not delete earlier layers because they look dead. They still supply layout and tokens, and some unused selectors share rules with live ones.
- Put new rules at the end of the relevant file: color, surface, and type treatment in `glass.css`; structural layout in `globals.css` beside the Timeline block; animation inside a `prefers-reduced-motion: no-preference` block.
- Styling is plain global CSS with class names. Tailwind is imported but used only for `<html>`/`<body>` utilities in `layout.tsx` and the `sr-only` helper. Do not introduce CSS modules, CSS-in-JS, or Tailwind utilities in components without asking.

## 2. Design intent

- **Concept:** "A vision of 2050." Midnight glass, cyan light, and holographic form. Calm, cinematic, optimistic. Not neon, not cyberpunk, not playful.
- **Signature devices on the page today:** frosted-glass panels over a dark gradient canvas; one cyan accent with a cyan → blue → violet gradient for emphasis; tracked-out monospace micro-labels; tight, negative-letter-spaced sans headlines; a vertical rail with glowing nodes.
- **Mood rule:** emphasis comes from light, translucency, and weight contrast (400 vs 300), never from heavy borders, saturated fills, drop shadows, or italics.

## 3. Tokens

Only these are CSS variables. Everything else is a literal hex, so reuse the existing values below instead of inventing near-duplicates.

```css
--background: #070911;   /* globals.css; body paints #080c16 + glows from glass.css */
--foreground: #eef0fa;
--accent:     #78f2f1;   /* cyan: focus ring, dots, active states, selection */
--glass-fill:   linear-gradient(135deg, #d8eaff12, #aac7ff06 48%, #be9cff0b);
--glass-border: #d5e6ff30;
--glass-shadow: inset 0 1px 0 #ffffff1c, inset 1px 0 0 #ffffff08, 0 16px 50px #02041135;
```

`--font-geist-sans` and `--font-geist-mono` come from `next/font/google` in `layout.tsx`.

**Color roles (observed)**

| Role | Values |
|---|---|
| Canvas | `#080c16` plus radial glows: violet `#7054c02e` at 92% 5%, teal `#287b9a24` at 3% 27%, indigo `#5d4eab20` at 82% 56%. `background-attachment: fixed`. |
| Headline text | `#f1f5ff` |
| Body text | `#b2bfd8`, `#b4bfd7` (blue-gray, never pure white) |
| Nav and secondary UI text | `#c6d0e3`, `#bdc9e0`, `#c0cde6` |
| Muted and mono meta | `#b3c3df`, `#b0c1df`, `#8799bb` |
| Category and kicker | `#b3edff` |
| Inactive year | `#b7c5e7` |
| Primary control (Previous/Next) | fill `linear-gradient(120deg,#b8f2ff2b,#a3b9ff1a)`, border `#c9faff80`, text `#e5fbff` |
| Selected chip | fill `linear-gradient(120deg,#b6faff25,#b3b1ff17)`, border `#d2f7ff55`, text `#e1fbff` |
| Active card border | `#bedfff70` |

**Gradients:** emphasis text (active year, counter) `110deg #d3ffff, #a7d8ff 42%, #c6b4fa 85%` as `background-clip:text`; the rule accent runs cyan `#83f5ff` to violet `#a78bfa`.

**Translucent colors** use 8-digit hex (`#d8eaff12`). Keep that format.

**Surfaces**
- Glass is declared **once** in a shared selector list at the top of `glass.css`: `header, .holo-panel, .innovation-card, .project, .filters, .motion-toggle, .contact-circle, .timeline-controls, .timeline-card, .footer-social a, .footer-social button`. It applies `--glass-fill/border/shadow` plus `backdrop-filter: blur(22px) saturate(135%)`. **Add new glass components to that list** rather than re-declaring the recipe.
- `@supports not (backdrop-filter…)` swaps in a solid `#172235`. Add any new glass surface to that list too.
- **A glass surface that scrolls over content must also get a body fill** (the sticky controls use `background-color: #0b112099` at ≤1000px). The shared fill is only about 7% opaque.
- **Do not put `animation-fill-mode: both` or `forwards` on an ancestor of glass.** An element left with a filled opacity animation becomes a *backdrop root* and silently disables `backdrop-filter` for everything inside it. `.portfolio` uses `backwards` for this reason.

**Radii:** header 20px (16 on mobile); timeline controls 20 (16 at ≤1000); timeline card 20 (18 on mobile); primary controls 12; chips and people tags are pills (30px); nodes and scrubber thumb are circles.

**Stacking:** `.cursor-light` 10 > `header` 5 > `.timeline-controls` 4. Do not add values above 10.

## 4. Typography

- **Sans (Geist):** headlines and body. **Mono (Geist Mono):** eyebrows, kickers, categories, dates, counters-in-labels, always uppercase with wide tracking (`.17em`; dates `.1em`).
- Headlines are weight 400 (event titles 450), large numerals 300, with strong negative tracking (`-.045em` to `-.067em`) and `text-wrap: balance`.
- Emphasis inside a heading uses `<em>`: **not italic**, weight 300 to 350, tinted or gradient. Avoid `<em>` inside `h1`: the base and cinematic layers still give `h1 em` an outlined or serif treatment.

| Element | Desktop | ≤1000px | ≤680px |
|---|---|---|---|
| Intro `h1` | `clamp(48px, 6.4vw, 100px)`, lh 1.06, ls -.067em | `clamp(48px, 9vw, 72px)` | `clamp(40px, 11.6vw, 64px)` |
| Event title `h2` | 23px, lh 1.25 | 23px | 21px |
| Event body | 13px, lh 1.9 | 13px | 12px |
| Year numerals | `clamp(34px, 3.6vw, 52px)`, w300 | same | same |
| Progress counter | 48px, w300 | 30px | 26px |
| Summary stats | 34px, w300 | 34px | 28px |
| Intro paragraph | 13px, lh 1.95 | 13px | 12px |
| Chips, buttons | 11–12px | same | same |
| Mono labels | 10–11px | same | same |

Do not add new sub-10px text, and do not use micro-label sizes for anything a user must read. Existing sub-10px labels (see section 13) are leftovers, not a pattern to copy.

## 5. Layout and responsive

- **Container:** `.portfolio`, `max-width: 1800px`, side padding `5.5%` (`6%` at ≤680px), centered.
- **Desktop-first.** Breakpoints in use: `max-width:1000px` and `max-width:680px`. Older `1500/1600/900px` rules belong to obsolete layers. Do not add new breakpoints without a reason.
- **Page order:** Header → Intro `#overview` → rule → Timeline section `#timeline` → Footer.
- **Timeline layout (`.timeline-layout`):**
  - Desktop: two columns, `minmax(250px, 310px)` for the sticky controls and `1fr` for the list, gap `clamp(32px, 5vw, 88px)`. `padding-bottom: 30vh` lets the last event reach the middle of the viewport.
  - ≤1000px: the layout becomes `display: block` (sticky needs the wrapper as its containing block; in a one-column grid it would stop sticking after its own row). The controls become a compact sticky bar: previous | readout | next, then scrubber, then a "Filters & years" toggle that reveals the category and decade chips.
  - Each `.timeline-item` is a grid of `year | rail (28px) | card`. At ≤680px it becomes `rail | content`, with the year and index above the card.
- **Item states:** `li.timeline-item` carries `is-past`, `is-active`, or `is-upcoming`. Past items colour their rail segment cyan, the active item has a filled glowing node, a gradient year, and the bright card border.
- **Vertical spacing:** 56px between events (36px mobile), intro padding 72/52px (44/36 mobile).

## 6. Components and content contract

- `app/page.tsx` (`Home`) owns state only: category filter, active index, panel toggle, live-region text, and scroll-sync refs. Sections live in `app/components/` and receive **plain props**. Keep `Home` limited to state and composition.
- **Data and copy:**
  - Events live in `data/timeline.json`. Adding, editing, or reordering an event means editing that file only. Categories become filter chips automatically, and decades are derived from `year`.
  - `app/timeline-content.ts` types the JSON (the assignment `const data: TimelineData = timeline` makes `tsc` check its shape), sorts events chronologically, and holds **all UI strings** in `labels`. Add new user-facing strings there, not inline in JSX.
  - `Home` takes an optional `content` prop (used by stories).
  - `date` has variable precision (`YYYY`, `YYYY-MM`, `YYYY-MM-DD`); render it with `formatEventDate`. `people` may be empty; the people row is then omitted.
  - Every event gets `id="event-{id}"`. Header and footer links come from `labels.nav` as explicit `{ label, href }` pairs.
- **Primitives:** use `Button` (`default | quiet | icon` → `.ui-button--{variant}`), `Card` (`<article class="ui-card">`), `Eyebrow`, `Logo`, `TextLink` instead of raw elements. `.ui-card` and `.ui-button--quiet` have no styles of their own.
- **Global element selectors:** `header`, `nav`, `footer`, `h1`, `h2`, and `dialog` are styled **by tag**. A `<header>` or `<footer>` placed inside a card will pick up the site-header glass and height. Use a `<div>` with a class for inner headers. A `<nav>` also gets the site nav styling and the magnetic hover, so the timeline controls use `role="group"` instead.
- **`<i>` is the accent status dot** (6px cyan circle with glow). Never use `<i>` for italics or icons.
- **Icons** are text glyphs (`✦ ↑ ↓ ↗ +`). There is no icon library.
- `stories/Button.tsx`, `Header.tsx`, `Page.tsx` (and their `.css`) are Storybook starter examples, not part of Nova's visual language.

## 7. Motion

All motion is decorative. Pointer and reveal logic lives in `app/motion.tsx` (client component, outside React's render loop). It sets **CSS classes and custom properties**, and CSS does the animating. Do not move per-frame effects into React state.

**Easing:** `cubic-bezier(.16, 1, .3, 1)` for entrances, reveals, and the magnetic effect. Hover color and glow changes use `.3`–`.4s`.

| Effect | Mechanism | Parameters |
|---|---|---|
| Page arrival | CSS keyframe on `.portfolio` | 1s fade, fill-mode `backwards` (see section 3) |
| Scroll reveal | JS adds `.reveal` then `.revealed` via `IntersectionObserver` on `.timeline-intro > *, .timeline-item` | threshold `.08`, 26px rise, `.85s`, delay `(index % 2) * 65ms` |
| Magnetic controls | inline `translate` | `nav a, .timeline-step`; factors `.16/.2`, 14px reach |
| Cursor light | `--cursor-x/y` on `<html>`, `.pointer-lit` | 420px radial, hidden on touch and `hover:none` |
| Active-event state | CSS transitions on node, card border, and glow | `.4s` |
| Scroll to event | `scrollIntoView({ block: "center" })` | follows CSS `scroll-behavior`, so it is instant under reduced motion |

**Scroll-sync (the part most likely to break):**
- An `IntersectionObserver` with `rootMargin: "-45% 0px -45% 0px"` makes the event crossing the middle of the viewport the active one.
- Button, scrubber, chip, and node navigation (`goTo` in `page.tsx`) sets the active event and scrolls. It also sets `navLock` for about 1s (released early on `scrollend`) so the observer cannot overwrite the target while the smooth scroll passes other events.
- Changing the category re-mounts the list (`key={category}`), re-runs `Motion` (`revision={category}`), and scrolls to the first event.
- If you add anything that changes event heights or the page length, re-check that the first and last events can reach the middle of the viewport.

**Rules**
- Use the independent properties `translate`, `scale`, and `rotate` for scroll and pointer effects so they compose with hover `transform`. One property per effect.
- Animate only `opacity`, `translate`, `scale`, `rotate`, `transform`, and color, border, or shadow changes. Never animate layout properties (`width`, `top`, `margin`).
- **Reduced motion is mandatory in two places.** CSS: wrap new animation in `@media (prefers-reduced-motion: no-preference)`; the global `reduce` rule disables transitions and animations and forces `.reveal` content visible. JS: `Motion` skips setup when the preference matches and re-runs when it changes.
- New elements that should reveal on scroll must be added to the selector list in `motion.tsx` (`reveals`).

## 8. Imagery

The current page has no photography. If you add images: use `next/image` with explicit `sizes` and meaningful `alt` text (the site is a static export under `basePath: "/nextjs-design-responsive"`, so optimization is off). Prefer dark, atmospheric, cool or violet imagery, and grade it in CSS (low saturation, slight contrast lift, cyan-to-violet screen tint) rather than editing files, as the unused `.project-image` rules still show.

## 9. Accessibility (preserve these)

Existing patterns the design relies on. Do not regress them:
- Visible focus: `2px solid var(--accent)` with `outline-offset: 5px` on links and buttons (`6px` on the scrubber). Never remove `:focus-visible` outlines.
- Timeline structure: an `<ol aria-label>` of events; each node is a real `<button>` with an accessible name and `aria-current="step"` when active; dates use `<time dateTime>`.
- Controls: `role="group"` with a label; category and decade chips expose `aria-pressed`; Previous/Next use `aria-disabled` (not `disabled`, so focus is kept at the ends); the panel toggle uses `aria-expanded` and `aria-controls`.
- The scrubber is a native `<input type="range">` with `aria-valuetext` (year and title), so arrow keys, Home, and End work.
- A visually hidden `role="status"` region announces the event after button-driven navigation. The scroll-spy does not announce.
- Decorative glyphs and nodes are `aria-hidden`. Keep the Previous/Next text labels in the DOM (they are visually hidden at ≤680px, not removed).
- Content stays reachable when reveal animation is off, and no horizontal page scroll at any width.

## 10. Voice and copy

- **Wordmark:** lowercase `nova` with a leading `✦` and a superscript `®`.
- **Headlines:** sentence case, short, plain. The title comes from the data (`History of Artificial Intelligence`); event titles are used verbatim.
- **Micro-labels:** uppercase mono, often with a slash: `TIMELINE / 1950 — 2024`, `04 / 15`, `JUMP TO DECADE`.
- Avoid corporate jargon, exclamation marks, and emoji.

## 11. Do and don't

**Do**
- Reuse tokens, the shared glass selector list, the existing radii, and the primitives.
- Check every responsive layer (desktop, ≤1000, ≤680) after any layout change.
- Keep the sans/mono, 400/300 weight, and tracked-uppercase-label pairing.

**Don't**
- Add a second accent color, solid bright fills, hard opaque borders, or heavy shadows.
- Use pure `#fff` or `#000` for text or surfaces. Use the blue-tinted values.
- Add italic or bold for emphasis. Use weight 300 or the gradient.
- Hard-code copy or events in components. They belong in `data/timeline.json` and `timeline-content.ts`.
- Add motion without a `prefers-reduced-motion` fallback.
- Edit the first matching CSS rule without checking the cascade (section 1).

## 12. Verify before finishing a UI change

1. `npx tsc --noEmit` and `npm run lint` pass; `npm run build` succeeds (it is a static export).
2. Check the page at about 1440, 1024, 820, and 390px wide. Look for overlap, a see-through sticky panel, and horizontal scroll.
3. Step through with Previous/Next, the scrubber (arrow keys, Home, End), a node, a category chip, and a decade chip. The counter must match the event in the middle of the screen, including after a manual scroll.
4. Toggle OS "Reduce motion": every event must stay visible and the scroll to an event must be instant.
5. Tab through the page: focus rings are visible and every control has a name.
6. If you touched shared components or the content shape, check the `Timeline/Home`, `Portfolio/Motion`, and `App/RootLayout` stories (`npm run storybook`).

## 13. Known gaps (do not copy these patterns)

- **Small type and unaudited contrast:** body is 12–13px, the footer's mono labels are 5–6px, and many muted colors are low-contrast blue-grays. Storybook's a11y check is set to `todo` in `.storybook/preview.tsx`, so none of this is enforced.
- **Unused portfolio-era CSS** remains in both stylesheets: hero, orb, holo-panel, discipline strip, vision, innovation, project grid, scenes, possibilities, contact, dialog, `.motion-toggle`, `.footer-social`, and `.ui-button--quiet`. It is safe to prune only after searching for each selector, because several share rules with live ones.
- **Layers still win over new rules:** see section 1. Two fixes were made to old global styles: `.portfolio` animation fill-mode (restores `backdrop-filter`) and `background-attachment: fixed` on `body` (removes a seam where the viewport-tall background tiled).
