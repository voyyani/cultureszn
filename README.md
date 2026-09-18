# Culture SZN

Culture SZN is the multidisciplinary ecosystem amplifying Nairobi's next-generation creatives. Where music, design, and cultural expression converge.

## 🚀 Development

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### Development Notes

**Offline Mode in Development:**
- API endpoints (`/api/spotify/*`) are Vercel serverless functions that **don't run locally** with `npm run dev`
- The app automatically falls back to static data in development mode
- This is **expected behavior** - you'll see "Offline" status indicator
- All features work with static data (browsing releases, artists, etc.)

**Testing with Live API:**
```bash
# Install Vercel CLI globally
npm i -g vercel

# Run with API endpoints
vercel dev
```

This starts both the frontend and serverless functions locally.

### Building for Production

```bash
# Type-check and build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
cultureszn/
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and libraries
│   ├── pages/         # Page components
│   ├── data/          # Static data
│   └── types/         # TypeScript types
├── api/               # Vercel serverless functions
│   └── spotify/       # Spotify API endpoints
└── docs/              # Documentation
```

## 🎵 Features

- **Latest Releases**: Live Spotify integration with offline fallback
- **Artist Profiles**: Rich artist pages with Spotify embeds
- **Smart Caching**: Multi-layer caching (memory + localStorage)
- **Offline Support**: Graceful degradation to static data
- **Responsive Design**: Mobile-first, adaptive layouts

## 🔧 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **API**: Vercel Serverless Functions
- **Deployment**: Vercel

## 📖 Documentation

See `/docs` folder for detailed documentation:
- [PRODUCT.md](./PRODUCT.md) - Product truth (users, purpose, principles)
- [Assets & Facts Needed](./docs/ASSETS-NEEDED.md) - What the team must supply, with specs and where each lands
- [Content Guide](./docs/CONTENT-GUIDE.md) - How to write and publish a SZNal
- [Rebuild plan](./docs/superpowers/plans/2026-09-18-world-class-rebuild-and-revamp.md) - The current roadmap

---

**Built with ❤️ in Nairobi**
