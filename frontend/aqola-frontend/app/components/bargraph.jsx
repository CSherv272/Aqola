"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function BarGraph({
  data = [
    {
      postcode: "CT2 7QS",
      risks: {
        high_risk: 12,
        medium_risk: 20,
        low_risk: 50,
        very_low_risk: 80,
      },
    },
    {
      postcode: "CT2 7QB",
      risks: {
        high_risk: 23,
        medium_risk: 10,
        low_risk: 50,
        very_low_risk: 70,
      },
    },
    {
      postcode: "CT2 7LS",
      risks: {
        high_risk: 40,
        medium_risk: 10,
        low_risk: 50,
        very_low_risk: 70,
      },
    },
    {
      postcode: "CT2 7BR",
      risks: {
        high_risk: 32,
        medium_risk: 10,
        low_risk: 50,
        very_low_risk: 70,
      },
    },
    {
      postcode: "CT2 7SY",
      risks: {
        high_risk: 65,
        medium_risk: 10,
        low_risk: 50,
        very_low_risk: 70,
      },
    },
    {
      postcode: "CT2 7RB",
      risks: {
        high_risk: 24,
        medium_risk: 10,
        low_risk: 50,
        very_low_risk: 70,
      },
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

  const postcode_subgroups = d3.map(data, (d) => d.risks);

  const postcode_groups = d3.map(data, (d) => d.postcode);

  console.log(postcode_subgroups + " SUBGROUPS");
  console.log(postcode_groups + " GROUPS");

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.postcode))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) =>
        Math.max(
          d.risks.high_risk,
          d.risks.medium_risk,
          d.risks.low_risk,
          d.risks.very_low_risk,
        ),
      ),
    ])
    .range([innerHeight, 0]);

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
        {yScale.ticks().map((tickValue) => (
          <line
            x1={0}
            y1={yScale(tickValue)}
            x2={innerWidth}
            y2={yScale(tickValue)}
            stroke="white"
            key={tickValue}
          />
        ))}

        {data.map((d, i) => [
          <rect
            x={xScale(d.postcode)}
            y={yScale(d.risks.high_risk)}
            width={xScale.bandwidth()}
            height={innerHeight - yScale(d.risks.high_risk)}
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
