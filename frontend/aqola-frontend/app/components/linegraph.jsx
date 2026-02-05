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
    let xVals = data.line1.x
    let yVals = data.line1.y

    console.log(xVals)
    console.log(yVals)
    
    const xLabel = useRef();
    const yLabel = useRef();

    const x = d3.scaleLinear([0, d3.max(xVals)], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear([0, d3.max(yVals)], [height - marginBottom, marginTop]);

    const points = xVals.map((val, i) => ({ x: val, y: yVals[i] }));
    console.log(points)

    const line = d3.line()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

    // console.log(line)

    useEffect(() => void d3.select(xLabel.current).call(d3.axisBottom(x)), [xLabel, x]);
    useEffect(() => void d3.select(yLabel.current).call(d3.axisLeft(y)), [yLabel, y]);

    return (
        <svg width={width} height={height}>
            <g ref={xLabel} transform={`translate(0,${height - marginBottom})`} />
            <g ref={yLabel} transform={`translate(${marginLeft},0)`} />
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(points)} />
                <g fill="white" stroke="currentColor" strokeWidth="1.5">
                {points.map((d, i) => (
                    <circle
                    key={i}
                    cx={x(d.x)}
                    cy={y(d.y)}
                    r="2.5"
                    />
                ))}
                </g>
        </svg>
    );
}