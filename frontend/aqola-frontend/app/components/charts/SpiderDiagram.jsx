import * as d3 from "d3";
import { useRef, useEffect } from "react";

function RadarChart({ data }) {
	// Refs for SVG elements
	const gRef = useRef();
	const chartRef = useRef();
	const svgRef = useRef();

	const width = 600;
	const height = 600;
	const margin = { top: 80, right: 80, bottom: 80, left: 80 };
	const levels = 5;

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
		if (!gRef.current || data.chart.groups.length === 0 || !svgRef.current) return;

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
			.attr("text-anchor", (_, i) => {
				const angle = sectionAngle * i;
				if (angle < Math.PI && angle != 0) return "start";
				if (angle > Math.PI && angle != 0) return "end";
				return "middle";
			})
			.attr("dy", "0.35em")
			.attr("x", (_, i) => {
				const angle = sectionAngle * i;
				const x = attributeScale(maxValue * 1.1) * Math.cos(angle - Math.PI / 2);
				const padding = angle < Math.PI ? 8 : -8;
				return x + padding;
			})
			.attr("y", (_, i) => {
				const angle = sectionAngle * i;
				const y = attributeScale(maxValue * 1.1) * Math.sin(angle - Math.PI / 2);
				const padding = angle < Math.PI/2.5 || angle > Math.PI * 1.75 ? -8 : 8;
				return y + padding;
			})
			.attr("fill", "white")
			.text((d) => d);

		// Add a title
		d3.select(svgRef.current)
			.append("text")
			.attr("class", "chart-title")
			.attr("x", width / 2)
			.attr("y", margin.top / 2)
			.attr("fill", "white")
			.attr("text-anchor", "middle")
			.attr("font-size", "20px")
			.text(data.chart.title);
	}, [data, width, height]);

	return (
	<svg
		viewBox={`0 0 ${width} ${height}`}
		style={{ width: "100%", height: "100%", display: "block" }}
		preserveAspectRatio="xMidYMid meet"
		ref={svgRef}
	>
		<g transform={`translate(${width / 2}, ${height / 2})`} ref={gRef} width={"100%"} height={"100%"}>
		<g ref={chartRef} width={"100%"} height={"100%"} />

		{/* Stat Polygons */}
		{data.chart.groups.map((group, i) => (
			<g key={group[0].plot_name}>
				<g key={i} width={"100%"} height={"100%"} >
					<path
						d={attributeLine(group)}
						fill={group[0].color}
						fillOpacity={0.35}
						stroke={group[0].color}
						strokeWidth={2}
					/>
					{/* Points on the axes */}
					{group.map((d, j) => (
						<circle
						key={j}
						r={4}
						cx={attributeScale(d.value) * Math.cos(sectionAngle * j - Math.PI / 2)}
						cy={attributeScale(d.value) * Math.sin(sectionAngle * j - Math.PI / 2)}
						fill={d.color}
						fillOpacity={0.8}
						/>
					))}
					<title>{group[0].plot_name}</title>
				</g>
				{/* Legend */}
				<g>
					<circle
					cx={width - 200}
					cy={i * 15}
					r="6"
					fill={group[0].color}
					/>
					<text
					x={width - 190}
					y={i * 15}
					fill="white"
					dominantBaseline="middle"
					>
					{group[0].plot_name}
					</text>
				</g>
			</g>
		))}
		</g>
	</svg>
	);
}

export default RadarChart;