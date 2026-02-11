"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function BarGraph({
  data = [
    {
      postcode: "CT2 7QS",
      high_risk: 10,
      medium_risk: 20,
      low_risk: 50,
      very_low_risk: 80,
    },
    {
      postcode: "CT2 7QB",
      high_risk: 20,
      medium_risk: 10,
      low_risk: 50,
      very_low_risk: 70,
    },
    {
      postcode: "CT2 7LS",
      high_risk: 40,
      medium_risk: 10,
      low_risk: 50,
      very_low_risk: 70,
    },
    {
      postcode: "CT2 7BR",
      high_risk: 30,
      medium_risk: 10,
      low_risk: 50,
      very_low_risk: 70,
    },
    {
      postcode: "CT2 7SY",
      high_risk: 60,
      medium_risk: 10,
      low_risk: 50,
      very_low_risk: 70,
    },
    {
      postcode: "CT2 7RB",
      high_risk: 20,
      medium_risk: 10,
      low_risk: 50,
      very_low_risk: 70,
    },
  ],

  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 60,
  width = 640,
  height = 400,
}) {
  const gx = useRef();
  const gy = useRef();
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight],
  );
  const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);

  const line = d3.line((d, i) => x(i), y);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.postcode))
    .range([0, innerHeight])
    .padding(0.05);

  const xScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) =>
        Math.max(d.high_risk, d.medium_risk, d.low_risk, d.very_low_risk),
      ),
    ])
    .range([0, innerWidth]);

  useEffect(
    () => void d3.select(gx.current).call(d3.axisBottom(xScale)),
    [gx, xScale],
  );
  useEffect(
    () => void d3.select(gy.current).call(d3.axisLeft(yScale)),
    [gy, yScale],
  );

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${marginLeft}, ${marginTop})`}>
        {xScale.ticks().map((tickValue) => (
          <line
            x1={xScale(tickValue)}
            y1={0}
            x2={xScale(tickValue)}
            y2={innerHeight}
            stroke="white"
            key={tickValue}
          />
        ))}

        {data.map((d, i) => [
          <rect
            x={0}
            y={yScale(d.postcode)}
            width={xScale(d.high_risk)}
            height={yScale.bandwidth()}
            key={i}
            fill="red"
          />,
          //   <rect
          //     x={0}
          //     y={yScale(d.postcode)}
          //     width={xScale(d.medium_risk)}
          //     height={yScale.bandwidth()}
          //     key={i}
          //     fill="yellow"
          //   />,
        ])}
      </g>
      <g
        ref={gx}
        transform={`translate(${marginLeft},${height - marginBottom})`}
      />
      <g ref={gy} transform={`translate(${marginLeft},${marginTop})`} />
    </svg>
  );
}
