import React, { useEffect } from "react";
import * as d3 from "d3";

const AutomataDiagram2 = ({ visitedStates }) => {
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
      { id: "q0", x: 200, y: 160, label: "q0", initial: true, final: true },
      { id: "q1", x: 130, y: 540, label: "q1" },
      { id: "q2", x: 390, y: 520, label: "q2" },
    ];

    // Datos para las transiciones del autómata
    const links = [
      { source: "q0", target: "q0", label: "0", curved: true },
      { source: "q0", target: "q1", label: "1", curved: true },
      { source: "q1", target: "q2", label: "0", curved: true },
      { source: "q1", target: "q0", label: "1", curved: true },
      { source: "q2", target: "q1", label: "0", curved: true },
      { source: "q2", target: "q2", label: "1", curved: true },
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
      const dr = Math.sqrt(dx * dx + dy * dy);

      if (curved) {
        return `M ${source.x},${source.y} A ${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      }

      return `M ${source.x},${source.y} L ${target.x},${target.y}`;
    };

    // Función para crear un auto-bucle
    const createSelfLoopPath = (node) => {
      const x = node.x;
      const y = node.y;
      const radius = 40;

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

        if (d.source === d.target) {
          return createSelfLoopPath(sourceNode);
        }
        return createArcPath(sourceNode, targetNode, d.curved);
      })
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    // Crea etiquetas para las transiciones
    svg.selectAll("text.link-label")
      .data(links)
      .enter()
      .append("text")
      .attr("x", d => {
        const sourceNode = nodes.find(n => n.id === d.source);
        const targetNode = nodes.find(n => n.id === d.target);
        return (sourceNode.x + targetNode.x) / 2;
      })
      .attr("y", d => {
        const sourceNode = nodes.find(n => n.id === d.source);
        const targetNode = nodes.find(n => n.id === d.target);
        return (sourceNode.y + targetNode.y) / 2 - 10;
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text(d => d.label);

    // Crea nodos
    const nodeGroup = svg.selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Crea círculos para los nodos
    const circles = nodeGroup.append("circle")
      .attr("r", 30)
      .attr("fill", "lightyellow")
      .attr("stroke", "black")
      .attr("stroke-width", d => d.final ? 3 : 1.5);

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

  return <div id="automata-graph"></div>;
};

export default AutomataDiagram2;
