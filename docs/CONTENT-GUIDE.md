# Content Guide — SZNals

SZNals are MDX files in `content/sznals/`. No CMS; a pull request is a publish.

## Add an article

1. Create `content/sznals/<slug>.mdx`. **The filename is the URL slug**: lowercase, hyphens, no spaces (`/sznals/<slug>`).
2. Start the file with the `meta` export — every field is required except `cover`:

   ```mdx
   export const meta = {
     title: 'Street Gospel: The Making of a Movement',
     excerpt: 'One or two sentences shown on cards and in share previews.',
     category: 'Artist Spotlight',        // Sound & Culture · Design & Visuals · Ecosystem · Behind The Scenes · Artist Spotlight
     author: 'Culture SZN Editorial',
     publishedDate: '2026-03-14',         // ISO date, shown in en-KE
     readTime: '9 min read',
     status: 'draft',                     // 'draft' | 'published'
     cover: 'https://res.cloudinary.com/<cloud>/image/upload/v1/sznals/<slug>.jpg', // optional
   }
   ```

3. Write the body below the `meta` block in Markdown. Headings start at `##` (the page supplies the `<h1>`). Images: `![alt text](https://res.cloudinary.com/…)` — always with alt text; the site applies `f_auto,q_auto,w_` transforms automatically.
4. Keep `status: 'draft'` while writing. Drafts appear under "In the works" with no link; nothing 404s.
5. To go live set `status: 'published'`. The article gets a page, a card, and a share preview.

## Before you commit

```bash
npm test        # content tests, link integrity
npm run build   # each article compiles to its own chunk
```

Commit with `content: <title>` and open a PR.

## House style

- The collective is **Culture SZN**. The artist is **XiiX**. The journal is **SZNals**. Don't "correct" these.
- No invented stats, testimonials, or stock photos. If there's no image, leave `cover` out.
- Write for someone reading on a phone over metered data: short paragraphs, one idea each.
