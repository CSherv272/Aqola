import { useAppStore } from "../store/appStore";
import { fetchChartData, getChartDefinition } from "../lib/chartConfig";
import { StateDefinition } from "../store/stateDefinition";
import LineChart from "./line_chart"
import BarChart from "./bar_chart"
import { useEffect, useState } from "react";

const handleLineHover = (newValue: string) => {
    console.log("rahh");
};

export default function Charts() {
    const getCharts = useAppStore((state) => state.getCharts);
    const charts = getCharts() as StateDefinition[];
    const [chartElements, setChartElements] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        async function buildCharts() {
            const elements = await Promise.all(
                charts.map(async (chart) => {
                    const data = await fetchChartData(chart?.graphName, chart?.selectedAreas);
                    const chartDef = getChartDefinition(chart?.graphName);

                    console.log(data)

                    if (chartDef?.chartComponent === "line") {
                        return <LineChart key={chart.graphName} data={data} get_line_name={handleLineHover} />;
                    } else if (chartDef?.chartComponent === "bar") {
                        console.log("i am barring ittttttt")
                        return <BarChart key={chart.graphName} data={data?.chart} />;
                    }
                })
            );
            setChartElements(elements);
            console.log("Chart elements: " + {chartElements})
        }

        buildCharts();
    }, [charts]);

    return <>{chartElements}</>;
}