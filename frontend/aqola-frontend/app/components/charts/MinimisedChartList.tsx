import { useAppStore } from "../../store/AppStore";
import { StateDefinition } from "@/app/store/ChartStateModel";

const MinimisedChartList = () => {
    const charts = useAppStore((state) => state.minimisedCharts);
    const reopenChart = useAppStore((state) => state.reopenMinimisedChart);
    const removeChart = useAppStore((state) => state.removeMinimisedChart);

    const removeFunction = (e: any, chartName: string) => {
        e.stopPropagation()
        removeChart(chartName);
    };

    return (
        <>
            {[...charts].reverse().map((chart: StateDefinition) => (
                <div key={chart.chartName} className="minimised-element" onClick={() => reopenChart(chart.chartName)}>
                    <div id="minimised-element-text" className="minimised-text">
                        {chart.chartName}
                    </div>
                    <div onClick={(e) => removeFunction(e, chart.chartName)} className="minimised-close">
                        ✕
                    </div>
                </div>
            ))}
        </>
    );
};

export default MinimisedChartList;