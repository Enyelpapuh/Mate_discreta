
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function MAin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-sky-600 bg-blend-overlay bg-opacity-50 relative overflow-hidden">
      {/* Background texture overlay */}
      <div 
        className=" inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAOdEVYdFRpdGxlAERpcnQgKDEprnTTJQAAABZ0RVh0QXV0aG9yAFJhc3RlciBQcmltaXRpdmXU0jDkAAAAKXRFWHRDcmVhdGlvbiBUaW1lAFNhdCAxNiBKYW4gMjAyMSAxNzowNDo0MSAtMDYwMEynJqwAAAAYdEVYdFNvdXJjZQBodHRwczovL21pbmVjcmFmdC5uZXTF0YjfAAAAIXRFWHRTb3VyY2UgVVJMAGh0dHBzOi8vbWluZWNyYWZ0Lm5ldC/0YjfAAAAASUVORK5CYII=')] opacity-20"
      />
      
      {/* Logo */}
      <div className="relative mb-12 transform hover:scale-105 transition-transform">
        <h1 className="text-6xl font-bold text-gray-800 tracking-wide" style={{ textShadow: '2px 2px #000' }}>
          Matematica Discretas
        </h1>
        <span className="absolute -right-24 top-0 text-yellow-300 rotate-12 text-sm font-pixel">
          Ultimo laboratorio
        </span>
      </div>


      {/* Menu Buttons */}
      <div className="space-y-2 w-72">

      <Link to="/PART1">
        <Button 
          variant="secondary" 
          className="w-full h-12 bg-gray-700 hover:bg-gray-600 border-2 border-black text-white font-semibold text-lg"
        >
          Parte 1
        </Button>
        </Link>
        <Link to="/PART2">
        <Button 
          variant="secondary" 
          className="w-full h-12 bg-gray-700 hover:bg-gray-600 border-2 border-black text-white font-semibold text-lg"
        >
          Parte 2
        </Button>
        </Link>
      </div>

      {/* Version number */}
      <div className="absolute bottom-4 left-4 text-white text-sm opacity-80">
        25/11/2024
        2M1-COM-S
      </div>
      
      {/* Copyright */}
      <div className="absolute bottom-4 right-4 text-white text-sm opacity-80">
        Hecho Por Enyel Antonio Baltodano Villareyna y 
        Jesus Antonio Gaitan Largaespada
      </div>
    </div>
  )
}

