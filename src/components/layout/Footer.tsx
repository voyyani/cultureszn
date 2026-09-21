import { Link } from 'react-router-dom'
import { BrandIcon } from '@/components/icons'
import { FOOTER_LINKS } from '@/lib/constants'
import { SITE } from '@/config/site'
import type { PlatformKey } from '@/config/platforms'

const SOCIAL_LABEL: Record<keyof typeof SITE.socials, string> = { instagram: 'Instagram', youtube: 'YouTube', spotify: 'Spotify', tiktok: 'TikTok' }
const SOCIAL_ICON: Partial<Record<keyof typeof SITE.socials, PlatformKey>> = { youtube: 'youtube', spotify: 'spotify' }

const socials = (Object.keys(SOCIAL_LABEL) as Array<keyof typeof SITE.socials>)
  .filter((key) => Boolean(SITE.socials[key]))
  .map((key) => ({ key, href: SITE.socials[key] as string, name: SOCIAL_LABEL[key] }))

/* The rear of the bus: a purple LED band, the sacco name, destinations, the credit plate. */
export function Footer() {
  return (
    <footer className="mt-auto bg-bg">
      <div className="led led--band" aria-hidden />
      <div className="container-szn py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="font-display text-3xl leading-none text-fg">CULTURE <span className="text-board">SZN</span></Link>
            <p className="mt-4 max-w-sm text-fg-muted">{SITE.description}</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-3" aria-label="Culture SZN on social platforms">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                       className="flex h-11 w-11 items-center justify-center rounded-szn border border-line text-fg-muted transition-colors hover:border-fg hover:text-fg">
                      {SOCIAL_ICON[s.key] ? <BrandIcon platform={SOCIAL_ICON[s.key]!} size={18} /> : <span className="label text-xs">{s.name.slice(0, 2)}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer">
            <p className="label text-sm text-chrome">Destinations</p>
            <ul className="mt-3 flex flex-col gap-1">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="label inline-flex min-h-11 items-center text-xl text-board transition-colors hover:text-fg">{link.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label text-sm text-chrome">Base</p>
            <p className="mt-3 text-fg-muted">Nairobi, Kenya<br />Africa/Nairobi</p>
          </div>
        </div>

        <div className="chrome-rule mt-12" aria-hidden />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-fg-muted">
          <p>© {new Date().getFullYear()} Culture SZN</p>
          <p>
            Crafted by{' '}
            <a href="https://voyani.tech" target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4 decoration-chrome hover:decoration-fg">VOYANI</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
