import { Button } from "./Button";
import { Card } from "./Card";
import { Eyebrow } from "./Text";
import { eventAnchor, formatEventDate, pad, type TimelineEvent } from "../timeline-content";

type ItemProps = { event: TimelineEvent; index: number; total: number; activeIndex: number; peopleLabel: string; selectLabel: string; onSelect: (index: number) => void };

function TimelineItem({ event, index, total, activeIndex, peopleLabel, selectLabel, onSelect }: ItemProps) {
  const state = index === activeIndex ? "active" : index < activeIndex ? "past" : "upcoming";
  return <li id={eventAnchor(event.id)} className={`timeline-item is-${state}`}>
    <div className="timeline-when"><span className="timeline-year">{event.year}</span><span className="timeline-number">{pad(index + 1)} / {pad(total)}</span></div>
    <div className="timeline-rail"><Button variant="icon" className="timeline-node" aria-current={state === "active" ? "step" : undefined} aria-label={`${selectLabel}: ${event.year} — ${event.title}`} onClick={() => onSelect(index)}><span className="timeline-node-dot" aria-hidden="true" /></Button></div>
    <Card className="timeline-card">
      <div className="timeline-meta"><span className="timeline-category">{event.category}</span><time dateTime={event.date}>{formatEventDate(event.date)}</time></div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      {event.people.length > 0 && <div className="timeline-people"><Eyebrow>{peopleLabel}</Eyebrow><ul>{event.people.map((name) => <li key={name}>{name}</li>)}</ul></div>}
    </Card>
  </li>;
}

type Props = { title: string; events: readonly TimelineEvent[]; activeIndex: number; peopleLabel: string; selectLabel: string; emptyLabel: string; onSelect: (index: number) => void };

export function Timeline({ title, events, activeIndex, peopleLabel, selectLabel, emptyLabel, onSelect }: Props) {
  if (events.length === 0) return <p className="timeline-empty" role="status">{emptyLabel}</p>;
  return <ol className="timeline" aria-label={title}>{events.map((event, index) => <TimelineItem key={event.id} event={event} index={index} total={events.length} activeIndex={activeIndex} peopleLabel={peopleLabel} selectLabel={selectLabel} onSelect={onSelect} />)}</ol>;
}
