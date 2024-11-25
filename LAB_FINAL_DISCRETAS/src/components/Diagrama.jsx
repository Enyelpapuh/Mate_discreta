import React, { useEffect } from "react";
import * as d3 from "d3";

const AutomataDiagram = ({ visitedStates }) => {
  useEffect(() => {
    // Limpia el contenido previo del contenedor
    d3.select("#automata-graph").selectAll("*").remove();

    // Dimensiones del SVG
    const width = 800;
    const height = 600;

    // Selecciona el contenedor y crea un SVG
    const svg = d3.select("#automata-graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Datos para los nodos del autómata
    const nodes = [
      { id: "q0", x: 200, y: 160, label: "q0", initial: true },
      { id: "q1", x: 130, y: 540, label: "q1" },
      { id: "q2", x: 390, y: 520, label: "q2" },
      { id: "q3", x: 590, y: 320, label: "q3" },
      { id: "q4", x: 600, y: 200, label: "q4", final: true }
    ];

    // Datos para las transiciones del autómata
    const links = [
      { source: "q0", target: "q0", label: "0", curved: true, xOffset: 55, yOffset: -36 },
      { source: "q0", target: "q1", label: "1" },
      { source: "q1", target: "q2", label: "0" },
      { source: "q1", target: "q1", label: "1", curved: true, xOffset: 55, yOffset: -36},
      { source: "q2", target: "q0", label: "0" },
      { source: "q2", target: "q3", label: "1", curved: true, xOffset: -15, yOffset: -20 },
      { source: "q3", target: "q2", label: "0", curved: true, xOffset: 30, yOffset: 45 },
      { source: "q3", target: "q4", label: "1" },
      { source: "q4", target: "q0", label: "0", yOffset: -20 },
      { source: "q4", target: "q0", label: "1" }
    ];

    // Define la flecha para las transiciones
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", "9")
      .attr("refY", "5")
      .attr("markerWidth", "6")
      .attr("markerHeight", "6")
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 Z")
      .attr("fill", "black");

    // Función para crear un arco entre dos puntos
    const createArcPath = (source, target, curved) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const angle = Math.atan2(dy, dx); // Calcula el ángulo de la línea
      const offsetX = Math.cos(angle) * 30; // Ajuste para el radio del nodo (30 es el radio del nodo)
      const offsetY = Math.sin(angle) * 30;

      // Coordenadas ajustadas del punto final
      const adjustedTargetX = target.x - offsetX;
      const adjustedTargetY = target.y - offsetY;

      // Si es curvado, crea una curva
      if (curved) {
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M ${source.x},${source.y} A ${dr},${dr} 0 0,1 ${adjustedTargetX},${adjustedTargetY}`;
      }

      // Si no es curvado, dibuja una línea recta
      return `M ${source.x},${source.y} L ${adjustedTargetX},${adjustedTargetY}`;
    };

    // Función para crear un auto-bucle
    const createSelfLoopPath = (node) => {
      const x = node.x;
      const y = node.y;
      const radius = 100; // Tamaño del auto-bucle

      return `M ${x},${y - 30} C ${x + radius},${y - radius} ${x + radius},${y + radius} ${x},${y + 30}`;
    };

    // Crea enlaces/transiciones con la función de arco para las líneas curvadas
    svg.selectAll("path.link")
      .data(links)
      .enter()
      .append("path")
      .attr("d", d => {
        const sourceNode = nodes.find(n => n.id === d.source);
        const targetNode = nodes.find(n => n.id === d.target);

        // Si la transición es a sí misma (self-loop), usa la función createSelfLoopPath
        if (d.source === d.target) {
          return createSelfLoopPath(sourceNode);
        }
        return createArcPath(sourceNode, targetNode, d.curved);
      })
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)"); // Flecha al final de la línea

// Crea etiquetas para las transiciones
svg.selectAll("text.link-label")
  .data(links)
  .enter()
  .append("text")
  .attr("x", d => {
    const sourceNode = nodes.find(n => n.id === d.source);
    const targetNode = nodes.find(n => n.id === d.target);
    
    // Posición base
    let xPos = (sourceNode.x + targetNode.x) / 2;
    
    // Si existe un ajuste personalizado en x, aplícalo
    if (d.xOffset !== undefined) {
      xPos += d.xOffset;
    }
    
    return xPos;
  })
  .attr("y", d => {
    const sourceNode = nodes.find(n => n.id === d.source);
    const targetNode = nodes.find(n => n.id === d.target);
    
    // Posición base
    let yPos = (sourceNode.y + targetNode.y) / 2 - 10;
    
    // Si existe un ajuste personalizado en y, aplícalo
    if (d.yOffset !== undefined) {
      yPos += d.yOffset;
    }
    
    return yPos;
  })
  .attr("text-anchor", "middle")
  .attr("font-size", "px")
  .attr("fill", "black")
  .text(d => d.label);


    // Crea nodos
    const nodeGroup = svg.selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Crea círculos para los nodos
    nodeGroup.append("circle")
      .attr("r", 30)
      .attr("fill", "lightyellow")
      .attr("stroke", "black")
      .attr("stroke-width", d => d.final ? 3 : 1.5); // Doble borde para estado final

    // Crea etiqueta para el estado inicial
    nodeGroup.filter(d => d.initial)
      .append("polygon")
      .attr("points", "-40,0 -20,10 -20,-10")
      .attr("fill", "black");

    // Crea etiquetas para los nodos
    nodeGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("font-size", "12px")
      .text(d => d.label);
    
        // Función para resaltar un nodo
        const highlightNode = (stateId) => {
          nodeGroup.selectAll("circle")
            .attr("fill", d => d.id === stateId ? "lightgreen" : "lightyellow");
        };
    
    // Resalta los estados visitados paso a paso
    if (visitedStates && visitedStates.length > 0) {
      visitedStates.forEach((state, index) => {
        setTimeout(() => {
          highlightNode(state);
        }, index * 1000); // Espera 1 segundo antes de resaltar el siguiente
      });
    }

  }, [visitedStates]);

  return (
    <div id="automata-graph" className="w-full h-full"></div>
  );
};

export default AutomataDiagram;
