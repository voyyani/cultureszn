# Culture SZN Platform - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** February 4, 2026  
**Status:** Draft  

---

## Executive Summary

Culture SZN is a world-class digital platform designed to amplify Nairobi's next-generation creatives. This platform serves as the digital home for a multidisciplinary collective that blends music (Xiix, Wavy), design (Pipi), and urban youth culture into a cohesive creative ecosystem.

### Vision Statement
> "The Ecosystem Where Nairobi's Underground Becomes World-Class"

### Mission
To build a scalable, premium digital platform that maintains authentic Nairobi indie vibes while delivering world-class user experiences to global audiences.

---

## 1. Product Overview

### 1.1 Problem Statement

Nairobi's creative underground lacks a unified digital platform that:
- Showcases multidisciplinary talent cohesively
- Provides professional-grade presentation rivaling global platforms
- Maintains cultural authenticity while being globally accessible
- Enables community building and fan engagement
- Supports sustainable creative business models

### 1.2 Solution

The SZN Hub - A three-layer digital ecosystem:

| Layer | Purpose | Features |
|-------|---------|----------|
| **Public Portal** | Showcase & Discovery | Member gallery, releases, SZNals journal, events |
| **Member Network** | Creator Collaboration | Project tools, asset library, communication |
| **Community Layer** | Fan Engagement | Membership tiers, co-creation, digital-physical bridges |

### 1.3 Target Users

**Primary Users:**
1. **Fans & Followers** - Global audience discovering Nairobi's creative scene
2. **Collective Members** - Xiix, Wavy, Pipi, and future creatives
3. **Industry Partners** - Labels, brands, venues seeking collaboration

**Secondary Users:**
1. **Media & Press** - Journalists covering African culture
2. **Other Creatives** - Artists seeking inspiration or collaboration
3. **Event Organizers** - Festival and venue bookers

---

## 2. Product Strategy

### 2.1 Brand Positioning Matrix

```
┌─────────────────────────────────────────────────────────────┐
│  70% Authentic Nairobi Edge                                 │
│  ├── Gritty, innovative, community-driven                   │
│  ├── Sheng language integration                             │
│  └── Local visual references (matatu art, urban textures)   │
├─────────────────────────────────────────────────────────────┤
│  20% Polished Curation                                      │
│  ├── Design-forward presentation                            │
│  ├── Quality-focused content                                │
│  └── Intentional user experience                            │
├─────────────────────────────────────────────────────────────┤
│  10% Global Ambition                                        │
│  ├── Aspirational positioning                               │
│  ├── Boundary-pushing creativity                            │
│  └── Cultural confidence on world stage                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Key Differentiators

1. **Ecosystem, Not Just Showcase** - Enables creation, not just display
2. **Context-Preserving Globalization** - Nairobi specificity with global legibility
3. **Multi-Disciplinary by Design** - Music, design, commentary as equal pillars
4. **Digital-Physical Integration** - Seamless online/IRL experience bridges

---

## 3. Feature Requirements

### 3.1 Phase 1: Foundation (MVP)

#### 3.1.1 Landing Experience
| Feature | Priority | Description |
|---------|----------|-------------|
| Hero Section | P0 | Immersive intro with video/animation backdrop |
| Member Gallery | P0 | Interactive showcase of collective members |
| Releases Section | P0 | Latest projects with multimedia previews |
| Movement Section | P0 | Philosophy and brand story |
| SZNals Preview | P0 | Journal/blog content cards |
| Newsletter Signup | P0 | Email capture with engagement tracking |

#### 3.1.2 Navigation & Core UI
| Feature | Priority | Description |
|---------|----------|-------------|
| Sticky Header | P0 | Animated header with scroll effects |
| Mobile Navigation | P0 | Responsive hamburger menu |
| SZN Mode Toggle | P1 | Switch between Nairobi/Global content modes |
| Smooth Scrolling | P0 | Section-based navigation |
| Loading States | P1 | Skeleton loaders and transitions |

#### 3.1.3 Member Profiles
| Feature | Priority | Description |
|---------|----------|-------------|
| Profile Cards | P0 | Image, bio, role, tags |
| Detail Pages | P1 | Full member portfolio pages |
| Social Links | P0 | Platform-specific social integration |
| Discography/Portfolio | P1 | Work history and credits |

#### 3.1.4 Releases System
| Feature | Priority | Description |
|---------|----------|-------------|
| Release Cards | P0 | Cover art, title, artist, date |
| Audio Preview | P1 | Embedded streaming player |
| Visual Albums | P2 | Immersive multimedia experiences |
| External Links | P0 | Spotify, Apple Music, YouTube links |

### 3.2 Phase 2: Engagement (Q2)

#### 3.2.1 SZNals Journal
| Feature | Priority | Description |
|---------|----------|-------------|
| Article Pages | P0 | Long-form content with rich media |
| Categories | P1 | Sound, Design, Ecosystem, Culture |
| Search & Filter | P1 | Content discovery tools |
| Share Functionality | P0 | Social sharing with custom cards |

#### 3.2.2 Events Ecosystem
| Feature | Priority | Description |
|---------|----------|-------------|
| Event Listings | P0 | Upcoming shows, exhibitions, sessions |
| Event Pages | P1 | Full event details with RSVP |
| Archive | P2 | Past events with photo/video galleries |
| Calendar Integration | P2 | iCal/Google Calendar exports |

#### 3.2.3 Media Hub
| Feature | Priority | Description |
|---------|----------|-------------|
| Photo Galleries | P1 | High-resolution image collections |
| Video Player | P1 | Custom branded video experience |
| Audio Player | P0 | Persistent global audio player |
| Download Center | P2 | Press kits and assets |

### 3.3 Phase 3: Scale (Q3-Q4)

#### 3.3.1 E-Commerce Integration
| Feature | Priority | Description |
|---------|----------|-------------|
| Merchandise Store | P1 | Limited drops and evergreen items |
| Digital Products | P2 | Sample packs, presets, templates |
| Cart & Checkout | P1 | Stripe/PayPal integration |
| Order Management | P1 | Tracking and history |

#### 3.3.2 Community Features
| Feature | Priority | Description |
|---------|----------|-------------|
| Fan Membership | P2 | Tiered subscription system |
| Exclusive Content | P2 | Member-only releases and BTS |
| Discussion Spaces | P3 | Community forums or chat |
| User Profiles | P3 | Fan identity and activity |

#### 3.3.3 Mobile App
| Feature | Priority | Description |
|---------|----------|-------------|
| PWA Foundation | P1 | Offline capability, install prompts |
| Native App | P3 | iOS/Android with push notifications |
| Geolocated Content | P3 | Nairobi-specific unlockables |

---

## 4. Technical Requirements

### 4.1 Technology Stack

```
Frontend:
├── React 18+ (TypeScript)
├── Vite (Build tool)
├── React Router (Navigation)
├── Framer Motion (Animations)
├── Tailwind CSS (Styling)
├── React Query (Data fetching)
└── Zustand (State management)

Backend (Phase 2+):
├── Node.js / Express or Next.js API
├── PostgreSQL (Database)
├── Prisma (ORM)
├── Cloudinary (Media)
├── Stripe (Payments)
└── SendGrid (Email)

Infrastructure:
├── Vercel / Netlify (Hosting)
├── Cloudflare (CDN)
├── GitHub Actions (CI/CD)
└── Sentry (Error tracking)
```

### 4.2 Performance Requirements

| Metric | Target | Priority |
|--------|--------|----------|
| First Contentful Paint | < 1.5s | P0 |
| Largest Contentful Paint | < 2.5s | P0 |
| Time to Interactive | < 3.0s | P0 |
| Cumulative Layout Shift | < 0.1 | P0 |
| Lighthouse Score | > 90 | P1 |

### 4.3 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### 4.4 Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum)
- Focus indicators
- Alt text for all media

---

## 5. Design System

### 5.1 Color Palette

```css
/* Primary - Nairobi Sunset */
--burnt-orange: #FF6B35;
--sunset-purple: #6A11CB;
--deep-purple: #2575FC;

/* Neutrals */
--matte-black: #1A1A1A;
--concrete-gray: #2C3E50;
--off-white: #F5F5F5;

/* Text */
--text-primary: #E0E0E0;
--text-secondary: #AAAAAA;

/* Gradients */
--gradient-sunset: linear-gradient(135deg, #FF6B35, #6A11CB, #2575FC);
```

### 5.2 Typography

```css
/* Headings */
font-family: 'Space Grotesk', sans-serif;
weights: 400, 500, 600, 700

/* Body */
font-family: 'Inter', sans-serif;
weights: 300, 400, 500, 600
```

### 5.3 Spacing Scale

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
```

### 5.4 Component Library

Core components to build:
- Button (primary, secondary, outline, ghost)
- Card (member, release, sznal, event)
- Input (text, email, textarea)
- Modal (standard, full-screen)
- Navigation (header, mobile menu, footer)
- Media (image, video, audio player)
- Typography (headings, body, captions)
- Badge (tag, status, category)
- Loader (skeleton, spinner, progress)

---

## 6. Content Strategy

### 6.1 Content Types

| Type | Format | Frequency | Owner |
|------|--------|-----------|-------|
| Member Profiles | Structured data | As needed | Platform |
| Releases | Multimedia | Per release | Artists |
| SZNals Articles | Long-form | Weekly | Editorial |
| Events | Listings | As scheduled | Operations |
| Social Posts | Cross-platform | Daily | Marketing |

### 6.2 Localization Strategy

**Phase 1:** English primary with Sheng integration
**Phase 2:** Dynamic Sheng-to-English captions
**Phase 3:** Cultural context layers for international audiences

---

## 7. Analytics & Metrics

### 7.1 Key Performance Indicators

**Engagement Metrics:**
- Monthly Active Users (MAU)
- Average Session Duration
- Pages per Session
- Newsletter Conversion Rate
- Return Visitor Rate

**Brand Health Metrics:**
- Cultural Relevance Score (publication mentions)
- Community Growth Rate
- Cross-Member Collaboration Frequency

**Business Metrics:**
- Revenue per User (Phase 3+)
- E-commerce Conversion Rate
- Membership Retention Rate

### 7.2 Tracking Implementation

- Google Analytics 4 (page views, events)
- Mixpanel (user journeys, funnels)
- Hotjar (heatmaps, recordings)
- Custom events for audio/video engagement

---

## 8. Security & Privacy

### 8.1 Security Requirements

- HTTPS everywhere
- Input sanitization
- CORS configuration
- Rate limiting
- DDoS protection (Cloudflare)

### 8.2 Privacy Compliance

- GDPR compliance for EU visitors
- Cookie consent management
- Privacy policy and terms of service
- Data retention policies
- User data export/deletion capabilities

---

## 9. Success Criteria

### 9.1 MVP Launch (Phase 1)

- [ ] Landing page live and responsive
- [ ] All member profiles populated
- [ ] Minimum 5 releases showcased
- [ ] Newsletter capturing 500+ signups in first month
- [ ] Lighthouse score > 85
- [ ] Zero critical bugs

### 9.2 Phase 2 Completion

- [ ] SZNals journal with 10+ articles
- [ ] Event system operational
- [ ] 50% increase in session duration
- [ ] 10,000 monthly unique visitors

### 9.3 Phase 3 Completion

- [ ] E-commerce generating revenue
- [ ] Membership program launched
- [ ] PWA installable
- [ ] 100,000 monthly unique visitors

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Content delays | Medium | High | Buffer in timeline, placeholder content |
| Scope creep | High | Medium | Strict phase gating, MVP focus |
| Performance issues | Medium | High | Performance budget, monitoring |
| Low engagement | Medium | High | A/B testing, analytics-driven iteration |
| Technical debt | Medium | Medium | Code reviews, documentation |

---

## Appendix A: User Stories

### Fan/Visitor Stories
- As a fan, I want to discover all Culture SZN members so I can explore their work
- As a visitor, I want to stream/preview releases so I can decide what to follow
- As a fan, I want to sign up for updates so I don't miss new content
- As a visitor, I want to read SZNals articles so I can understand the movement

### Member Stories
- As a member, I want my profile to showcase my best work
- As a member, I want releases properly attributed and linked
- As a member, I want to share platform content easily

### Admin Stories
- As an admin, I want to update member profiles easily
- As an admin, I want to publish new releases with multimedia
- As an admin, I want to track engagement metrics

---

## Appendix B: Competitive Analysis

| Platform | Strengths | Weaknesses | Learnings |
|----------|-----------|------------|-----------|
| Odd Future (legacy) | Strong visual identity, cult following | Dated tech, inactive | Brand cohesion matters |
| Soulection | Great curation, global reach | Less personal, corporate feel | Balance curation with authenticity |
| 88rising | Multi-artist showcase, content-first | US-centric framing | Preserve cultural origin |
| Nyege Nyege | African-focused, festival integration | Limited digital presence | Digital-physical bridge essential |

---

*Document maintained by Culture SZN Product Team*
*For questions: product@culture-szn.com*
