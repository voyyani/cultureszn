import type { ComponentPropsWithoutRef } from 'react'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'

/* The MDX body in the world's reading register: display headings, a readable measure, chrome rules. */
export const mdxComponents = {
  h2: (p: ComponentPropsWithoutRef<'h2'>) => <h2 className="mt-10 mb-4 text-2xl sm:text-3xl" {...p} />,
  h3: (p: ComponentPropsWithoutRef<'h3'>) => <h3 className="mt-8 mb-3 text-xl sm:text-2xl" {...p} />,
  p: (p: ComponentPropsWithoutRef<'p'>) => <p className="my-5 text-lg leading-relaxed text-fg" {...p} />,
  a: (p: ComponentPropsWithoutRef<'a'>) => <a className="text-board underline decoration-chrome underline-offset-4 hover:decoration-fg" {...p} />,
  blockquote: (p: ComponentPropsWithoutRef<'blockquote'>) => (
    <div className="my-8">
      <span className="led mb-4 block w-16" aria-hidden />
      <blockquote className="font-display text-xl text-fg sm:text-2xl" {...p} />
    </div>
  ),
  ul: (p: ComponentPropsWithoutRef<'ul'>) => <ul className="my-5 list-disc space-y-2 pl-6 text-lg text-fg" {...p} />,
  ol: (p: ComponentPropsWithoutRef<'ol'>) => <ol className="my-5 list-decimal space-y-2 pl-6 text-lg text-fg" {...p} />,
  hr: () => <div className="chrome-rule my-10" aria-hidden />,
  img: ({ src, alt }: ComponentPropsWithoutRef<'img'>) =>
    src ? <CloudinaryImage src={String(src)} alt={alt ?? ''} width={960} sizes="(min-width: 768px) 64ch, 100vw" className="my-8 w-full rounded-szn border border-line" /> : null,
}
