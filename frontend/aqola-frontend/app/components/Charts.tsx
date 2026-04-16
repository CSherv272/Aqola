import { useAppStore } from "../store/AppStore";
import { fetchChartData, getChartDefinition } from "../lib/ChartConfig";
import { StateDefinition } from "../store/ChartStateModel";
import { useEffect, useRef, useState, memo } from "react";
import { useChartOrchestrator } from "../lib/hooks/ChartOrchestrator";
import ChartWindow from "./ChartWindow";

export default function Charts() {
    const getCharts = useAppStore((state) => state.getCharts);
    const focusChart = useAppStore((state) => state.focusChart);
    const charts = getCharts() as StateDefinition[];
    const { closeChart } = useChartOrchestrator();
    let zIndex = 0;

    // Dictionary of chart name and corresponding data
    const [chartsData, setChartsData] = useState<Record<string, any>>({});
    // Ref to keep track of previously rendered charts
    const prevChartNamesRef = useRef<Set<string>>(new Set());
    // Ref to selected areas in appstore
    let selectedAreas = useAppStore((state) => state.selectedAreas);

    useEffect(() => {
        const zIndexBase = 1500;
        const currentCharts = new Set(charts.map((c) => c.graphName));
        const prevRenderedCharts = prevChartNamesRef.current;

        // Find new, removed, and updated charts
        const addedCharts = charts.filter((c) => !prevRenderedCharts.has(c.graphName));
        const changedCharts = charts.filter((chart) => { return chart.selectedAreas != selectedAreas; });
        const removedCharts = [...prevRenderedCharts].filter((chart) => !currentCharts.has(chart));

        // Drop removed charts from the data dictionary
        if (removedCharts.length > 0) {
            let newChartData = { ...chartsData };
            removedCharts.forEach((name) => delete newChartData[name]);
            setChartsData(newChartData);
        }

        // Fetch data only for new charts
        const chartsToUpdate = new Set([...addedCharts, ...changedCharts]);
        if (chartsToUpdate.size > 0) {
            Promise.all(
                Array.from(chartsToUpdate).map(async (chart) => {
                    const data = await fetchChartData(chart.graphName, chart.selectedAreas);
                    return [chart.graphName, data];
                }))
            .then((chartDataToAdd) => {
                setChartsData((prevChartData) => ({ ...prevChartData, ...Object.fromEntries(chartDataToAdd) }));
            });
        }

        // Update the ref to the current chart names
        prevChartNamesRef.current = currentCharts;

    }, [charts]);
    

    return (
        <>
            {charts.map((chart) => {
                const data = chartsData[chart.graphName];
                if (data === undefined) return null;
                zIndex = 1500 + charts.length - charts.findIndex((c) => c.graphName === chart.graphName);
                return (
                    <ChartWindow
                        key={chart.graphName}
                        chart={chart}
                        data={data}
                        focusChart={focusChart}
                        closeChart={closeChart}
                        zIndex={ zIndex }
                    />
                );
            })}
        </>
    );
}