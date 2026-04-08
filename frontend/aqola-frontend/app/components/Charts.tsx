import { useAppStore } from "../store/appStore";
import { fetchChartData, getChartDefinition } from "../lib/chartConfig";
import { StateDefinition } from "../store/stateDefinition";
import LineChart from "./line_chart"
import BarChart from "./bar_chart"
import { useEffect, useState } from "react";
import { useChartOrchestrator } from "../lib/hooks/chartOrchestrator";
import { Window } from "./dragBox";

const handleLineHover = (newValue: string) => {
    console.log("rahh");
};

export default function Charts() {
    const getCharts = useAppStore((state) => state.getCharts);
    const charts = getCharts() as StateDefinition[];
    const [chartElements, setChartElements] = useState<React.ReactNode[]>([]);
    const { closeChart } = useChartOrchestrator();

    useEffect(() => {
        async function buildCharts() {
            const elements = await Promise.all(
                charts.map(async (chart) => {
                    const data = await fetchChartData(chart?.graphName, chart?.selectedAreas);
                    const chartDef = getChartDefinition(chart?.graphName);

                    if (chartDef?.chartComponent === "line") {
                        return <Window triggerChart={closeChart} activeChartId={chart.graphName}>
                                    <LineChart key={chart.graphName} data={data} get_line_name={handleLineHover} />
                                </Window>
                    } else if (chartDef?.chartComponent === "bar") {
                        return <Window triggerChart={closeChart} activeChartId={chart.graphName}>
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