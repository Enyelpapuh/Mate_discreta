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
  const [results, setResults] = useState({ ab: "", bc: "", ca: "", abc: "" });
  const [resultadoFinal, setResultadoFinal] = useState([]);
  const [sets, setSets] = useState({
    universo: [],
    A: [],
    B: [],
    C: [],
    entrada: ""
});



  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // Estados iniciales para cada conjunto
  const [universo, setUniverso] = useState("");
  const [conjuntoA, setConjuntoA] = useState("");
  const [conjuntoB, setConjuntoB] = useState("");
  const [conjuntoC, setConjuntoC] = useState("");
  const [entrada, setEntrada] = useState("");

  const [resultAB, setResultAB] = useState([]);
  const [resultBC, setResultBC] = useState([]);
  const [resultCA, setResultCA] = useState([]);
  const [resultABC, setResultABC] = useState([]);

  


// Funciones para operaciones de conjuntos
const union = (setA, setB) => {
  // Asegurarse de que setA y setB son arreglos
  if (!Array.isArray(setA) || !Array.isArray(setB)) {
      console.error('Uno de los conjuntos no es un arreglo:', { setA, setB });
      return []; // Retornar un arreglo vacío si uno de los conjuntos no es válido
  }
  
  return Array.from(new Set([...setA, ...setB])); // Unión
};

const intersection = (set1, set2) => {
  // Verificación de tipo
  if (!Array.isArray(set1) || !Array.isArray(set2)) {
      console.error('Uno de los conjuntos no es un arreglo:', { set1, set2 });
      return []; // Retornar un arreglo vacío si uno de los conjuntos no es válido
  }
  return set1.filter(item => set2.includes(item)); // Intersección
};

const difference = (set1, set2) => {
  // Verificación de tipo
  if (!Array.isArray(set1) || !Array.isArray(set2)) {
      console.error('Uno de los conjuntos no es un arreglo:', { set1, set2 });
      return []; // Retornar un arreglo vacío si uno de los conjuntos no es válido
  }
  return set1.filter(item => !set2.includes(item)); // Diferencia
};
const symmetricDifference = (set1, set2) => {
  const differenceA = difference(set1, set2); // A - B
  const differenceB = difference(set2, set1); // B - A
  return union(differenceA, differenceB); // (A - B) ∪ (B - A)
};

const cartesianProduct = (set1, set2) => {
  const product = [];
  for (let a of set1) {
      for (let b of set2) {
          product.push([a, b]); // Agregar el par ordenado [a, b]
      }
  }
  return product;
};

  // Función para calcular el conjunto potencia de A
  const handlePowerSet = () => {
    const setA = sets.A.split(",").map(item => parseInt(item.trim())).filter(num => !isNaN(num));

    const resultPowerSet = powerSet(setA); // Calcula el conjunto potencia
    console.log("Conjunto potencia de A:", resultPowerSet);
  };

  // Función para calcular el complemento de un conjunto
  const complement = (universalSet, setA) => {
    return universalSet.filter(item => !setA.includes(item)); // Elementos en el conjunto universal que no están en A
  };

  const evaluateExpression = (expression) => {
    const parts = expression.match(/(\([^\)]+\)|[^\s()]+)/g); // Captura los conjuntos y paréntesis
    console.log('Partes capturadas:', parts); // Muestra el arreglo de partes
    let results = [];

    for (let i = 0; i < parts.length; i++) {
        let part = parts[i].trim();
        
        // Manejar expresiones dentro de paréntesis
        if (part.startsWith('(') && part.endsWith(')')) {
            const innerExpression = part.slice(1, -1); // Elimina los paréntesis
            results.push(evaluateExpression(innerExpression)); // Evaluar expresión interna
        } else if (part === '∪' || part === '∩' || part === '-' || part === 'Δ' || part === '×') {
            // Si es un operador, lo ignoramos aquí y lo manejamos más adelante
            continue;
        } else {
            // Aquí verificamos si el conjunto está definido
            if (sets[part] === undefined) {
                console.error(`El conjunto ${part} no está definido.`);
                continue; // Salir si el conjunto no está definido
            }
            results.push(sets[part]); // Añadir el conjunto
        }
    }

    // Realizar operaciones
    return evaluateInnerOperations(results, parts);
};

const evaluateInnerOperations = (results, parts) => {
    let finalResult = results[0]; // Inicia con el primer conjunto

    for (let i = 1; i < parts.length; i++) {
        const operator = parts[i].trim(); // Obtener el operador actual
        const rightSet = results[i]; // El siguiente conjunto

        if (operator === '∪') {
            finalResult = union(finalResult, rightSet);
        } else if (operator === '∩') {
            finalResult = intersection(finalResult, rightSet);
        } else if (operator === '-') {
            finalResult = difference(finalResult, rightSet);
        } else if (operator === 'Δ') { // Diferencia simétrica
          finalResult = symmetricDifference(finalResult, rightSet);
      } else if (operator === '×') { // Producto cartesiano
          finalResult = cartesianProduct(finalResult, rightSet);
      }
    }

    return finalResult; // Retornar el resultado final
};
  // Función para procesar un conjunto dado
  const processSet = (setString) => {
    return setString.split(",").map(item => item.trim()); // Separa por comas y elimina espacios en blanco
};

const handleCalculate = () => {
  const processedUniverso = processSet(universo);
  const processedA = processSet(conjuntoA);
  const processedB = processSet(conjuntoB);
  const processedC = processSet(conjuntoC);

  setSets({
      universo: processedUniverso,
      A: processedA,
      B: processedB,
      C: processedC,
      entrada: entrada
  });

  console.log("Valores capturados:");
  console.log("Universo:", processedUniverso);
  console.log("Conjunto A:", processedA);
  console.log("Conjunto B:", processedB);
  console.log("Conjunto C:", processedC);
  console.log("Entrada:", entrada);

  // Llama a la función para evaluar la expresión de entrada
  if (entrada) {
    const resultado = evaluateExpression(entrada);
      console.log(`Resultado: ${JSON.stringify(resultado)}`);
  } else {
      console.error("Entrada no válida.");
  }
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
          name: '1, 2, 3, 4, 5, 6'
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
              {/* Input para el conjunto universo */}
      <div>
        <label>Conjunto Universo: </label>
        <input
          type="text"
          value={universo}
          onChange={(e) => setUniverso(e.target.value)}
          placeholder="Ej: 1, 2, 3"
        />
      </div>

      {/* Input para el conjunto A */}
      <div>
        <label>Conjunto A: </label>
        <input
          type="text"
          value={conjuntoA}
          onChange={(e) => setConjuntoA(e.target.value)}
          placeholder="Ej: 2, 3, 4"
        />
      </div>

      {/* Input para el conjunto B */}
      <div>
        <label>Conjunto B: </label>
        <input
          type="text"
          value={conjuntoB}
          onChange={(e) => setConjuntoB(e.target.value)}
          placeholder="Ej: 4, 5, 6"
        />
      </div>

      {/* Input para el conjunto C */}
      <div>
        <label>Conjunto C: </label>
        <input
          type="text"
          value={conjuntoC}
          onChange={(e) => setConjuntoC(e.target.value)}
          placeholder="Ej: 6, 7, 8"
        />
      </div>

      {/* Input para la expresión de entrada */}
      <div>
        <label>Entrada: </label>
        <input
          type="text"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Expresión para evaluar"
        />
      </div>

      {/* Botón para calcular */}
      <button onClick={handleCalculate}>Calcular</button>

            {/*----************************************************************------------------- Resultados */}
            <div className="space-y-2">
              <Label>Resultados</Label>
              <Input value={results.ab} readOnly placeholder="a b" />
              <Input value={results.bc} readOnly placeholder="b c" />
              <Input value={results.ca} readOnly placeholder="c a" />
              <Input value={results.abc} readOnly placeholder="a b c" />
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
