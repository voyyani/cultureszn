import { lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Home } from '@/pages/Home'
import { ScrollBehavior } from '@/components/shared'

// Home ships in the entry chunk; every other page is its own chunk, fetched on first visit.
const Artists = lazy(() => import('@/pages/Artists').then((m) => ({ default: m.Artists })))
const Artist = lazy(() => import('@/pages/Artist').then((m) => ({ default: m.Artist })))
const Releases = lazy(() => import('@/pages/Releases').then((m) => ({ default: m.Releases })))
const Release = lazy(() => import('@/pages/Release').then((m) => ({ default: m.Release })))
const SZNals = lazy(() => import('@/pages/SZNals').then((m) => ({ default: m.SZNals })))
const SZNal = lazy(() => import('@/pages/SZNal').then((m) => ({ default: m.SZNal })))
const Join = lazy(() => import('@/pages/Join').then((m) => ({ default: m.Join })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))

function MemberRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/artists/${slug}`} replace />
}

export function AppRoutes() {
  return (
    <>
      <ScrollBehavior />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/:slug" element={<Artist />} />
          <Route path="/members/:slug" element={<MemberRedirect />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/releases/:slug" element={<Release />} />
          <Route path="/sznals" element={<SZNals />} />
          <Route path="/sznals/:slug" element={<SZNal />} />
          <Route path="/join" element={<Join />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
