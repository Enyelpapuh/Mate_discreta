"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AutomataDiagram from "@/components/Diagrama";
import { Link } from 'react-router-dom';

export default function PART1() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState({ states: [], occurrences: 0 });

  // Tabla de transiciones del autómata
  const transitions = {
    q0: { "0": "q0", "1": "q1" },
    q1: { "0": "q2", "1": "q1" },
    q2: { "0": "q0", "1": "q3" },
    q3: { "0": "q2", "1": "q4" },
    q4: { "0": "q0", "1": "q0" }, // Estado final
  };

  const finalState = "q4"; // Estado final del autómata

  // Lógica para simular el autómata
  const runAutomaton = (input) => {
    let currentState = "q0";
    let statesVisited = [currentState];
    let occurrenceCount = 0;

    for (let char of input) {
      if (transitions[currentState] && transitions[currentState][char]) {
        currentState = transitions[currentState][char];
        statesVisited.push(currentState);

        // Verificamos si llegamos al estado final
        if (currentState === finalState) {
          occurrenceCount++;
        }
      } else {
        // Si la entrada no es válida, el autómata se detiene
        break;
      }
    }

    return { states: statesVisited, occurrences: occurrenceCount };
  };

  const handleAnalyze = () => {
    const result = runAutomaton(input);
    setResults(result);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-blue-50 min-h-screen">
      <div className="absolute top-4 left-4 gap-4 flex">
        <Link to="/">
          <Button variant="secondary">Homepage</Button>
        </Link>
        <Link to="/PART2">
          <Button variant="secondary">Parte 2</Button>
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
            Analizar Ocurrencias
          </Button>
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Resultados</Label>
            <div>
              <p>
                <strong>Estados visitados:</strong> {results.states.join(" → ")}
              </p>
              <p>
                <strong>Ocurrencias (q4 alcanzado):</strong> {results.occurrences}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-2/3">
        <CardContent className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground">
        <AutomataDiagram visitedStates={results.states} />
        </CardContent>
      </Card>
    </div>
  );
}
