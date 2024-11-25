import './App.css'

import PART1 from './pages/PART1'
import PART2 from './pages/PART2'
import Main from './pages/Main'
import { useEffect } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  useEffect(() => {
    document.title = "LAB Final Discretas"
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/PART1" element={<PART1 />} />
          <Route path="/PART2" element={<PART2 />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
