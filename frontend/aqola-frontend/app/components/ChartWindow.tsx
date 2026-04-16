import { useAppStore } from "../store/AppStore";
import { fetchChartData, getChartDefinition } from "../lib/ChartConfig";
import { StateDefinition } from "../store/ChartStateModel";
import LineChart from "./LineChart"
import BarChart from "./BarChart"
import { useEffect, useState, useRef, MutableRefObject, memo } from "react";
import { useChartOrchestrator } from "../lib/hooks/ChartOrchestrator";
import { Window }from "./DragBox";

const handleLineHover = (newValue: string) => {
    console.log("rahh");
};

// memo stops re-renders of chart unless props change
const ChartWindow = memo(({ chart, data, focusChart, closeChart }: {
    chart: StateDefinition;
    data: any;
    focusChart: any;
    closeChart: (name: string) => void;
}) => {
    const chartDef = getChartDefinition(chart.graphName);

    if (chartDef?.chartComponent === "line") {
        return (
            <Window closeChart={() => closeChart(chart.graphName)} activeChartId={chart.graphName} focusChart={focusChart}>
                <LineChart data={data} get_line_name={handleLineHover} />
            </Window>
        );
    } else if (chartDef?.chartComponent === "bar") {
        return (
            <Window closeChart={() => closeChart(chart.graphName)} activeChartId={chart.graphName} focusChart={focusChart}>
                <BarChart data={data?.chart} />
            </Window>
        );
    }
    return null;
});

export default ChartWindow;