import { useAppStore } from "../store/AppStore";
import { fetchChartData, getChartDefinition } from "../lib/ChartConfig";
import { StateDefinition } from "../store/ChartStateModel";
import LineChart from "./LineChart"
import BarChart from "./BarChart"
import { useEffect, useState } from "react";
import { useChartOrchestrator } from "../lib/hooks/chartOrchestrator";
import { Window } from "./DragBox";

const handleLineHover = (newValue: string) => {
    console.log("rahh");
};

export default function Charts() {
    const getCharts = useAppStore((state) => state.getCharts);
    const focusChart = useAppStore((state) => state.focusChart);
    const charts = getCharts() as StateDefinition[];
    const [chartElements, setChartElements] = useState<React.ReactNode[]>([]);
    const { closeChart } = useChartOrchestrator();

    // Whenever the charts in the stack change, rebuild the chart elements
    useEffect(() => {
        async function buildCharts() {
            const elements = await Promise.all(
                // For each chart in the app state stack
                charts.map(async (chart) => {
                    // Get corresponding data
                    const data = await fetchChartData(chart?.graphName, chart?.selectedAreas);
                    const chartDef = getChartDefinition(chart?.graphName);

                    // Create either line or bar chart
                    if (chartDef?.chartComponent === "line") {
                        return <Window closeChart={() => closeChart(chart.graphName)} activeChartId={chart.graphName} focusChart={focusChart}>
                                    <LineChart key={chart.graphName} data={data} get_line_name={handleLineHover} />
                                </Window>
                    } else if (chartDef?.chartComponent === "bar") {
                        return <Window closeChart={() => closeChart(chart.graphName)} activeChartId={chart.graphName} focusChart={focusChart}>
                                    <BarChart key={chart.graphName} data={data?.chart} />
                                </Window>
                    }
                })
            );
            setChartElements(elements);
        }

        buildCharts();
    }, [charts]);

    return <>{chartElements}</>;
}