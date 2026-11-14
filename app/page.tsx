"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Motion from "./motion";
import { decadeOf, eventAnchor, getCategories, getDecades, pad, timelineContent, type TimelineContent } from "./timeline-content";
import { SiteHeader } from "./components/Header";
import { TimelineIntro } from "./components/TimelineIntro";
import { TimelineControls } from "./components/TimelineControls";
import { Timeline } from "./components/Timeline";
import { SiteFooter } from "./components/Footer";

export interface HomeProps { content?: TimelineContent }

export default function Home({ content = timelineContent }: HomeProps = {}) {
  const { title, events, labels } = content;
  const [category, setCategory] = useState(labels.allLabel);
  const [active, setActive] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  // While a button-driven scroll is running, the scroll-spy must not overwrite the chosen event.
  const navLock = useRef(0);
  const startOver = useRef(false);

  const visible = useMemo(() => category === labels.allLabel ? events : events.filter((event) => event.category === category), [category, events, labels.allLabel]);
  const categories = useMemo(() => [{ name: labels.allLabel, count: events.length }, ...getCategories(events)], [events, labels.allLabel]);
  const decades = useMemo(() => getDecades(visible), [visible]);
  const activeIndex = Math.min(active, Math.max(visible.length - 1, 0));
  const activeEvent = visible[activeIndex];

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(visible.length - 1, index));
    const target = visible[next];
    if (!target) return;
    navLock.current = performance.now() + 1000;
    setActive(next);
    setAnnouncement(`${target.year}. ${target.title}. ${next + 1} ${labels.controls.of} ${visible.length}`);
    // Follows the CSS `scroll-behavior`, so it is instant when the visitor prefers reduced motion.
    document.getElementById(eventAnchor(target.id))?.scrollIntoView({ block: "center" });
  };

  const chooseCategory = (next: string) => {
    setCategory(next);
    setActive(0);
    setAnnouncement("");
    startOver.current = true;
  };

  // A new filter re-mounts the list, so bring its first event into view instead of
  // letting the scroll-spy pick whatever now sits in the middle of the viewport.
  useEffect(() => {
    if (!startOver.current) return;
    startOver.current = false;
    const first = visible[0];
    if (!first) return;
    navLock.current = performance.now() + 1000;
    document.getElementById(eventAnchor(first.id))?.scrollIntoView({ block: "center" });
  }, [visible]);

  // Scroll-spy: the event crossing the middle of the viewport becomes the active one.
  useEffect(() => {
    const anchors = visible.map((event) => eventAnchor(event.id));
    const observer = new IntersectionObserver((entries) => {
      if (performance.now() < navLock.current) return;
      entries.forEach(({ target, isIntersecting }) => {
        const index = anchors.indexOf(target.id);
        if (isIntersecting && index >= 0) setActive(index);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    anchors.forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    const release = () => { navLock.current = 0; };
    window.addEventListener("scrollend", release);
    return () => {
      observer.disconnect();
      window.removeEventListener("scrollend", release);
    };
  }, [visible]);

  const first = events[0];
  const last = events[events.length - 1];
  const stats = [
    { value: pad(events.length), label: labels.stats.milestones },
    { value: pad(getCategories(events).length), label: labels.stats.categories },
    { value: String(first && last ? last.year - first.year : 0), label: labels.stats.years },
  ];
  const kicker = first && last ? `${labels.kicker} / ${first.year} — ${last.year}` : labels.kicker;

  return <div className="portfolio">
    <Motion revision={category} />
    <SiteHeader logo={labels.logo} navLabel={labels.navLabel} links={labels.nav} status={`${pad(events.length)} ${labels.statusSuffix}`} />
    <main>
      <TimelineIntro kicker={kicker} title={title} description={labels.description} stats={stats} />
      <div className="rule" />
      <section id="timeline" className="timeline-section">
        <div className="timeline-layout">
          <TimelineControls labels={labels.controls} total={visible.length} activeIndex={activeIndex} activeEvent={activeEvent} categories={categories} category={category} decades={decades} activeDecade={activeEvent ? `${decadeOf(activeEvent.year)}s` : undefined} moreOpen={moreOpen} announcement={announcement} onNavigate={goTo} onCategory={chooseCategory} onToggleMore={() => setMoreOpen((open) => !open)} />
          <Timeline key={category} title={title} events={visible} activeIndex={activeIndex} peopleLabel={labels.peopleLabel} selectLabel={labels.selectLabel} emptyLabel={labels.emptyLabel} onSelect={goTo} />
        </div>
      </section>
    </main>
    <SiteFooter logo={labels.logo} navLabel={labels.navLabel} links={labels.nav} description={labels.footerDescription} note={labels.footerNote} tagline={labels.footerTagline} backToTop={labels.backToTop} />
  </div>;
}
