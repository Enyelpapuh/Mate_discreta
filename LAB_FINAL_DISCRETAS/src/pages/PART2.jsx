"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import AutomataDiagram2 from "@/components/Diagrama2";

export default function PART2() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState({ states: [], isMultiple: false });

  // Tabla de transiciones del autómata
  const transitions = {
    q0: { "0": "q0", "1": "q1" },
    q1: { "0": "q2", "1": "q0" },
    q2: { "0": "q1", "1": "q2" },
  };

  const finalState = "q0"; // Estado final del autómata (múltiplo de 3)

  // Lógica para simular el autómata
  const runAutomaton = (input) => {
    let currentState = "q0";
    let statesVisited = [currentState];

    for (let char of input) {
      if (transitions[currentState] && transitions[currentState][char]) {
        currentState = transitions[currentState][char];
        statesVisited.push(currentState);
      } else {
        // Si la entrada no es válida (no es 0 o 1), terminamos el procesamiento
        return { states: statesVisited, isMultiple: false };
      }
    }

    // Determinar si termina en el estado final
    const isMultiple = currentState === finalState;
    return { states: statesVisited, isMultiple };
  };

  const handleAnalyze = () => {
    const result = runAutomaton(input);
    setResults(result);
  };

  return (
    
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-blue-50 min-h-screen">
            <div className="absolute top-4 left-4 gap-4 flex">
        <Link to="/">
          <Button variant="secondary" 
          className="w-full h-12 bg-gray-700 hover:bg-gray-600 border-2 border-black text-white font-semibold text-lg">Homepage</Button>
        </Link>
        <Link to="/PART1">
          <Button variant="secondary" 
          className="w-full h-12 bg-gray-700 hover:bg-gray-600 border-2 border-black text-white font-semibold text-lg">Parte 1</Button>
        </Link>
      </div>
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Ingresar Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Entrada</Label>
            <Input
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ingrese la secuencia binaria"
            />
          </div>
          <Button onClick={handleAnalyze} className="w-full">
            Analizar
          </Button>
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Resultados</Label>
            <div>
              <p>
                <strong>Estados visitados:</strong> {results.states.join(" → ")}
              </p>
              <p>
                <strong>¿Es múltiplo de 3?:</strong>{" "}
                {results.isMultiple ? "Sí" : "No"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-2/3">
        <CardContent className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground">
        <AutomataDiagram2 visitedStates={results.states} />
        </CardContent>
      </Card>
    </div>
  );
}
