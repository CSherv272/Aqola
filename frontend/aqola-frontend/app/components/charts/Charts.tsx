import { useAppStore } from "../../store/AppStore";
import { fetchChartData, getChartDefinition } from "../../lib/ChartConfig";
import { StateDefinition } from "../../store/ChartStateModel";
import { useEffect, useRef, useState, memo } from "react";
import { useChartOrchestrator } from "../../lib/hooks/ChartOrchestrator";
import ChartWindow from "./ChartWindow";
import { ChartData } from "../../lib/ChartModels";

export default function Charts() {
    const getCharts = useAppStore((state) => state.getCharts);
    const focusChart = useAppStore((state) => state.focusChart);
    const charts = getCharts() as StateDefinition[];
    const { closeChart } = useChartOrchestrator();

    // Dictionary of chart name and corresponding data
    const [chartsData, setChartsData] = useState<Record<string, ChartData>>({});
    // Ref to keep track of previously rendered charts
    const prevChartNamesRef = useRef<Set<string>>(new Set());
    // Ref to selected areas in appstore
    const selectedAreas = useAppStore((state) => state.selectedAreas);
    // Ref to previous selected areas
    const prevSelectedAreasRef = useRef<string[]>(selectedAreas);

    useEffect(() => {
        const currentCharts = new Set(charts.map((c) => c.chartName));
        const prevRenderedCharts = prevChartNamesRef.current;

        // Find new, removed, and updated charts
        const addedCharts = charts.filter((c) => !prevRenderedCharts.has(c.chartName));

        let changedCharts: StateDefinition[] = [];
        if (charts.length > 0) {
            changedCharts = JSON.stringify(prevSelectedAreasRef.current) == JSON.stringify(selectedAreas) ? [] : [charts[0]];
        }
        
        const removedCharts = [...prevRenderedCharts].filter((chart) => !currentCharts.has(chart));
        
        // Drop removed charts from the data dictionary
        if (removedCharts.length > 0) {
            const newChartData = { ...chartsData };
            removedCharts.forEach((name) => delete newChartData[name]);
            setChartsData(newChartData);
        }

        // Fetch data only for new charts
        const chartsToUpdate = new Set([...addedCharts, ...changedCharts]);
        if (chartsToUpdate.size > 0) {
            Promise.all(
                Array.from(chartsToUpdate).map(async (chart) => {
                    const data = await fetchChartData(chart.chartName, chart.selectedAreas);
                    return [chart.chartName, data];
                }))
            .then((chartDataToAdd) => {
                setChartsData((prevChartData) => ({ ...prevChartData, ...Object.fromEntries(chartDataToAdd) }));
            });
        }

        // Update the ref to the current chart names
        prevChartNamesRef.current = currentCharts;
        prevSelectedAreasRef.current = selectedAreas;

    }, [charts]);
    

    return (
        <>
            {charts.map((chart) => {
                const data = chartsData[chart.chartName];
                if (data === undefined) return null;
                return (
                    <ChartWindow
                        key={chart.chartName}
                        chart={chart}
                        data={data}
                        focusChart={focusChart}
                        closeChart={closeChart}
                        zIndex={ 400 + charts.length - charts.findIndex((c) => c.chartName === chart.chartName) }
                    />
                );
            })}
        </>
    );
}