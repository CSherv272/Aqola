import { getChartDefinition } from "../../lib/ChartConfig";
import { StateDefinition } from "../../store/ChartStateModel";
import LineChart from "./LineChart"
import BarChart from "./BarChart"
import RadarChart from "./SpiderDiagram";
import { memo } from "react";
import { Window } from "../DragBox"


// memo stops re-renders of chart unless props change
const ChartWindow = memo(({ chart, data, focusChart, closeChart, zIndex }: {
    chart: StateDefinition;
    data: any;
    focusChart: any;
    closeChart: (name: string) => void;
    zIndex: number;
}) => {
    const chartDef = getChartDefinition(chart.chartName);

    // console.log(`Rendering chart window for ${chart.chartName} with data:`, data);

    if (chartDef?.chartComponent === "line") {
        return (
            <Window closeChart={() => closeChart(chart.chartName)} activeChartId={chart.chartName} focusChart={focusChart} zIndex={zIndex}>
                <LineChart data={data} />
            </Window>
        );
    } else if (chartDef?.chartComponent === "bar") {
        return (
            <Window closeChart={() => closeChart(chart.chartName)} activeChartId={chart.chartName} focusChart={focusChart} zIndex={zIndex}>
                <BarChart data={data?.chart} />
            </Window>
        );
    } else if (chartDef?.chartComponent === "spider") {
        return (
            <Window closeChart={() => closeChart(chart.chartName)} activeChartId={chart.chartName} focusChart={focusChart} zIndex={zIndex}>
                <RadarChart data={data}/>
                {/* <div>Spider chart coming soon!</div> */}
            </Window>
        );
    }
    return null;
});

export default ChartWindow;

ChartWindow.displayName = "ChartWindow";