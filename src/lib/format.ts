import { SITE } from '@/config/site'

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: SITE.timeZone,
    ...opts,
  }).format(new Date(iso))
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
