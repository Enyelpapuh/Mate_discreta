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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
 

const options = [
  { value: "Union", label: "∪" },
  { value: "Intercepcion", label: "∩" },
  { value: "Complemento", label: "^c" },
  { value: "Diferencia", label: "-" },
  { value: "Dif-simetrica", label: "Δ" },
  { value: "Potencia", label: "^" },
  { value: "Cartesiano", label: "×" },
]

// Inicializa los módulos
HighchartsVenn(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

export default function Component() {
  const handleSymbolClick = (symbol) => {
    setEntrada((prev) => prev + symbol);
  };

  const [results, setResults] = useState({ ab: "", bc: "", ca: "", abc: "" });
  const [resultadoFinal, setResultadoFinal] = useState([]);
  const [sets, setSets] = useState({
    universo: [],  // Conjunto universo, debería contener todos los elementos
    A: [],         // Conjunto A
    B: [],         // Conjunto B
    C: [],         // Conjunto C
    entrada: ""    // Expresión de entrada
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
// Función de complemento que maneja cualquier subconjunto
const complement = (universo, conjunto) => {
  // Convierte ambos conjuntos a sets para facilitar la diferencia
  const universoSet = new Set(universo);
  const conjuntoSet = new Set(conjunto);

  // Calcula el complemento
  const result = [...universoSet].filter(item => !conjuntoSet.has(item));
  return result; // Retorna el complemento
};

// Función de prueba
const testComplementFunction = () => {
  // Define los valores de prueba
  const universo = ['1', '2', '3', '4', '5']; // Arreglo de strings que representa el conjunto universo
  const conjuntoA = ['1', '3']; // Arreglo de strings que representa el subconjunto

  // Llama a la función de complemento con los valores de prueba
  const resultadoComplemento = complement(universo, conjuntoA);
  
  // Imprime el resultado
  console.log(`Complemento de A:`, resultadoComplemento); // Debería imprimir: Complemento de A: ['2', '4', '5']
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
  // Captura las partes de la expresión (conjuntos y operadores)
  const parts = expression.match(/(\([^\)]+\)|[^\s()]+)/g); // Captura los conjuntos y paréntesis
  if (!parts) {
    console.error('Expresión no válida o vacía.');
    return null;
  }
  
  console.log('Partes capturadas:', parts); // Muestra el arreglo de partes

  let results = [];
  let operators = []; // Lista para almacenar operadores

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i].trim();

    // Manejar expresiones dentro de paréntesis
    if (part.startsWith('(') && part.endsWith(')')) {
      const innerExpression = part.slice(1, -1); // Elimina los paréntesis
      results.push(evaluateExpression(innerExpression)); // Evaluar expresión interna
    } else if (['∪', '∩', '-', 'Δ', '×'].includes(part)) {
      operators.push(part); // Almacenar operadores
    } else if (part.includes('^c')) {
      const setName = part.split('^c')[0]; // Separa el nombre del conjunto
      if (sets[setName] !== undefined) {
        const result = complement(sets.universo, sets[setName]); // Calcula el complemento
        results.push(result);
      } else {
        console.error(`El conjunto ${setName} no está definido.`);
      }
    } else if (part.endsWith('^')) {
      const setName = part.slice(0, -1); // Extrae el nombre del conjunto (antes del ^)
      if (sets[setName] !== undefined) {
        results.push(powerSet(sets[setName])); // Calcula el conjunto potencia
      } else {
        console.error(`El conjunto ${setName} no está definido.`);
      }
    } else {
      if (sets[part] === undefined) {
        console.error(`El conjunto ${part} no está definido.`);
      } else {
        results.push(sets[part]); // Añadir el conjunto
      }
    }
  }

  console.log('Resultados acumulados:', results);
  console.log('Operadores acumulados:', operators);

  // Evaluación de los resultados finales
  let finalResult = results[0];

  for (let j = 0; j < operators.length; j++) {
    const operator = operators[j];
    const rightSet = results[j + 1]; // El siguiente resultado para operar

    switch (operator) {
      case '∪':
        finalResult = union(finalResult, rightSet);
        break;
      case '∩':
        finalResult = intersection(finalResult, rightSet);
        break;
      case '-':
        finalResult = difference(finalResult, rightSet);
        break;
      case 'Δ':
        finalResult = symmetricDifference(finalResult, rightSet);
        break;
      case '×':
        finalResult = cartesianProduct(finalResult, rightSet);
        break;
      default:
        console.error(`Operador desconocido: ${operator}`);
    }
  }

  return finalResult; // Retornar el resultado final
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
            finalResult = complement([1,2,3,4,5], [1,2,3]);
        } else if (operator === '^') { // Potencia (calculando el conjunto de subconjuntos)
            finalResult = powerSet(finalResult);
        }
    }

    return finalResult; // Retornar el resultado final
};

const processSet = (setString) => {
  return setString.split(",").map(item => item.trim()); // Separa por comas y elimina espacios en blanco
};

const handleCalculate = () => {
  if (!universo || !conjuntoA || !conjuntoB || !conjuntoC) {
      console.error("Uno o más conjuntos están vacíos.");
      return;
  }

  const processedUniverso = processSet(universo); // Procesa el conjunto universo
  const processedA = processSet(conjuntoA);       // Procesa el conjunto A
  const processedB = processSet(conjuntoB);       // Procesa el conjunto B
  const processedC = processSet(conjuntoC);       // Procesa el conjunto C

  // Actualiza el estado de sets
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
  const shadedAreas = getShadedAreas(entrada);
console.log("Áreas sombreadas obtenidas:", shadedAreas);

  // Actualiza los resultados
  setResults({
      ab: resultado.join(", "),
  });

  // Registro de los resultados y áreas sombreadas
  console.log(`Entrada: ${entrada}`);
  console.log(`Resultado de la evaluación: ${JSON.stringify(resultado)}`);
  console.log(`Áreas sombreadas:`, shadedAreas);
} else {
  console.error("Entrada no válida.");
}

};
const interpretInput = (input) => {
  const inputString = String(input); // Asegúrate de que es una cadena
  const results = [];
  const operators = [];

  // Procesamiento
  if (inputString.includes('∪')) {
      operators.push('Union');
  }
  if (inputString.includes('∩')) {
      operators.push('Interseccion');
  }

  // Agrega conjuntos a los resultados
  if (inputString.includes('A')) results.push('A');
  if (inputString.includes('B')) results.push('B');
  if (inputString.includes('C')) results.push('C');

  return { results, operators };
};

const parseExpression = (expression) => {
  console.log("Entrada a parseExpression:", expression); // Ver qué se recibe

  if (typeof expression !== 'string') {
    console.error('El argumento debe ser una cadena, pero se recibió:', expression);
    return { results: [], operators: [] }; // Retornar valores por defecto si no es una cadena
  }

  const parts = expression.split(' ').filter(Boolean); // Separa por espacios y filtra vacíos
  console.log("Partes separadas:", parts); // Ver qué partes se han separado

  let results = [];
  let operators = [];

  parts.forEach(part => {
    part = part.trim();

    // Manejar conjuntos y operadores, incluyendo diferencia (-), diferencia simétrica (Δ) y complemento (^)
    if (['A', 'B', 'C', '∪', '∩', '-', 'Δ', 'A^c', 'B^c', 'C^c'].includes(part)) {
      if (['∪', '∩', '-', 'Δ', 'A^c', 'B^c', 'C^c'].includes(part)) {
        operators.push(part); // Captura el operador
      } else {
        results.push(part); // Captura los conjuntos A, B, C
      }
    }
  });

  return { results, operators };
};




const getShadedAreas = (expression) => {
  const { results, operators } = parseExpression(entrada); // Cambiado "entrada" a "expression"
  console.log("Resultados:", results);
  console.log("Operadores:", operators);
  
  let shadedAreas = {};

  const colors = {
    'universo':'white',
    'A': 'green',
    'B': 'yellow',
    'C': 'blue',
    'A^c': 'lightgray',  // Color para el complemento de A
    'B^c': 'lightgray',  // Color para el complemento de B
    'C^c': 'lightgray',  // Color para el complemento de C
    'Union': 'purple',
    'Interseccion': 'orange',
    'ab': 'gray',  // Color para la intersección de A y B
    'bc': 'gray',   // Color para la intersección de B y C
    'ca': 'gray',   // Color para la intersección de C y A
    'abc': 'gray',  // Color para la intersección de A, B y C
    'symmetricDiff': 'white' // Color para simular que el área de la intersección no se sombrea
  };

  // Inicializar todas las áreas con "none" al principio
  ['A', 'B', 'C', 'ab', 'bc', 'ca', 'abc','universo', 'Union', 'Interseccion'].forEach(area => {
    shadedAreas[area] = 'none';
  });

  // Procesar las uniones (∪)
  if (operators.includes('∪')) {
    // Sombreamos todas las áreas que se incluyen en la unión
    if (results.includes('A')) shadedAreas['A'] = colors['A'];
    if (results.includes('B')) shadedAreas['B'] = colors['B'];
    if (results.includes('C')) shadedAreas['C'] = colors['C'];

    if (results.length > 1) {
      shadedAreas['Union'] = colors['Union']; // Sombrea la unión total
    }
  }

  // Procesar las intersecciones (∩)
  if (operators.includes('∩')) {
    if (results.includes('A') && results.includes('B')) shadedAreas['ab'] = colors['ab'];
    if (results.includes('B') && results.includes('C')) shadedAreas['bc'] = colors['bc'];
    if (results.includes('C') && results.includes('A')) shadedAreas['ca'] = colors['ca'];
    if (results.includes('A') && results.includes('B') && results.includes('C')) shadedAreas['abc'] = colors['abc'];
  }

  // Procesar la diferencia (A - B)
  if (operators.includes('-')) {
    if (results.includes('A') && results.includes('B')) {
      // Sombreamos A - B (solo A, pero no la intersección A ∩ B)
      shadedAreas['A'] = colors['A'];  // A se sombrea
      shadedAreas['B'] = 'none'; // B se deja en blanco
      shadedAreas['ab'] = 'none'; // La intersección también queda en blanco
    }
    if (results.includes('B') && results.includes('C')) {
      // Sombreamos B - C (solo B, pero no la intersección B ∩ C)
      shadedAreas['B'] = colors['B']; 
      shadedAreas['C'] = 'none'; 
      shadedAreas['bc'] = 'none'; 
    }
    if (results.includes('C') && results.includes('A')) {
      // Sombreamos C - A (solo C, pero no la intersección C ∩ A)
      shadedAreas['C'] = colors['C'];
      shadedAreas['A'] = 'none';
      shadedAreas['ca'] = 'none';
    }
  }

  // Procesar la diferencia simétrica (Δ)
  if (operators.includes('Δ')) {
    if (results.includes('A') && results.includes('B')) {
      // Sombreamos A Δ B (todo menos la intersección A ∩ B)
      shadedAreas['A'] = colors['A'];
      shadedAreas['B'] = colors['B'];
      shadedAreas['ab'] = colors['symmetricDiff']; // La intersección es blanca
    }
    if (results.includes('B') && results.includes('C')) {
      // Sombreamos B Δ C (todo menos la intersección B ∩ C)
      shadedAreas['B'] = colors['B'];
      shadedAreas['C'] = colors['C'];
      shadedAreas['bc'] = colors['symmetricDiff'];
    }
    if (results.includes('C') && results.includes('A')) {
      // Sombreamos C Δ A (todo menos la intersección C ∩ A)
      shadedAreas['C'] = colors['C'];
      shadedAreas['A'] = colors['A'];
      shadedAreas['ca'] = colors['symmetricDiff'];
    }
  }

  // Procesar el complemento (^c)
  results.forEach(result => {
    if (result === 'A^c') {
      shadedAreas['A'] = 'none'; // A se deja en blanco
      shadedAreas['B'] = colors['B']; // Sombreamos todo lo demás
      shadedAreas['C'] = colors['C'];
      shadedAreas['universo'] = colors['universo'];
    } else if (result === 'B^c') {
      shadedAreas['A'] = colors['A']; // Sombreamos todo lo demás
      shadedAreas['B'] = 'none'; // B se deja en blanco
      shadedAreas['C'] = colors['C'];
      shadedAreas['universo'] = colors['universo'];
    } else if (result === 'C^c') {
      shadedAreas['A'] = colors['A']; // Sombreamos todo lo demás
      shadedAreas['B'] = colors['B'];
      shadedAreas['C'] = 'none'; // C se deja en blanco
      shadedAreas['universo'] = colors['universo'];
    }
  });

  // Asegurarse de que las áreas no utilizadas tengan 'none'
  if (!results.includes('A')) shadedAreas['A'] = 'none';
  if (!results.includes('B')) shadedAreas['B'] = 'none';
  if (!results.includes('C')) shadedAreas['C'] = 'none';
  if (!results.includes('A') && !results.includes('B')) shadedAreas['ab'] = 'none';
  if (!results.includes('B') && !results.includes('C')) shadedAreas['bc'] = 'none';
  if (!results.includes('C') && !results.includes('A')) shadedAreas['ca'] = 'none';
  if (!results.includes('A') && !results.includes('B') && !results.includes('C')) shadedAreas['abc'] = 'none';

  return shadedAreas;
};





const ActualizarGrafica = (userInput) => {
  // Interpretar la entrada del usuario para obtener resultados y operadores
  const { results, operators } = interpretInput(entrada);

  // Obtener las áreas sombreadas y sus colores
  const shadedAreas = getShadedAreas(results, operators);

  // Construir los datos para Highcharts basado en las áreas sombreadas
  const data = [
    {
        sets: ['A'],
        value: 3,
        name: conjuntoA,
        color: shadedAreas['A']
    },
    {
        sets: ['B'],
        value: 3,
        name: conjuntoB,
        color: shadedAreas['B']
    },
    {
        sets: ['C'],
        value: 3,
        name: conjuntoC,
        color: shadedAreas['C']
    },
    {
        sets: ['A', 'B'],
        value: 1,
        name: '',
        color: shadedAreas['ab'] || 'none' // Cambiado a 'ab'
    },
    {
        sets: ['A', 'C'],
        value: 1,
        name: '',
        color: shadedAreas['ca'] || 'none' // Cambiado a 'ca'
    },
    {
        sets: ['B', 'C'],
        value: 1,
        name: '',
        color: shadedAreas['bc'] || 'none' // Cambiado a 'bc'
    },
    {
        sets: ['A', 'B', 'C'],
        value: 1,
        name: '',
        color: shadedAreas['abc'] || 'none' // Cambiado a 'abc'
    }
];


  // Crear el gráfico de Venn
  Highcharts.chart('container', {
      chart: {
          type: 'venn',
          backgroundColor:  shadedAreas['universo'] || 'gray'
      },
      title: {
          text: 'Conjunto Universo: '+ universo
      },
      series: [{
          name: '',
          data: data.map(item => ({
              sets: item.sets,
              value: item.value,
              name: item.name,
              color: item.color // Asigna el color aquí
          }))
      }]
  });
};


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
{/* Renderizar botones para cada opción de simbología */}
<TooltipProvider>
      <div>
        {/* Renderizar botones para cada opción de simbología */}
        {options.map((option) => (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              <Button onClick={() => handleSymbolClick(option.label)}>
                {option.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
            </div>

            {/* Botón para calcular */}
            <Button onClick={handleCalculate}>Calcular</Button>

            {/*----************************************************************------------------- Resultados */}
            <div className="space-y-2">
              <Label>Resultados</Label>
              <Input value={results.ab} readOnly placeholder="a b" />
              <Input value={results.bc} readOnly placeholder="b c" />
              <Input value={results.ca} readOnly placeholder="c a" />
              <Input value={results.abc} readOnly placeholder="a b c" />
            </div>
            <Button onClick={ActualizarGrafica}>Actualizar Grafica</Button>
          </CardContent>
        </Card>
        <Card className="w-full md:w-2/3">
          <CardContent className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground">
            <div>
              <figure className="highcharts-figure">
                <div id="container" style={{ height: '400px' }}></div>
                <p className="highcharts-description">
                </p>
              </figure>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
