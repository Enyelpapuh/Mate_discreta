"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils"

import Highcharts from 'highcharts';
import HighchartsVenn from 'highcharts/modules/venn';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const options = [
  { value: "Union", label: "∪" },
  { value: "Intercepcion", label: "∩" },
  { value: "Complemento", label: "uncoming..." },
  { value: "Diferencia", label: "−" },
  { value: "Dif-simetrica", label: "△" },
  { value: "Potencia", label: "uncoming.." },
  { value: "Cartesiano", label: "X" },
]

// Inicializa los módulos
HighchartsVenn(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

export default function Component() {
  const [results, setResults] = useState({ ab: "", bc: "", ca: "" });
  const [sets, setSets] = useState({ A: "", B: "", C: "" }); // Estado para los conjuntos

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const [valueA, setValueA] = useState("")
  const [valueB, setValueB] = useState("")
  const [valueC, setValueC] = useState("")

  const [resultAB, setResultAB] = useState([]);
  const [resultBC, setResultBC] = useState([]);
  const [resultCA, setResultCA] = useState([]);
  const [resultABC, setResultABC] = useState([]);

// Función de unión de dos conjuntos con búsqueda de un valor
const union = (set1, set2) => {
  return [...new Set([...set1, ...set2])]; // Crea un nuevo conjunto combinando ambos y elimina duplicados
};

const handleCalculate = () => {
  const setA = sets.A.split(",").map(item => parseInt(item.trim())).filter(num => !isNaN(num)); // Convierte a enteros
  const setB = sets.B.split(",").map(item => parseInt(item.trim())).filter(num => !isNaN(num)); // Convierte a enteros
  const setC = sets.C.split(",").map(item => parseInt(item.trim())).filter(num => !isNaN(num)); // Convierte a enteros

  // Operaciones de unión sin búsqueda de valor
  const resultAB = union(setA, setB).sort((a, b) => a - b);  // Unión de A y B
  const resultBC = union(setB, setC).sort((a, b) => a - b);  // Unión de B y C
  const resultCA = union(setC, setA).sort((a, b) => a - b);  // Unión de C y A
  const resultABC = union(resultAB, setC).sort((a, b) => a - b); // Unión de los tres conjuntos (A, B, C)

  // Mostrar resultados en la consola
  console.log("Unión de A y B:", resultAB);
  console.log("Unión de B y C:", resultBC);
  console.log("Unión de C y A:", resultCA);
  console.log("Unión de A, B y C:", resultABC);

  setResults({
    ab: resultAB.join(", "), // Convierte el array a una cadena
    bc: resultBC.join(", "), // Convierte el array a una cadena
    ca: resultCA.join(", ")   // Convierte el array a una cadena
  });
};


  useEffect(() => {
    Highcharts.chart('container', {
      chart: {
        type: 'venn'
      },
      title: {
        text: 'Intersección de tres conjuntos: A, B, C'
      },
      series: [{
        name: 'Intersección de A, B, C',
        data: [{
          sets: ['A'],
          value: 3,
          name: '1, 2, 5, 6'
        }, {
          sets: ['B'],
          value: 3,
          name: '2, 5, 7'
        }, {
          sets: ['C'],
          value: 3,
          name: '1, 3, 5, 7, 8'
        }, {
          sets: ['A', 'B'],
          value: 1,
          name: '2, 5'
        }, {
          sets: ['A', 'C'],
          value: 1,
          name: '5'
        }, {
          sets: ['B', 'C'],
          value: 1,
          name: '5, 7'
        }, {
          sets: ['A', 'B', 'C'],
          value: 1,
          name: '5'
        }]
      }]
    });
  }, []);

  return (
    <>
      <div className="text-center w-full ">
      <Label className="  text-2xl" htmlFor="conjuntoA">Laboratorio 3 operadores de conjunto Y Diagrama de venn</Label>
      </div>
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-blue-50 min-h-screen">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Ingresar Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conjuntoA">Conjunto A</Label>
              <Input
                id="conjuntoA"
                placeholder="1, 2, 3, 4, 5, 6"
                value={sets.A}
                onChange={(e) => setSets({ ...sets, A: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conjuntoB">Conjunto B</Label>
              <Input
                id="conjuntoB"
                placeholder="2, 3, 4, 5"
                value={sets.B}
                onChange={(e) => setSets({ ...sets, B: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conjuntoC">Conjunto C</Label>
              <Input
                id="conjuntoC"
                placeholder="3, 5, 6, 7"
                value={sets.C}
                onChange={(e) => setSets({ ...sets, C: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label>Determinar:</Label>
              <div className="flex items-center space-x-2">

                <Label htmlFor="checkA">A</Label>
              </div>
              <div className="flex items-center space-x-2">
                <div className="space-y-2">
                  <Select onValueChange={setValueA} value={valueA}>
                    <SelectTrigger className="w-15">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Label htmlFor="checkB">B</Label>
              </div>
              <div className="flex items-center space-x-2">
                <div className="space-y-2">
                  <Select onValueChange={setValueB} value={valueB}>
                    <SelectTrigger className="w-15">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Label htmlFor="checkC">C</Label>
              </div>
            </div>
            <Button onClick={handleCalculate}>Graficar los resultados</Button>
            <div className="space-y-2">
              <Label>Resultados</Label>
              <Input value={results.ab} readOnly placeholder="a b" />
              <Input value={results.bc} readOnly placeholder="b c" />
              <Input value={results.ca} readOnly placeholder="c a" />
            </div>
            <div className="space-y-2">
              <Label>Conjunto B</Label>
              <Select onValueChange={setValueC} value={valueC}>
                <SelectTrigger className="w-15">
                  <SelectValue placeholder="Operador" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-2/3">
          <CardContent className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground">
            <div>
              <figure className="highcharts-figure">
                <div id="container" style={{ height: '400px' }}></div>
                <p className="highcharts-description">
                  Diagrama de Venn mostrando la intersección entre los conjuntos A, B y C.
                </p>
              </figure>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
