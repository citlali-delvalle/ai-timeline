import timeline from "../data/timeline.json";

export interface TimelineEvent {
  id: number;
  /** ISO-style date with variable precision: `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. */
  date: string;
  year: number;
  title: string;
  description: string;
  category: string;
  people: readonly string[];
}

export interface TimelineData {
  title: string;
  events: readonly TimelineEvent[];
}

export interface TimelineControlLabels {
  group: string;
  previous: string;
  next: string;
  scrubber: string;
  more: string;
  filters: string;
  decades: string;
  of: string;
}

export interface TimelineLabels {
  logo: string;
  navLabel: string;
  nav: readonly { label: string; href: string }[];
  kicker: string;
  description: string;
  statusSuffix: string;
  stats: { milestones: string; categories: string; years: string };
  peopleLabel: string;
  selectLabel: string;
  emptyLabel: string;
  allLabel: string;
  controls: TimelineControlLabels;
  footerDescription: readonly string[];
  footerNote: string;
  footerTagline: string;
  backToTop: string;
}

export interface TimelineContent {
  title: string;
  events: readonly TimelineEvent[];
  labels: TimelineLabels;
}

export interface TimelineDecade {
  /** Display label such as `1990s`. */
  label: string;
  /** Index of the first event in that decade, within the list that was passed in. */
  index: number;
}

// Assigning the JSON module to the interface makes `tsc` check the file's shape.
const data: TimelineData = timeline;

/** Events in chronological order, even if the JSON file is edited out of order. */
const events = [...data.events].sort((a, b) => a.year - b.year || a.date.localeCompare(b.date) || a.id - b.id);

export const timelineContent: TimelineContent = {
  title: data.title,
  events,
  labels: {
    logo: "nova",
    navLabel: "Primary",
    nav: [
      { label: "Overview", href: "#overview" },
      { label: "Timeline", href: "#timeline" },
    ],
    kicker: "TIMELINE",
    description: "The milestones that shaped the field. Scroll the timeline, or use the controls to step through each moment.",
    statusSuffix: "milestones",
    stats: { milestones: "MILESTONES", categories: "CATEGORIES", years: "YEARS" },
    peopleLabel: "PEOPLE",
    selectLabel: "Go to event",
    emptyLabel: "No events to show.",
    allLabel: "All",
    controls: {
      group: "Timeline navigation",
      previous: "Previous",
      next: "Next",
      scrubber: "Jump to event",
      more: "FILTERS & YEARS",
      filters: "CATEGORY",
      decades: "JUMP TO DECADE",
      of: "of",
    },
    footerDescription: ["An interactive, visual history", "of artificial intelligence."],
    footerNote: "CONCEPT PROJECT",
    footerTagline: "A VISUAL HISTORY OF AI.",
    backToTop: "BACK TO TOP",
  },
};

export const pad = (value: number) => String(value).padStart(2, "0");

export const eventAnchor = (id: number) => `event-${id}`;

export const decadeOf = (year: number) => Math.floor(year / 10) * 10;

const monthName = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" });

/** `1956` → "1956", `1950-10` → "October 1950", `2022-11-30` → "30 November 2022". */
export function formatEventDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!Number.isFinite(year)) return date;
  if (!month) return String(year);
  const name = monthName.format(new Date(Date.UTC(year, month - 1, 1)));
  return day ? `${day} ${name} ${year}` : `${name} ${year}`;
}

/** Unique categories in order of first appearance, each with its event count. */
export function getCategories(list: readonly TimelineEvent[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  list.forEach(({ category }) => counts.set(category, (counts.get(category) ?? 0) + 1));
  return [...counts].map(([name, count]) => ({ name, count }));
}

/** One entry per decade present in `list`, pointing at that decade's first event. */
export function getDecades(list: readonly TimelineEvent[]): TimelineDecade[] {
  const seen = new Set<number>();
  const decades: TimelineDecade[] = [];
  list.forEach(({ year }, index) => {
    const decade = decadeOf(year);
    if (seen.has(decade)) return;
    seen.add(decade);
    decades.push({ label: `${decade}s`, index });
  });
  return decades;
}
