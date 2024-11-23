import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useEffect } from "react";

function Homepage() {
  useEffect(() => {
    document.title = 'Homepage';
  }, []);


  return (
    <div className="h-screen flex justify-center flex-col">
      <h1></h1>
      <div className="card flex md:justify-around gap-8 md:gap-0 flex-col md:flex-row">
        <Link to="/PART1">
          <Button variant="secondary">Formureses</Button>
        </Link>
        <Link to="/PARTE2">
          <Button variant="secondary">Formnica</Button>
        </Link>
      </div>
      <h3>Hecho por Roger Alfaro y Enyel Baltodano</h3>
    </div>
  )
}

export default Homepage