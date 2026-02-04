# Culture SZN - Phase 1 Implementation Guide

**Version:** 1.0  
**Duration:** 10 weeks (Q1 2026)  
**Goal:** Launch world-class MVP landing experience  
**Status:** 🟡 In Progress

---

## Executive Summary

Phase 1 establishes Culture SZN's digital foundation—a stunning, performant landing experience that captures Nairobi's creative energy. This document provides granular implementation details for delivering a world-class MVP.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PHASE 1: FOUNDATION OVERVIEW                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Week 1-2        Week 3-4        Week 5-6        Week 7-8        Week 9-10 │
│  ════════        ════════        ════════        ════════        ═════════ │
│                                                                             │
│  ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐     ┌──────────┐  │
│  │ SETUP  │────▶│ DESIGN │────▶│LANDING │────▶│PROFILES│────▶│  LAUNCH  │  │
│  │ INFRA  │     │ SYSTEM │     │  PAGE  │     │RELEASES│     │  POLISH  │  │
│  └────────┘     └────────┘     └────────┘     └────────┘     └──────────┘  │
│                                                                             │
│  • Vite + React  • 15+ Comps   • Hero         • Member Pages  • SEO        │
│  • Tailwind      • Storybook   • Members      • Release Pages • Analytics  │
│  • Router        • Typography  • Releases     • Data Layer    • A11y       │
│  • CI/CD         • Motion      • Movement     • Streaming     • Deploy     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Design System Specification

### Color Palette — "Nairobi Sunset"

The palette captures Nairobi's golden hour—warm, bold, and unmistakably African.

```css
/* Primary Colors */
--burnt-orange: #FF6B35;      /* Primary accent - energy, creativity */
--sunset-purple: #6A11CB;     /* Secondary accent - depth, mystery */
--deep-purple: #2575FC;       /* Tertiary accent - trust, innovation */

/* Neutral Colors */
--matte-black: #1A1A1A;       /* Primary background */
--concrete-gray: #2C3E50;     /* Secondary background, cards */
--off-white: #F5F5F5;         /* Light mode background (future) */

/* Text Colors */
--text-primary: #E0E0E0;      /* Main text - high contrast */
--text-secondary: #AAAAAA;    /* Supporting text */
--text-muted: #666666;        /* Disabled, hints */

/* Semantic Colors */
--success: #10B981;           /* Success states */
--warning: #F59E0B;           /* Warning states */
--error: #EF4444;             /* Error states */
--info: #3B82F6;              /* Info states */

/* Gradients */
--gradient-sunset: linear-gradient(135deg, #FF6B35 0%, #6A11CB 50%, #2575FC 100%);
--gradient-subtle: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(106, 17, 203, 0.1) 100%);
--gradient-glow: radial-gradient(circle at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%);

/* Effects */
--accent-glow: rgba(255, 107, 53, 0.15);
--shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.2);
--shadow-glow: 0 0 30px rgba(255, 107, 53, 0.4);
--shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
```

### Typography System

```css
/* Font Families */
--font-heading: 'Space Grotesk', -apple-system, sans-serif;
--font-body: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Type Scale (1.25 ratio) */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 5rem;        /* 80px - Hero headlines */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.1;
--leading-snug: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;

/* Letter Spacing */
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

### Spacing & Layout

```css
/* Spacing Scale */
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */

/* Container Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1400px;

/* Border Radius */
--radius-none: 0;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Animation & Motion

```css
/* Timing Functions */
--ease-default: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Durations */
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;

/* Framer Motion Variants */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
};
```

---

## Project Architecture

### Directory Structure

```
cultureszn/
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg              # Open Graph image (1200x630)
│   ├── apple-touch-icon.png
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   │   ├── SpaceGrotesk-Variable.woff2
│   │   │   └── Inter-Variable.woff2
│   │   ├── images/
│   │   │   ├── members/
│   │   │   ├── releases/
│   │   │   ├── sznals/
│   │   │   └── brand/
│   │   └── icons/
│   │       └── social/
│   │
│   ├── components/
│   │   ├── ui/                   # Primitive UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Typography/
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Container/
│   │   │   ├── Section/
│   │   │   └── index.ts
│   │   │
│   │   ├── sections/             # Page sections
│   │   │   ├── Hero/
│   │   │   ├── MembersGallery/
│   │   │   ├── ReleasesShowcase/
│   │   │   ├── Movement/
│   │   │   ├── SZNalsGrid/
│   │   │   └── Newsletter/
│   │   │
│   │   └── shared/               # Shared/composite components
│   │       ├── MemberCard/
│   │       ├── ReleaseCard/
│   │       ├── SZNalCard/
│   │       ├── SocialLinks/
│   │       ├── ModeSwitch/
│   │       └── StatCounter/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   └── index.ts
│   │   ├── Member/
│   │   │   ├── Member.tsx
│   │   │   └── index.ts
│   │   ├── Release/
│   │   │   ├── Release.tsx
│   │   │   └── index.ts
│   │   └── NotFound/
│   │
│   ├── hooks/
│   │   ├── useScrollPosition.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx      # Nairobi/Global mode
│   │   └── index.ts
│   │
│   ├── data/
│   │   ├── members.ts
│   │   ├── releases.ts
│   │   ├── sznals.ts
│   │   └── navigation.ts
│   │
│   ├── lib/
│   │   ├── utils.ts              # Utility functions
│   │   ├── cn.ts                 # Class name merger
│   │   └── constants.ts
│   │
│   ├── styles/
│   │   ├── globals.css           # Global styles + Tailwind
│   │   ├── fonts.css             # Font declarations
│   │   └── animations.css        # Keyframe animations
│   │
│   ├── types/
│   │   ├── member.ts
│   │   ├── release.ts
│   │   ├── sznal.ts
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml                # Lint, test, build
│       └── deploy.yml            # Vercel deployment
│
├── .husky/
│   ├── pre-commit
│   └── commit-msg
│
├── docs/
│   ├── PRD.md
│   ├── ROADMAP.md
│   └── PHASE1_IMPLEMENTATION.md
│
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Sprint Breakdown

---

## Sprint 1-2: Project Setup & Core Infrastructure
**Weeks 1-2 | Jan 6 - Feb 2, 2026**

### Sprint Goals
- ✅ Fully operational development environment
- ✅ Design system tokens implemented in code
- ✅ Staging deployment accessible
- ✅ CI/CD pipeline running

### Detailed Tasks

#### 1.1 Initialize React + Vite + TypeScript ✅ In Progress
**Priority:** P0 | **Estimate:** 4 hours

```bash
# Project initialization
npm create vite@latest cultureszn -- --template react-ts
cd cultureszn
npm install
```

**Dependencies to Install:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "framer-motion": "^10.18.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "@typescript-eslint/parser": "^6.18.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "postcss": "^8.4.33",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.11",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.0",
    "vite": "^5.0.11"
  }
}
```

**Acceptance Criteria:**
- [ ] `npm run dev` starts development server
- [ ] TypeScript compiles without errors
- [ ] Hot module replacement works
- [ ] Path aliases configured (`@/` → `src/`)

---

#### 1.2 Setup Tailwind CSS with Custom Theme
**Priority:** P0 | **Estimate:** 6 hours

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary
        'burnt-orange': '#FF6B35',
        'sunset-purple': '#6A11CB',
        'deep-purple': '#2575FC',
        
        // Neutral
        'matte-black': '#1A1A1A',
        'concrete-gray': '#2C3E50',
        'off-white': '#F5F5F5',
        
        // Text
        'text-primary': '#E0E0E0',
        'text-secondary': '#AAAAAA',
        'text-muted': '#666666',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '7xl': ['5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'szn': '12px',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 30px rgba(255, 107, 53, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-sunset': 'linear-gradient(135deg, #FF6B35 0%, #6A11CB 50%, #2575FC 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(106, 17, 203, 0.1) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.6)' },
        },
      },
      transitionTimingFunction: {
        'szn': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

export default config
```

**Acceptance Criteria:**
- [ ] All design tokens available as Tailwind classes
- [ ] Custom fonts loading correctly
- [ ] Gradient utilities working
- [ ] Animation utilities functional

---

#### 1.3 Configure ESLint, Prettier, Husky
**Priority:** P0 | **Estimate:** 3 hours

**.eslintrc.cjs:**
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
}
```

**.prettierrc:**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Husky Setup:**
```bash
npx husky-init && npm install
npx husky add .husky/pre-commit "npx lint-staged"
```

**lint-staged config in package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

**Acceptance Criteria:**
- [ ] ESLint runs on commit
- [ ] Prettier formats on save
- [ ] Husky blocks commits with lint errors

---

#### 1.4 Setup React Router with Route Structure
**Priority:** P0 | **Estimate:** 4 hours

**src/App.tsx:**
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Home } from '@/pages/Home'
import { Member } from '@/pages/Member'
import { Release } from '@/pages/Release'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/members/:slug" element={<Member />} />
          <Route path="/releases/:slug" element={<Release />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

**Route Structure:**
```
/                       → Home (Landing page)
/members/:slug          → Member profile (e.g., /members/xiix)
/releases/:slug         → Release detail (e.g., /releases/nairobi-nights)
/sznals                 → SZNals listing (Phase 2)
/sznals/:slug           → SZNal article (Phase 2)
/events                 → Events listing (Phase 2)
```

**Acceptance Criteria:**
- [ ] All routes render correctly
- [ ] 404 page shows for unknown routes
- [ ] Navigation updates URL without reload
- [ ] Browser back/forward works

---

#### 1.5 Create Design Tokens and CSS Variables
**Priority:** P0 | **Estimate:** 4 hours

**src/styles/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors */
    --burnt-orange: 255 107 53;
    --sunset-purple: 106 17 203;
    --deep-purple: 37 117 252;
    --matte-black: 26 26 26;
    --concrete-gray: 44 62 80;
    --off-white: 245 245 245;
    --text-primary: 224 224 224;
    --text-secondary: 170 170 170;
    
    /* Spacing */
    --section-padding: 100px;
    --container-padding: 20px;
    
    /* Transitions */
    --transition-default: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-matte-black text-text-primary font-body antialiased;
    line-height: 1.6;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading font-bold;
    line-height: 1.2;
  }
  
  /* Gradient text utility */
  .text-gradient {
    @apply bg-gradient-sunset bg-clip-text text-transparent;
  }
  
  /* Glow effect */
  .glow-orange {
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.4);
  }
  
  /* Selection styling */
  ::selection {
    @apply bg-burnt-orange text-white;
  }
}

@layer components {
  .container-szn {
    @apply w-full max-w-[1400px] mx-auto px-5;
  }
  
  .section-szn {
    @apply py-24;
  }
}
```

**Acceptance Criteria:**
- [ ] CSS variables accessible throughout app
- [ ] Tailwind classes work with custom tokens
- [ ] Gradient text utility functional
- [ ] Base styles applied correctly

---

#### 1.6 Setup Framer Motion for Animations
**Priority:** P1 | **Estimate:** 4 hours

**src/lib/motion.ts:**
```typescript
import { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { opacity: 0, y: -20 }
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { opacity: 0 }
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
}

export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}
```

**src/hooks/useScrollAnimation.ts:**
```typescript
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useScrollAnimation(options = { once: true, amount: 0.3 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, options)
  
  return { ref, isInView }
}
```

**Acceptance Criteria:**
- [ ] Animation variants exported and reusable
- [ ] Scroll animations trigger correctly
- [ ] Animations maintain 60fps
- [ ] Motion reduced for users with preference

---

#### 1.7 Configure GitHub Actions for CI/CD
**Priority:** P1 | **Estimate:** 3 hours

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run typecheck
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Acceptance Criteria:**
- [ ] CI runs on every PR
- [ ] Builds fail if lint errors
- [ ] TypeScript errors block merge
- [ ] Production deploys on main merge

---

#### 1.8 Deploy Staging Environment
**Priority:** P0 | **Estimate:** 2 hours

**Steps:**
1. Create Vercel project linked to GitHub repo
2. Configure environment variables
3. Set up preview deployments for PRs
4. Configure production domain (when ready)

**Vercel Configuration (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

**Acceptance Criteria:**
- [ ] Staging URL accessible (cultureszn-staging.vercel.app)
- [ ] Preview URLs generated for PRs
- [ ] Environment variables configured
- [ ] HTTPS enabled

---

### Sprint 1-2 Deliverables Checklist

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Development environment operational | ⬜ | `npm run dev` working |
| Staging URL accessible | ⬜ | Vercel preview link |
| Design system foundation in code | ⬜ | Tailwind config + CSS vars |
| CI/CD pipeline running | ⬜ | GitHub Actions passing |
| Git hooks preventing bad commits | ⬜ | Husky + lint-staged |

---

## Sprint 3-4: Core Components & Design System
**Weeks 3-4 | Feb 3 - Mar 2, 2026**

### Sprint Goals
- ✅ 15+ reusable UI components built
- ✅ Storybook documentation live
- ✅ All components responsive & accessible

### Component Library

#### 3.1 Button Component
**Priority:** P0 | **Estimate:** 4 hours

**src/components/ui/Button/Button.tsx:**
```tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 rounded-szn font-heading font-semibold transition-all duration-300 ease-szn disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-sunset text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5',
        outline: 'bg-transparent text-text-primary border-2 border-white/10 hover:border-burnt-orange hover:bg-burnt-orange/5',
        ghost: 'bg-transparent text-text-primary hover:bg-white/5',
        link: 'bg-transparent text-burnt-orange underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Variants:**
- `primary` - Gradient background, main CTAs
- `outline` - Bordered, secondary actions
- `ghost` - Minimal, tertiary actions
- `link` - Text link style

**Sizes:**
- `sm` - Small buttons, inline actions
- `md` - Default size
- `lg` - Hero CTAs
- `xl` - Extra large hero buttons
- `icon` - Icon-only buttons

---

#### 3.2 Card Component System
**Priority:** P0 | **Estimate:** 6 hours

**src/components/ui/Card/Card.tsx:**
```tsx
import { forwardRef, HTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white/[0.03]',
      elevated: 'bg-white/[0.03] shadow-card',
      bordered: 'bg-transparent border border-white/5',
      glass: 'bg-white/[0.03] backdrop-blur-lg',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-szn transition-all duration-300',
          variants[variant],
          hover && 'hover:-translate-y-2 hover:border-burnt-orange/30 hover:shadow-glow',
          className
        )}
        whileHover={hover ? { y: -8 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

const CardImage = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
)

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)

Card.displayName = 'Card'
CardImage.displayName = 'CardImage'
CardContent.displayName = 'CardContent'

export { Card, CardImage, CardContent }
```

---

#### 3.3 Typography Components
**Priority:** P0 | **Estimate:** 4 hours

**src/components/ui/Typography/Typography.tsx:**
```tsx
import { forwardRef, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const headingVariants = cva('font-heading font-bold', {
  variants: {
    size: {
      h1: 'text-5xl md:text-6xl lg:text-7xl leading-tight',
      h2: 'text-4xl md:text-5xl leading-tight',
      h3: 'text-2xl md:text-3xl',
      h4: 'text-xl md:text-2xl',
      h5: 'text-lg md:text-xl',
      h6: 'text-base md:text-lg',
    },
    gradient: {
      true: 'bg-gradient-sunset bg-clip-text text-transparent',
    },
  },
  defaultVariants: {
    size: 'h2',
  },
})

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, gradient, as, children, ...props }, ref) => {
    const Component = as || size || 'h2'
    
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, gradient, className }))}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

const textVariants = cva('font-body', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    color: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      muted: 'text-text-muted',
      orange: 'text-burnt-orange',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'primary',
    weight: 'normal',
  },
})

interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div'
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, color, weight, as = 'p', children, ...props }, ref) => {
    const Component = as
    
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, color, weight, className }))}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading.displayName = 'Heading'
Text.displayName = 'Text'
```

---

#### 3.4 Header/Navigation
**Priority:** P0 | **Estimate:** 6 hours

**src/components/layout/Header/Header.tsx:**
```tsx
import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Members', href: '/#members' },
  { name: 'Releases', href: '/#releases' },
  { name: 'Movement', href: '/#movement' },
  { name: 'SZNals', href: '/#sznals' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'py-4 bg-matte-black/90 backdrop-blur-lg shadow-lg'
          : 'py-6 bg-transparent'
      )}
    >
      <div className="container-szn">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <span className="font-heading font-bold text-2xl bg-gradient-sunset bg-clip-text text-transparent">
              CULTURE<span className="font-light">SZN</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'font-medium text-base relative py-2 transition-colors',
                    'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5',
                    'after:bg-gradient-sunset after:transition-all after:duration-300',
                    'hover:after:w-full',
                    isActive && 'text-burnt-orange after:w-full'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
            <Button variant="outline" size="md">
              Join SZN
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden relative z-10 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-matte-black border-t border-white/5"
          >
            <nav className="container-szn py-8 flex flex-col gap-6">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium"
                >
                  {item.name}
                </NavLink>
              ))}
              <Button variant="primary" size="lg" className="mt-4">
                Join SZN
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

---

#### 3.5 Footer Component
**Priority:** P0 | **Estimate:** 4 hours

**src/components/layout/Footer/Footer.tsx:**
```tsx
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const footerLinks = {
  collective: [
    { name: 'Members', href: '/#members' },
    { name: 'Releases', href: '/#releases' },
    { name: 'SZNals', href: '/#sznals' },
    { name: 'Events', href: '/events' },
    { name: 'Collaborate', href: '/collaborate' },
  ],
  platform: [
    { name: 'SZN Hub', href: '/hub' },
    { name: 'Community', href: '/community' },
    { name: 'Merchandise', href: '/merch' },
    { name: 'Live Sessions', href: '/sessions' },
    { name: 'Archives', href: '/archives' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/cultureszn' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/cultureszn' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/cultureszn' },
]

export function Footer() {
  return (
    <footer className="bg-black/50 border-t border-white/5">
      <div className="container-szn py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-heading font-bold text-3xl bg-gradient-sunset bg-clip-text text-transparent">
                CULTURE SZN
              </span>
            </Link>
            <p className="text-text-secondary mb-8">
              Nairobi's multidisciplinary creative ecosystem. Where music, 
              design, and culture converge to define Africa's contemporary avant-garde.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center
                           transition-all duration-300 hover:bg-gradient-sunset hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Collective Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Collective</h4>
            <ul className="space-y-4">
              {footerLinks.collective.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-text-secondary hover:text-burnt-orange 
                             hover:pl-1 transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-text-secondary hover:text-burnt-orange 
                             hover:pl-1 transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Join The SZN</h4>
            <p className="text-text-secondary mb-6">
              Stay connected with Nairobi's creative pulse.
            </p>
            <form className="space-y-4">
              <Input
                type="email"
                placeholder="Your email address"
                className="w-full"
              />
              <Button variant="primary" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 text-center text-text-secondary text-sm">
          <p>© 2026 Culture SZN. All rights reserved. Nairobi, Kenya.</p>
          <p className="mt-2">
            World-class branding from an authentically Nairobi perspective.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

---

#### 3.6 Additional Components

| Component | Priority | Estimate | Description |
|-----------|----------|----------|-------------|
| Input/Form | P1 | 4h | Text input, textarea, form elements |
| Modal/Overlay | P1 | 4h | Dialog, drawer, overlay components |
| Badge/Tag | P1 | 2h | Status badges, category tags |
| StatCounter | P1 | 2h | Animated number counter |
| SocialLinks | P1 | 1h | Social media icons row |
| ModeSwitch | P1 | 2h | Nairobi/Global mode toggle |
| Skeleton | P2 | 2h | Loading skeleton screens |
| Toast | P2 | 3h | Notification toasts |
| Tooltip | P2 | 2h | Hover tooltips |
| Dropdown | P2 | 3h | Dropdown menus |

---

### Sprint 3-4 Deliverables Checklist

| Deliverable | Status | Notes |
|-------------|--------|-------|
| 15+ components built | ⬜ | Button, Card, Typography, etc. |
| Storybook documentation | ⬜ | Interactive component gallery |
| Responsive behavior verified | ⬜ | Mobile-first tested |
| Accessibility audit passed | ⬜ | WCAG 2.1 AA compliant |
| Component exports organized | ⬜ | Clean import paths |

---

## Sprint 5-6: Landing Page Implementation
**Weeks 5-6 | Mar 3 - Mar 30, 2026**

### Sprint Goals
- ✅ Complete landing page with all sections
- ✅ Smooth animations (60fps)
- ✅ Fully responsive on all devices

### Section Implementations

#### 5.1 Hero Section
**Priority:** P0 | **Estimate:** 8 hours

**src/components/sections/Hero/Hero.tsx:**
```tsx
import { motion } from 'framer-motion'
import { PlayCircle, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatCounter } from '@/components/shared/StatCounter'
import { fadeInUp, staggerContainer } from '@/lib/motion'

const stats = [
  { value: 8, suffix: '+', label: 'Creative Members' },
  { value: 24, suffix: '+', label: 'Projects Released' },
  { value: 3, suffix: '', label: 'Disciplines Converged' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: `url('/images/hero-bg.jpg')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-sunset opacity-40 mix-blend-multiply" />
      </div>

      <div className="container-szn relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl"
        >
          {/* Headline */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight"
          >
            Where Nairobi's{' '}
            <span className="bg-gradient-sunset bg-clip-text text-transparent">
              Underground
            </span>{' '}
            Becomes World-Class
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl"
          >
            Culture SZN is the multidisciplinary ecosystem amplifying Nairobi's 
            next-generation creatives. We're the city's creative nervous system—
            where music, design, and cultural expression converge.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Button variant="primary" size="lg">
              <PlayCircle size={20} />
              Enter The Ecosystem
            </Button>
            <Button variant="outline" size="lg">
              <Headphones size={20} />
              Latest Releases
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-10 md:gap-16"
          >
            {stats.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

---

#### 5.2 Members Gallery
**Priority:** P0 | **Estimate:** 8 hours

**Features:**
- Grid of member cards with hover animations
- Image zoom on hover
- Tag display for skills/roles
- Link to individual member pages

---

#### 5.3 Releases Section
**Priority:** P0 | **Estimate:** 8 hours

**Features:**
- Featured release highlight card
- List of recent releases
- Album art thumbnails
- Stream now CTAs
- Hover slide animations

---

#### 5.4 Movement/Philosophy Section
**Priority:** P0 | **Estimate:** 4 hours

**Features:**
- Large quote with decorative quotes
- Philosophy statement
- Impact statistics
- Background image with overlay

---

#### 5.5 SZNals Preview Grid
**Priority:** P0 | **Estimate:** 6 hours

**Features:**
- Grid of article cards
- Category labels
- Publication date and read time
- Image thumbnails
- Hover animations

---

#### 5.6 Newsletter Section
**Priority:** P0 | **Estimate:** 3 hours

**Features:**
- Email input field
- Submit button with loading state
- Success/error messaging
- Privacy policy link

---

#### 5.7 SZN Mode Toggle
**Priority:** P1 | **Estimate:** 4 hours

**src/components/shared/ModeSwitch/ModeSwitch.tsx:**
```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

export function ModeSwitch() {
  const [isNairobiMode, setIsNairobiMode] = useState(true)

  return (
    <motion.button
      onClick={() => setIsNairobiMode(!isNairobiMode)}
      className="fixed bottom-8 right-8 z-50 bg-gradient-sunset text-white 
                 rounded-full px-6 py-3 font-semibold shadow-soft
                 flex items-center gap-3 hover:scale-105 transition-transform"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Globe size={20} />
      <span>{isNairobiMode ? 'Nairobi Mode' : 'Global Mode'}</span>
    </motion.button>
  )
}
```

---

### Sprint 5-6 Deliverables Checklist

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Hero section complete | ⬜ | Animations working |
| Members gallery complete | ⬜ | Cards interactive |
| Releases section complete | ⬜ | Featured + list |
| Movement section complete | ⬜ | Quote styled |
| SZNals grid complete | ⬜ | Cards responsive |
| Footer with newsletter | ⬜ | Form functional |
| Mobile responsive polish | ⬜ | All breakpoints |
| 60fps animations | ⬜ | Performance verified |

---

## Sprint 7-8: Member Profiles & Releases
**Weeks 7-8 | Mar 31 - Apr 13, 2026**

### Sprint Goals
- ✅ 3 member profile pages (Xiix, Wavy, Pipi)
- ✅ Release detail pages with media
- ✅ Streaming platform integrations

### Data Layer

**src/types/member.ts:**
```typescript
export interface Member {
  id: string
  slug: string
  name: string
  role: string
  bio: string
  image: string
  coverImage?: string
  tags: string[]
  social: {
    instagram?: string
    twitter?: string
    spotify?: string
    soundcloud?: string
    youtube?: string
  }
  discography: Release[]
  collaborations?: string[]
  joinedDate: string
}
```

**src/types/release.ts:**
```typescript
export interface Release {
  id: string
  slug: string
  title: string
  artist: string | string[]
  artistSlugs: string[]
  type: 'single' | 'ep' | 'album' | 'visual-album' | 'instrumental'
  releaseDate: string
  coverArt: string
  description?: string
  tracks?: Track[]
  streamingLinks: {
    spotify?: string
    appleMusic?: string
    youtube?: string
    soundcloud?: string
    audiomack?: string
    boomplay?: string
  }
  credits?: Credit[]
  featured?: boolean
}

export interface Track {
  number: number
  title: string
  duration: string
  previewUrl?: string
}

export interface Credit {
  role: string
  name: string
}
```

---

### Member Profile Page

**src/pages/Member/Member.tsx:**
```tsx
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMemberBySlug } from '@/data/members'
import { ReleaseCard } from '@/components/shared/ReleaseCard'
import { SocialLinks } from '@/components/shared/SocialLinks'
import { fadeInUp, staggerContainer } from '@/lib/motion'

export function Member() {
  const { slug } = useParams<{ slug: string }>()
  const member = getMemberBySlug(slug!)

  if (!member) {
    return <div>Member not found</div>
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${member.coverImage || member.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/50 to-transparent" />
        
        <div className="container-szn relative z-10 pb-12">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-6xl md:text-7xl font-heading font-bold mb-4"
            >
              {member.name}
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-burnt-orange font-medium mb-6"
            >
              {member.role}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <SocialLinks links={member.social} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bio */}
      <section className="section-szn">
        <div className="container-szn">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-heading font-bold mb-6">About</h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              {member.bio}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-8">
              {member.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-burnt-orange/10 text-burnt-orange 
                           rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discography */}
      <section className="section-szn bg-gradient-subtle">
        <div className="container-szn">
          <h2 className="text-3xl font-heading font-bold mb-10">Discography</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {member.discography.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

---

### Release Detail Page

**Features:**
- Large album art display
- Track listing with preview buttons
- Streaming platform buttons
- Artist credits
- Related releases

---

### Sprint 7-8 Deliverables Checklist

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Member page template | ⬜ | Dynamic routing works |
| Xiix profile page | ⬜ | Content populated |
| Wavy profile page | ⬜ | Content populated |
| Pipi profile page | ⬜ | Content populated |
| Release detail pages | ⬜ | Template complete |
| Streaming links working | ⬜ | External links open |
| Social links integration | ⬜ | All platforms linked |
| Audio preview integration | ⬜ | Play/pause functional |

---

## Sprint 9-10: Polish, Testing & Launch
**Weeks 9-10 | Apr 14 - Apr 30, 2026**

### Sprint Goals
- ✅ Lighthouse score > 90
- ✅ Zero critical bugs
- ✅ Production site live

### Performance Optimization

#### Image Optimization
```tsx
// Use next-gen formats
<picture>
  <source srcSet="/images/hero.avif" type="image/avif" />
  <source srcSet="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Hero" loading="lazy" />
</picture>
```

#### Code Splitting
```tsx
// Lazy load pages
const Member = lazy(() => import('@/pages/Member'))
const Release = lazy(() => import('@/pages/Release'))

// Wrap in Suspense
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/members/:slug" element={<Member />} />
  </Routes>
</Suspense>
```

#### Bundle Analysis
```bash
npm run build -- --analyze
```

---

### SEO Implementation

**src/components/SEO/SEO.tsx:**
```tsx
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
}

export function SEO({
  title = 'Culture SZN | Nairobi\'s Creative Ecosystem',
  description = 'The multidisciplinary ecosystem amplifying Nairobi\'s next-generation creatives. Music, design, and cultural expression converge.',
  image = '/og-image.jpg',
  url = 'https://cultureszn.com',
  type = 'website',
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  )
}
```

---

### Accessibility Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Color contrast ratio ≥ 4.5:1 | ⬜ | Text on backgrounds |
| Focus states visible | ⬜ | All interactive elements |
| Alt text on images | ⬜ | Descriptive text |
| ARIA labels on icons | ⬜ | Icon-only buttons |
| Keyboard navigation | ⬜ | Tab order logical |
| Screen reader testing | ⬜ | VoiceOver/NVDA |
| Reduced motion support | ⬜ | `prefers-reduced-motion` |

---

### Analytics Integration

**Google Analytics 4:**
```typescript
// src/lib/analytics.ts
export const GA_TRACKING_ID = process.env.VITE_GA_TRACKING_ID

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
```

**Key Events to Track:**
- Page views
- Newsletter signups
- Stream button clicks
- Social link clicks
- Member profile views
- Release page views
- Time on page

---

### Launch Checklist

#### Pre-Launch
- [ ] All content reviewed and approved
- [ ] All links verified working
- [ ] Forms tested (newsletter signup)
- [ ] 404 page tested
- [ ] Favicon and app icons in place
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Analytics verified
- [ ] Error tracking (Sentry) configured

#### Technical
- [ ] Production build successful
- [ ] Lighthouse scores > 90
- [ ] Cross-browser testing complete
- [ ] Mobile device testing complete
- [ ] Load testing passed
- [ ] Security headers configured

#### Domain & DNS
- [ ] Domain registered (cultureszn.com)
- [ ] SSL certificate active
- [ ] DNS configured correctly
- [ ] www redirect working
- [ ] Old URLs redirected (if applicable)

#### Launch Day
- [ ] Deploy to production
- [ ] Verify site is accessible
- [ ] Test critical user flows
- [ ] Monitor error tracking
- [ ] Announce on social channels

---

### Sprint 9-10 Deliverables Checklist

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Lighthouse > 90 | ⬜ | All categories |
| SEO implemented | ⬜ | Meta, OG tags |
| Analytics live | ⬜ | GA4 tracking |
| Accessibility audit passed | ⬜ | WCAG 2.1 AA |
| Cross-browser tested | ⬜ | Chrome, Safari, Firefox |
| Mobile tested | ⬜ | iOS, Android |
| Error tracking live | ⬜ | Sentry configured |
| Production deployed | ⬜ | cultureszn.com |
| Zero P0/P1 bugs | ⬜ | All resolved |

---

## Success Metrics

### Technical KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance | > 90 | PageSpeed Insights |
| Lighthouse Accessibility | > 90 | PageSpeed Insights |
| Lighthouse Best Practices | > 90 | PageSpeed Insights |
| Lighthouse SEO | > 90 | PageSpeed Insights |
| Time to First Byte (TTFB) | < 200ms | WebPageTest |
| Largest Contentful Paint (LCP) | < 2.5s | Core Web Vitals |
| First Input Delay (FID) | < 100ms | Core Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Core Web Vitals |
| Bundle Size | < 200KB gzipped | Build output |

### Business KPIs (First Month)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Newsletter Signups | 500+ | Analytics |
| Monthly Unique Visitors | 5,000+ | Analytics |
| Average Session Duration | > 2 minutes | Analytics |
| Bounce Rate | < 50% | Analytics |
| Mobile Traffic | > 60% | Analytics |
| Social Shares | 100+ | Social analytics |

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Content delays | High | Medium | Use placeholder content, parallel tracks |
| Design iterations | Medium | Medium | Freeze design by Week 4 |
| Performance issues | Medium | High | Performance budget, continuous testing |
| Third-party outages | Low | Medium | Graceful degradation, fallbacks |
| Scope creep | High | High | Strict sprint boundaries, change process |

---

## Team Communication

### Standups
- Daily async standups in Slack #cultureszn-dev
- Format: Yesterday / Today / Blockers

### Sprint Ceremonies
- Sprint Planning: Monday, Week 1 of sprint
- Sprint Review: Friday, Week 2 of sprint
- Retrospective: Following Monday

### Documentation
- All decisions documented in GitHub Discussions
- Technical ADRs for architecture choices
- Figma for design handoffs

---

## Appendix: Key Dates

| Date | Milestone |
|------|-----------|
| Jan 6, 2026 | Sprint 1 Start |
| Feb 2, 2026 | Infrastructure Complete |
| Mar 2, 2026 | Component Library Complete |
| Mar 30, 2026 | Landing Page Complete |
| Apr 13, 2026 | Member/Release Pages Complete |
| Apr 25, 2026 | QA Complete |
| Apr 30, 2026 | 🚀 Phase 1 Launch |

---

*Implementation guide maintained by Culture SZN Development Team*  
*Created: February 4, 2026*  
*Last Updated: February 4, 2026*
