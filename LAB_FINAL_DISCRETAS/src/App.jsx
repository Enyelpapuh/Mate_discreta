import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MAIN from './pages/Main'
import PART1 from './pages/PART1'
import PART2 from './pages/PART2'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={MAIN}/>
          <Route path="/parishioners" Component={PART1}/>
          <Route path="/clinic" Component={PART2}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App