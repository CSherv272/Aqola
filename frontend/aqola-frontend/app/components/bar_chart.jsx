"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function BarChart({
  data,
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

  // subgroups are the labels of the bars IN the bar graph groups (i.e. high risk, low risk)
  const subgroups = d3.map(data.groups[0].bars, (bar) => bar.bar_name);
  // groups are the labels of bar groups (in this case postcodes)
  const groups = d3.map(data.groups, (group) => group.name);

  console.log(subgroups + " SUBGROUPS");
  console.log(groups + " GROUPS");

  //Create the data scale for the x axis
  const xScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, innerWidth])
    .padding(0.2);

  //Create the data scale for the y axis
  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data.groups, (group) => d3.max(group.bars, (bar) => bar.value)),
    ])
    .range([innerHeight, 0]);

  //Create the subgroup data scale
  const xSubgroupScale = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, xScale.bandwidth()])
    .padding(0.1);

  //Color scale helps picks colours base on another group (this case subgroups)
  const colourScale = d3
    .scaleOrdinal()
    .domain(subgroups)
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
        {/* Create the lines going across the background */}
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

        {/* For every group, scale across the x based on the xscale */}
        {data.groups.map((group, index) => (
          <g transform={`translate(${xScale(group.name)}, 0)`} key={group.name}>
            {/* For every bar in subgroup, scale across starting from  */}
            {group.bars.map((bar, key) => (
              <rect
                x={xSubgroupScale(bar.bar_name)}
                y={yScale(bar.value)}
                width={xSubgroupScale.bandwidth()}
                height={innerHeight - yScale(bar.value)}
                key={key}
                id=""
                fill={bar.color}
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
