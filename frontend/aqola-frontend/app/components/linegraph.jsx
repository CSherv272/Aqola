// components/linegraph.tsx
"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function LinePlot({
    data,
    width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 40
}) {
    // Json passed in with x and y values for line graph

    let xVals = Object.values(data).flatMap(line => line.x)
    let yVals = Object.values(data).flatMap(line => line.y)


    const xLabel = useRef();
    const yLabel = useRef();

    const x = d3.scaleLinear([0, d3.max([...xVals])], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear([0, d3.max([...yVals])], [height - marginBottom, marginTop]);

    // creates a 2-D array of x-y co-ordinates for each line. In JSON format.
    const lineArray = Object.values(data).map(line =>
        line.x.map((xVal, i) => ({
            x: xVal,
            y: line.y[i]
        }))
    );


    const lineGen = d3.line()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

    useEffect(() => void d3.select(xLabel.current).call(d3.axisBottom(x)), [xLabel, x]);
    useEffect(() => void d3.select(yLabel.current).call(d3.axisLeft(y)), [yLabel, y]);

    return (
        <svg width={width} height={height}>
            <g ref={xLabel} transform={`translate(0,${height - marginBottom})`} />
            <g ref={yLabel} transform={`translate(${marginLeft},0)`} />

            {lineArray.map((lineData, i) => (
                <g key={i}>
                    <path
                        d={lineGen(lineData)}
                        fill="none"
                        stroke="currentColor"
                    />

                    {lineData.map((d, j) => (
                        <circle
                            key={j}
                            cx={x(d.x)}
                            cy={y(d.y)}
                            r="2.5"
                            fill="white"
                            stroke="currentColor"
                        />
                    ))}
                </g>
            ))}
        </svg>
    );
}