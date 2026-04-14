import { useAppStore } from "../store/appStore";
import { fetchChartData, getChartDefinition } from "../lib/chartConfig";
import { StateDefinition } from "../store/stateDefinition";
import LineChart from "./line_chart"
import BarChart from "./bar_chart"
import { use, useEffect, useState } from "react";
import { useChartOrchestrator } from "../lib/hooks/chartOrchestrator";
import { Window } from "./DragBox";
import { update } from "lodash";

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
                charts.map(async (chart) => {
                    const data = await fetchChartData(chart?.graphName, chart?.selectedAreas);
                    const chartDef = getChartDefinition(chart?.graphName);

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