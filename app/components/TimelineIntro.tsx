import { Eyebrow } from "./Text";

type Stat = { value: string; label: string };
type Props = { kicker: string; title: string; description: string; stats: readonly Stat[] };

export function TimelineIntro({ kicker, title, description, stats }: Props) {
  return <section id="overview" className="timeline-intro"><Eyebrow><b>+</b> {kicker}</Eyebrow><h1>{title}</h1><p>{description}</p><ul className="timeline-stats">{stats.map(({ value, label }) => <li key={label}><strong>{value}</strong><span>{label}</span></li>)}</ul></section>;
}
