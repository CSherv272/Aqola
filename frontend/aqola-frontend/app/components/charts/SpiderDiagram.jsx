import * as d3 from "d3";
import { useRef, useEffect } from "react";

function RadarChart({ data }) {
	// Refs for SVG elements
	const gRef = useRef();
	const chartRef = useRef();

	const width = 600;
	const height = 600;
	const margin = { top: 80, right: 80, bottom: 80, left: 80 };
	const levels = 5;
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// Calculate the radius of the radar chart
	const radius = Math.min((width - margin.left - margin.right) / 2, (height - margin.top - margin.bottom) / 2);

	// Find the max value in data, get axes labels, and calculate angles between axes
	const maxValue = d3.max(data.chart.groups.flat(), (i) => i.value) ?? 0;
	const axesLabels = data.chart.groups[0].map((i) => i.axis);
	const sectionAngle = (Math.PI * 2) / axesLabels.length;

	// Set a scale for the attributes based on the max value and radius
	const attributeScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

	// Function for creating attribute lines
	const attributeLine = d3.lineRadial()
		.curve(d3.curveLinearClosed)
		.radius((d) => attributeScale(d.value))
		.angle((_, i) => i * sectionAngle);

	useEffect(() => {
		if (!gRef.current || data.chart.groups.length === 0) return;

		// Axis
		const chart = d3.select(chartRef.current);
		chart.selectAll("*").remove();

		// Plot the level circles
		chart.selectAll(".levels")
			.data(d3.range(1, levels + 1).reverse())
			.enter()
			.append("circle")
			.attr("r", (d) => (radius / levels) * d)
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", 0.1);

		// Plot the level labels
		chart.selectAll(".axisLabel")
			.data(d3.range(1, levels + 1).reverse())
			.enter()
			.append("text")
			.attr("x", 4)
			.attr("y", (d) => (-d * radius) / levels)
			.attr("dy", "0.4em")
			.style("font-size", "10px")
			.attr("fill", "#fff")
			.text((d) => Math.round((maxValue * (d / levels))));

		// Create axis plot
		const axis = chart.selectAll(".axis")
			.data(axesLabels)
			.enter()
			.append("g")
			.attr("width", "100%")
			.attr("height", "100%");

		// Add each axis line for the features
		axis.append("line")
			.attr("x1", 0).attr("y1", 0)
			.attr("x2", (_, i) => attributeScale(maxValue * 1.05) * Math.cos(sectionAngle * i - Math.PI / 2))
			.attr("y2", (_, i) => attributeScale(maxValue * 1.05) * Math.sin(sectionAngle * i - Math.PI / 2))
			.style("stroke", "white")
			.style("stroke-width", "2px");
		
		// Add labels for each axis
		axis.append("text")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", (_, i) => attributeScale(maxValue * 1.1) * Math.cos(sectionAngle * i - Math.PI / 2))
			.attr("y", (_, i) => attributeScale(maxValue * 1.1) * Math.sin(sectionAngle * i - Math.PI / 2))
			.attr("fill", "#78b4b9d9")
			.text((d) => d);
	}, [data]);

	return (
	<svg
		viewBox={`0 0 ${width} ${height}`}
		style={{ width: "100%", height: "100%", display: "block" }}
		preserveAspectRatio="xMidYMid meet"
	>
		<g transform={`translate(${width / 2}, ${height / 2})`} ref={gRef} width={"100%"} height={"100%"}>
		<g ref={chartRef} width={"100%"} height={"100%"} />

		{/* Stat Polygons */}
		{data.chart.groups.map((group, i) => (
			<g key={i} width={"100%"} height={"100%"} >
				<path
					d={attributeLine(group)}
					fill={color(i)}
					fillOpacity={0.35}
					stroke={color(i)}
					strokeWidth={2}
				/>
				{/* Points on the axes */}
				{group.map((d, j) => (
					<circle
					key={j}
					r={4}
					cx={attributeScale(d.value) * Math.cos(sectionAngle * j - Math.PI / 2)}
					cy={attributeScale(d.value) * Math.sin(sectionAngle * j - Math.PI / 2)}
					fill={color(i)}
					fillOpacity={0.8}
					/>
				))}
			</g>
		))}
		</g>
	</svg>
	);
}

export default RadarChart;