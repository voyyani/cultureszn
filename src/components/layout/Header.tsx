import { useEffect, useId, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const DESTINATIONS = NAV_LINKS.filter((l) => l.href !== '/join')

/* The route board. Sacco name on the left, destinations in yellow condensed caps on the right,
   Join SZN as the LED-green control. On a phone the board unfolds into a full list. */
export function Header() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const main = document.getElementById('main')
    const footer = document.querySelector('footer')
    for (const el of [main, footer]) el?.toggleAttribute('inert', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('menu-open')
      for (const el of [main, footer]) el?.removeAttribute('inert')
    }
  }, [open])

  const destination = ({ isActive }: { isActive: boolean }) =>
    cn('label relative flex min-h-11 items-center text-[1.05rem] tracking-[0.1em] text-board transition-colors hover:text-fg',
      'after:absolute after:inset-x-0 after:-bottom-1 after:h-[3px] after:rounded-full after:bg-accent after:opacity-0 after:transition-opacity',
      isActive && 'text-fg after:opacity-100 after:shadow-[var(--led-glow)]')

  return (
    <header className="sticky top-0 z-50 bg-bg">
      <div className="container-szn flex min-h-16 items-center justify-between gap-6">
        <NavLink to="/" className="font-display text-[1.35rem] leading-none text-fg sm:text-2xl" aria-label="Culture SZN — home">
          CULTURE <span className="text-board">SZN</span>
        </NavLink>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {DESTINATIONS.map((item) => (
            <NavLink key={item.href} to={item.href} className={destination}>
              {item.name}
            </NavLink>
          ))}
          <NavLink
            to="/join"
            className={({ isActive }) =>
              cn('label inline-flex min-h-11 items-center rounded-szn border-2 border-accent px-5 text-[0.95rem] transition-colors',
                isActive ? 'bg-fg border-fg text-accent-fg' : 'bg-accent text-accent-fg hover:bg-fg hover:border-fg')
            }
          >
            Join SZN
          </NavLink>
        </nav>

        <button
          type="button"
          className="label flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-szn border-2 border-chrome px-3 text-board md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
        >
          <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {open ? <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2.5" /> : <path d="M2 4h16v2.5H2zM2 8.75h16v2.5H2zM2 13.5h16V16H2z" />}
          </svg>
        </button>
      </div>
      <div className="led" aria-hidden />

      <nav
        id={menuId}
        aria-label="Primary"
        hidden={!open}
        className="fixed inset-x-0 top-[calc(4rem+3px)] bottom-0 z-40 flex flex-col bg-bg md:hidden"
      >
        <ul className="container-szn flex flex-col divide-y divide-line pt-2">
          {DESTINATIONS.map((item) => (
            <li key={item.href}>
              <NavLink to={item.href} onClick={() => setOpen(false)} className={({ isActive }) => cn('label flex min-h-16 items-center text-3xl text-board', isActive && 'text-fg')}>
                <span className="mr-4 text-chrome" aria-hidden>▸</span>{item.name}
              </NavLink>
            </li>
          ))}
          <li className="pt-6">
            <NavLink to="/join" onClick={() => setOpen(false)} className="label flex min-h-14 items-center justify-center rounded-szn bg-accent text-xl text-accent-fg">
              Join SZN
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
