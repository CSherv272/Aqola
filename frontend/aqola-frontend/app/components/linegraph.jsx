// components/linegraph.tsx
"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

// type Props = {
//   onChange: (val: string) => void;
// };

export default function LinePlot({
  data,
  colours,
  width = 640,
  height = 400,
  marginTop = 100,
  marginRight = 50,
  marginBottom = 40,
  marginLeft = 50,
  get_line_name,
}) {
  // Json passed in with x and y values for line graph

  let xVals = data.chart.lines
    .map((line) => line.coords.map((coord) => coord[0]))
    .flat();
  let yVals = data.chart.lines
    .map((line) => line.coords.map((coord) => coord[1]))
    .flat();

  const svg = useRef();
  const xLabel = useRef();
  const yLabel = useRef();

  // create the x and y scales for the graph, using the max x and y values from the data input
  const x = d3.scaleLinear(
    [d3.min([...xVals]), d3.max([...xVals])],
    [marginLeft, width - marginRight],
  );
  const y = d3.scaleLinear(
    [0, d3.max([...yVals])],
    [height - marginBottom, marginTop],
  );

  // generates the line path for each line in the data input
  const lineGen = d3
    .line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

  // create the x & y axis, title, and x & y labels using d3
  useEffect(() => {
    (d3.select(xLabel.current).call(d3.axisBottom(x)), [xLabel, x]);
    (d3.select(yLabel.current).call(d3.axisLeft(y)), [yLabel, y]);

    d3.select(xLabel.current)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .text(data.chart.xlabel);

    d3.select(yLabel.current)
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -35)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .text(data.chart.ylabel);
    d3.select(svg.current)
      .append("text")
      .attr("x", width / 2)
      .attr("y", marginTop / 2)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .text(data.chart.title);
  }, []);

  return (
    <svg ref={svg} width={width} height={height}>
      {/* add the axis to the graph */}
      <g ref={xLabel} transform={`translate(0,${height - marginBottom})`} />
      <g ref={yLabel} transform={`translate(${marginLeft},0)`} />

      {/* for each line in the data input */}
      {data.chart.lines.map((line, i) => (
        <g key={i}>
          {/* make a line */}
          <path
            d={lineGen(line.coords)}
            fill="none"
            // add the line's colour from data
            stroke={colours[line.line_name]}
            strokeWidth="4px"
            onMouseEnter={() => get_line_name(line.line_name)}
          >
            {/* add the line's name on hover */}
            <title>{line.line_name}</title>
          </path>

          {/* add the circles at each co-ord */}
          {line.coords.map((d, j) => (
            <circle
              key={j}
              cx={x(d[0])}
              cy={y(d[1])}
              r="3"
              fill="white"
              // add the circle's colour from data
              stroke={colours[line.line_name]}
              onMouseEnter={() => get_line_name(line.line_name)}
            >
              {/* add the point's co-ords on hover */}
              <title>{`x: ${d[0]}, y: ${d[1]}`}</title>
            </circle>
          ))}
        </g>
      ))}
    </svg>
  );
}
