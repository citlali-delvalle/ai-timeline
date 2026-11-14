import { Logo } from "./Text";

export type NavLink = { label: string; href: string };

type Props = { logo: string; navLabel: string; links: readonly NavLink[]; status: string };

export function SiteHeader({ logo, navLabel, links, status }: Props) {
  return <header><Logo label={logo} /><nav aria-label={navLabel}>{links.map(({ label, href }) => <a href={href} key={href}>{label}</a>)}</nav><span className="available"><i /> {status}</span></header>;
}
