import type { CSSProperties } from "react";
import { Button } from "./Button";
import { Eyebrow } from "./Text";
import { pad, type TimelineControlLabels, type TimelineDecade, type TimelineEvent } from "../timeline-content";

type Props = {
  labels: TimelineControlLabels;
  total: number;
  activeIndex: number;
  activeEvent?: TimelineEvent;
  categories: readonly { name: string; count: number }[];
  category: string;
  decades: readonly TimelineDecade[];
  activeDecade?: string;
  moreOpen: boolean;
  announcement: string;
  onNavigate: (index: number) => void;
  onCategory: (category: string) => void;
  onToggleMore: () => void;
};

export function TimelineControls({ labels, total, activeIndex, activeEvent, categories, category, decades, activeDecade, moreOpen, announcement, onNavigate, onCategory, onToggleMore }: Props) {
  const atStart = activeIndex <= 0;
  const atEnd = activeIndex >= total - 1;
  const progress = total > 1 ? (activeIndex / (total - 1)) * 100 : 0;
  const style = { "--progress": `${progress}%` } as CSSProperties;

  return <div className={`timeline-controls${moreOpen ? " is-open" : ""}`} role="group" aria-label={labels.group} style={style}>
    <div className="timeline-readout">
      <span className="timeline-count"><strong>{pad(total === 0 ? 0 : activeIndex + 1)}</strong><span>/ {pad(total)}</span></span>
      {activeEvent && <span className="timeline-now">{activeEvent.year} — {activeEvent.title}</span>}
    </div>
    <Button className="timeline-step timeline-prev" aria-disabled={atStart} onClick={() => { if (!atStart) onNavigate(activeIndex - 1); }}><span aria-hidden="true">↑</span><span className="timeline-step-label">{labels.previous}</span></Button>
    <Button className="timeline-step timeline-next" aria-disabled={atEnd} onClick={() => { if (!atEnd) onNavigate(activeIndex + 1); }}><span className="timeline-step-label">{labels.next}</span><span aria-hidden="true">↓</span></Button>
    <input className="timeline-scrubber" type="range" min={0} max={Math.max(total - 1, 0)} step={1} value={activeIndex} disabled={total < 2} aria-label={labels.scrubber} aria-valuetext={activeEvent ? `${activeEvent.year}: ${activeEvent.title}` : undefined} onChange={(event) => onNavigate(Number(event.target.value))} />
    <Button className="timeline-toggle" aria-expanded={moreOpen} aria-controls="timeline-more" onClick={onToggleMore}><span>{labels.more}</span><b aria-hidden="true">+</b></Button>
    <div id="timeline-more" className="timeline-more">
      <div role="group" aria-label={labels.filters}>
        <Eyebrow>{labels.filters}</Eyebrow>
        <div className="timeline-chips">{categories.map(({ name, count }) => <Button key={name} className="timeline-chip" aria-pressed={category === name} onClick={() => onCategory(name)}>{name}<small>{count}</small></Button>)}</div>
      </div>
      {decades.length > 1 && <div role="group" aria-label={labels.decades}>
        <Eyebrow>{labels.decades}</Eyebrow>
        <div className="timeline-chips">{decades.map(({ label, index }) => <Button key={label} className="timeline-chip" aria-pressed={activeDecade === label} onClick={() => onNavigate(index)}>{label}</Button>)}</div>
      </div>}
    </div>
    <span className="sr-only" role="status">{announcement}</span>
  </div>;
}
