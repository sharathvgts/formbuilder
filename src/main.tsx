import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Create from './pages/form/create.tsx'
import './globals.css'
import MainLayout from './components/layouts/MainLayout.tsx'
import View from './pages/form/view.tsx'
import Home from './pages/home.tsx'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter >
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='form'>
            <Route path='create' element={<Create />} />
            <Route path='view' >
              <Route index element={<View />} />
              <Route path=':formId' element={<>Hi</>} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
