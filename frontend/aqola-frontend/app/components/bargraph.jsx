"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function BarGraph({
  data = {
    groups: [
      {
        name: "CT2 7QS",
        bars: [
          {
            bar_name: "high_risk",
            value: 30,
          },
          {
            bar_name: "medium_risk",
            value: 12,
          },
          {
            bar_name: "low_risk",
            value: 40,
          },
          {
            bar_name: "very_low_risk",
            value: 50,
          },
        ],
      },
      {
        name: "CT2 7QB",
        bars: [
          {
            bar_name: "high_risk",
            value: 45,
          },
          {
            bar_name: "medium_risk",
            value: 64,
          },
          {
            bar_name: "low_risk",
            value: 20,
          },
          {
            bar_name: "very_low_risk",
            value: 3,
          },
        ],
      },
      {
        name: "CT2 7QA",
        bars: [
          {
            bar_name: "high_risk",
            value: 45,
          },
          {
            bar_name: "medium_risk",
            value: 64,
          },
          {
            bar_name: "low_risk",
            value: 20,
          },
          {
            bar_name: "very_low_risk",
            value: 3,
          },
        ],
      },
    ],
    title: "Flood data bargraph!",
    xlabel: "Postcodes",
    ylabel: "Number of Houses at risk",
  },
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 60,
  width = 840,
  height = 600,
}) {
  const gx = useRef();
  const gy = useRef();
  const subgx = useRef();

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;
  const postcode_subgroups = d3.map(data.groups[0].bars, (bar) => bar.bar_name);
  const postcode_groups = d3.map(data.groups, (group) => group.name);

  console.log(postcode_subgroups + " SUBGROUPS");
  console.log(postcode_groups + " GROUPS");

  const xScale = d3
    .scaleBand()
    .domain(postcode_groups)
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data.groups, (group) => d3.max(group.bars, (bar) => bar.value)),
    ])
    .range([innerHeight, 0]);

  const xSubgroupScale = d3
    .scaleBand()
    .domain(postcode_subgroups)
    .range([0, xScale.bandwidth()])
    .padding(0.1);

  const colourScale = d3
    .scaleOrdinal()
    .domain(postcode_subgroups)
    .range(["#dc0000", "#e7b416", "#fff500", "#2dc937"]);

  useEffect(
    () => void d3.select(gx.current).call(d3.axisBottom(xScale)),
    [gx, xScale],
  );
  useEffect(
    () => void d3.select(gy.current).call(d3.axisLeft(yScale)),
    [gy, yScale],
  );
  useEffect(
    () => void d3.select(subgx.current).call(d3.axisBottom(xSubgroupScale)),
    [subgx, xSubgroupScale],
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

        {data.groups.map((group, index) => (
          <g transform={`translate(${xScale(group.name)}, 0)`} key={group.name}>
            {group.bars.map((bar, key) => (
              <rect
                x={xSubgroupScale(bar.bar_name)}
                y={yScale(bar.value)}
                width={xSubgroupScale.bandwidth()}
                height={innerHeight - yScale(bar.value)}
                key={key}
                id=""
                fill={colourScale(bar.bar_name)}
                className="hover:saturate-300 focus:outline-2 transition-transform duration-300"
              />
            ))}
          </g>
        ))}
      </g>

      {/* group.bars.map((bar, index) => [
            <rect
              x={xSubgroupScale(group.name)}
              y={yScale(bar.value)}
              width={xSubgroupScale.bandwidth()}
              height={innerHeight - yScale(bar.value)}
              key={key}
              fill="red"
            />,
          ]), */}

      <g
        ref={gx}
        transform={`translate(${marginLeft},${height - marginBottom})`}
      />
      <g ref={gy} transform={`translate(${marginLeft},${marginTop})`} />
    </svg>
  );
}
