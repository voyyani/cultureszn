import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Home, Artist, Artists, Release, Releases, SZNals, SZNal, Join, NotFound } from '@/pages'
import { ScrollBehavior } from '@/components/shared'

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
