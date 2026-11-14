# Component Inventory

## React components

- [Button](stories/Button.tsx:17) — Storybook starter button with primary/secondary, size, color, and click-handler props.
- [Header](stories/Header.tsx:15) — Storybook starter header with logged-in/logged-out states; uses the starter `Button`.
- [Page](stories/Page.tsx:10) — Storybook starter page composing the starter `Header`.
- [Home](app/page.tsx:14) — page coordinator that owns the category filter, active event, scroll-spy, and panel state.
- [Button](app/components/Button.tsx:8) — shared button primitive with default, quiet, and icon variants.
- [Card](app/components/Card.tsx:3) — shared surface wrapper for content cards.
- [Logo](app/components/Text.tsx:7) — shared brand mark.
- [Eyebrow](app/components/Text.tsx:3) — shared small-label typography.
- [TextLink](app/components/Text.tsx:11) — shared underlined text link.
- [SiteHeader](app/components/Header.tsx:7) — logo, anchor links (`{ label, href }`), and status line.
- [TimelineIntro](app/components/TimelineIntro.tsx:6) — kicker, title, description, and summary stats.
- [TimelineControls](app/components/TimelineControls.tsx:22) — sticky navigation: previous/next, progress readout, range scrubber, category filter, and decade jumps.
- [Timeline](app/components/Timeline.tsx:24) — ordered list of events on a rail; each item shows year, node, date, category, title, description, and people.
- [SiteFooter](app/components/Footer.tsx:6) — logo, anchor links, description, and back-to-top.
- [Motion](app/motion.tsx:6) — client-side reveal, magnetic-control, cursor-light, and reduced-motion behavior.
- [RootLayout](app/layout.tsx:22) — global Next.js layout with fonts, metadata, and page shell.

## Data and helpers

- [`data/timeline.json`](data/timeline.json) — the timeline source: `{ title, events[] }`, each event with `id`, `date`, `year`, `title`, `description`, `category`, `people`.
- [`app/timeline-content.ts`](app/timeline-content.ts) — types, the sorted `timelineContent` object (events plus all UI labels), and pure helpers: `formatEventDate`, `getCategories`, `getDecades`, `decadeOf`, `eventAnchor`, `pad`.

## Storybook stories

- `Timeline/Home`: Default, SingleEvent, EmptyTimeline
- `Portfolio/Motion`: Default, Revised
- `App/RootLayout`: Default
- `Button`: Primary, Secondary, Large, Small
- `Header`: LoggedIn, LoggedOut
- `Page`: LoggedIn, LoggedOut

The page is composed from focused components in `app/components/`; `Home` is intentionally limited to page-level state and composition. Events and copy come from `data/timeline.json` and `app/timeline-content.ts`, never from JSX.
