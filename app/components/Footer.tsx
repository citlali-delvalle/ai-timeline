import type { NavLink } from "./Header";
import { Logo } from "./Text";

type Props = { logo: string; navLabel: string; links: readonly NavLink[]; description: readonly string[]; note: string; tagline: string; backToTop: string };

export function SiteFooter({ logo, navLabel, links, description, note, tagline, backToTop }: Props) {
  return <footer><div className="footer-brand"><Logo label={logo} /><p>{description.map((line) => <span key={line}>{line}<br /></span>)}</p></div><nav className="footer-navigation" aria-label={navLabel}>{links.map(({ label, href }) => <a href={href} key={href}>{label}</a>)}</nav><div className="footer-bottom"><span>© 2026 {logo.toUpperCase()} / {note}</span><span>{tagline}</span><a href="#">{backToTop} ↑</a></div></footer>;
}
