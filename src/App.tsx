import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Home, Artist, Release, NotFound } from '@/pages'
import { ScrollBehavior } from '@/components/shared'

function App() {
  return (
    <BrowserRouter>
      <ScrollBehavior />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* Artist page for JSON-driven profiles */}
          <Route path="/artists/:slug" element={<Artist />} />
          {/* Legacy member route - redirects to artist for JSON profiles */}
          <Route path="/members/:slug" element={<Artist />} />
          <Route path="/releases/:slug" element={<Release />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
