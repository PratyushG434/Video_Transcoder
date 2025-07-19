import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import HomePage from './pages/Homesection'
import UploadPage from './pages/upload'
import WatchPage from './pages/videoid'
import BrowsePage from './pages/stream'
import { useAuthStore } from './store/useAuthStore';

function App() {
 const { checkAuth } = useAuthStore.getState();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/browse" element={<BrowsePage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
