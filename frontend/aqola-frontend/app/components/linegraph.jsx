// components/linegraph.tsx
"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

// type Props = {
//   onChange: (val: string) => void;
// };


export default function LinePlot({
    data,
    width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 40,
    onChange
}) {
    // Json passed in with x and y values for line graph

    let xVals = Object.values(data).flatMap(line => line.x)
    let yVals = Object.values(data).flatMap(line => line.y)


    const xLabel = useRef();
    const yLabel = useRef();

    // create the x and y scales for the graph, using the max x and y values from the data input
    const x = d3.scaleLinear([0, d3.max([...xVals])], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear([0, d3.max([...yVals])], [height - marginBottom, marginTop]);

    // const colours = ["cyan", "white", "red", "blue", "purple", "green", "orange", "black", "grey"]

    // creates a 2-D array of x-y co-ordinates for each line. In JSON format.
    const lineArray = Object.values(data).map(line =>
        line.x.map((xVal, i) => ({
            x: xVal,
            y: line.y[i]
        }))
    );

    // generates the line path for each line in the data input
    const lineGen = d3.line()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

    // create the x and y axis using d3
    useEffect(() => void d3.select(xLabel.current).call(d3.axisBottom(x)), [xLabel, x]);
    useEffect(() => void d3.select(yLabel.current).call(d3.axisLeft(y)), [yLabel, y]);

    return (
        <svg width={width} height={height}>
            {/* add the axis to the graph */}
            <g ref={xLabel} transform={`translate(0,${height - marginBottom})`} />
            <g ref={yLabel} transform={`translate(${marginLeft},0)`} />

            {/* for each line in the data input */}
            {lineArray.map((lineData, i) => (
                <g key={i}>
                    {/* make a line */}
                    <path
                        d={lineGen(lineData)}
                        fill="none"
                        // add the line's colour from data
                        stroke={Object.values(data)[i].colour}
                        strokeWidth="4px"
                    >
                        {/* add the line's name on hover */}
                        <title>{Object.entries(data)[i][0]}</title>
                    </path>

                    {/* add the circles at each co-ord */}
                    {lineData.map((d, j) => (
                        <circle
                            key={j}
                            cx={x(d.x)}
                            cy={y(d.y)}
                            r="3"
                            fill="white"
                            // add the circle's colour from data
                            stroke={Object.values(data)[i].colour}
                            onClick={() => onChange("herro")}
                        >
                            {/* add the point's co-ords on hover */}
                            <title>{`x: ${d.x}, y: ${d.y}`}</title>
                        </circle>
                    ))}
                </g>
            ))}
        </svg>
    );
}