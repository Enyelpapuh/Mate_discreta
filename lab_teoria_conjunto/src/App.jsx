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
  const [universo, setUniverso] = useState([]);
  const [conjuntoA, setConjuntoA] = useState([]);
  const [conjuntoB, setConjuntoB] = useState([]);
  const [conjuntoC, setConjuntoC] = useState([]);
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
// Función de complemento que maneja cualquier subconjunto
const complement = (setUniverso, subset) => {
  if (!Array.isArray(setUniverso) || !Array.isArray(subset)) {
    console.error("Ambos argumentos deben ser arreglos.");
    return [];
  }

  // Filtrar los elementos que no están en el subconjunto
  const result = universalSet.filter(element => !subset.includes(element));

  console.log("Conjunto universal:", setUniverso);
  console.log("Subconjunto:", subset);
  console.log("Complemento:", result);
  
  return result; // Retornar el complemento
};
  // Función para calcular el conjunto potencia (todos los subconjuntos de un conjunto)
  const powerSet = (set) => {
    const subsets = [[]]; // Comienza con el conjunto vacío

  // Recorre cada elemento del conjunto original
  for (const element of set) {
    // Genera nuevos subconjuntos agregando el elemento actual a todos los subconjuntos existentes
    const newSubsets = subsets.map(subset => [...subset, element]);
    subsets.push(...newSubsets);
  }

  // Mapear los subconjuntos para mejorar la presentación
  return subsets.map(subset => {
    if (subset.length === 0) {
      return '∅'; // Mostrar el conjunto vacío como ∅
    } else {
      return subset.join(','); // Imprimir los subconjuntos correctamente sin coma inicial
    }
  });
};


const evaluateExpression = (expression) => {
    const parts = expression.match(/(\([^\)]+\)|[^\s()]+)/g); // Captura los conjuntos y paréntesis
    console.log('Partes capturadas:', parts); // Muestra el arreglo de partes
    let results = [];
    let operators = []; // Lista para almacenar operadores

    for (let i = 0; i < parts.length; i++) {
        let part = parts[i].trim();

        // Manejar expresiones dentro de paréntesis
        if (part.startsWith('(') && part.endsWith(')')) {
            const innerExpression = part.slice(1, -1); // Elimina los paréntesis
            results.push(evaluateExpression(innerExpression)); // Evaluar expresión interna
        } else if (part === '∪' || part === '∩' || part === '-' || part === 'Δ' || part === '×' || part === '^' || part.endsWith('^c')) {
            // Si es un operador, lo almacenamos para manejar más adelante
            operators.push(part);
            continue;
        } else if (part.endsWith('^c')) {
          // Detectar el complemento A^c
          const setName = part.slice(0, -2); // Extrae el nombre del conjunto (antes del ^c)
          if (sets[setName] !== undefined) {
              results.push(complement(setUniverso, sets[setName])); // Calcula el complemento del conjunto
          } else {
              console.error(`El conjunto ${setName} no está definido.`);
          }

        } else if (part.endsWith('^')) {
            // Detectar el conjunto potencia A^
            const setName = part.slice(0, -1); // Extrae el nombre del conjunto (antes del ^)
            if (sets[setName] !== undefined) {
                results.push(powerSet(sets[setName])); // Calcula el conjunto potencia
            } else {
                console.error(`El conjunto ${setName} no está definido.`);
            }
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
    return evaluateInnerOperations(results, operators);
};

// Modificar la función de operaciones internas para manejar todas las operaciones
const evaluateInnerOperations = (results, operators) => {
    if (results.length === 0) return []; // Asegúrate de manejar el caso de resultados vacíos

    let finalResult = results[0]; // Inicia con el primer conjunto

    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i]; // Obtener el operador actual
        const rightSet = results[i + 1]; // El siguiente conjunto

        if (!rightSet) {
            console.error("No hay un conjunto correspondiente para el operador:", operator);
            continue; // Si no hay un conjunto correspondiente, continuar
        }

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
      } else if (operator.endsWith('^c')) { // Complemento
          finalResult = complement(sets.universo, rightSet);
      } else if (operator === '^') { // Potencia (calculando el conjunto de subconjuntos)
          finalResult = powerSet(finalResult);
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
      setResults({
        ab: resultado.join(", "),
      })
      console.log(`Resultado: ${JSON.stringify(resultado)}`);
    } else {
      console.error("Entrada no válida.");
    }
  };

  //aqui la logica de sombrear los conjuntos
  const getColor = (set) => {
    switch (set) {
      case 'A':
        return 'rgba(255, 99, 132, 0.5)'; // Color para A
      case 'B':
        return 'rgba(54, 162, 235, 0.5)'; // Color para B
      case 'C':
        return 'rgba(75, 192, 192, 0.5)'; // Color para C
      case 'A,B':
        return 'rgba(255, 206, 86, 0.5)'; // Color para A ∩ B
      case 'A,C':
        return 'rgba(153, 102, 255, 0.5)'; // Color para A ∩ C
      case 'B,C':
        return 'rgba(255, 159, 64, 0.5)'; // Color para B ∩ C
      case 'A,B,C':
        return 'rgba(0, 0, 0, 0.5)'; // Color para A ∩ B ∩ C
      default:
        return 'rgba(200, 200, 200, 0.5)'; // Color predeterminado para otras combinaciones
    }
  };
  const data = [
    {
      sets: ['A'],
      value: 3,
      name: '1, 2, 3, 4, 5, 6',
      color: getColor('A') // Asigna el color basado en la función
    },
    {
      sets: ['B'],
      value: 3,
      name: '2, 5, 7',
      color: getColor('B')
    },
    {
      sets: ['C'],
      value: 3,
      name: '1, 3, 5, 7, 8',
      color: getColor('C')
    },
    {
      sets: ['A', 'B'],
      value: 1,
      name: '2, 5',
      color: getColor('A,B') // Asigna color para intersección A ∩ B
    },
    {
      sets: ['A', 'C'],
      value: 1,
      name: '5',
      color: getColor('A,C')
    },
    {
      sets: ['B', 'C'],
      value: 1,
      name: '5, 7',
      color: getColor('B,C')
    },
    {
      sets: ['A', 'B', 'C'],
      value: 1,
      name: '5',
      color: getColor('A,B,C') // Color para A ∩ B ∩ C
    }
  ];

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
        data: data.map(item => ({
          sets: item.sets,
          value: item.value,
          name: item.name,
          color: item.color // Asigna el color aquí
        }))
      }]
    });
  }, []); // Solo se ejecuta una vez cuando el componente se monta


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
