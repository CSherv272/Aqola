import { useAppStore } from "../../store/AppStore";

const MinimisedChartList = () => {
    const charts = useAppStore((state) => state.minimisedCharts);
    const reopenChart = useAppStore((state) => state.reopenMinimisedChart);
    const removeChart = useAppStore((state) => state.removeMinimisedChart);

    return (
        <>
            {[...charts].reverse().map((chart: any) => (
                <div key={chart.chartName} className="minimised-element" onClick={() => reopenChart(chart.chartName)}>
                    <div id="minimised-element-text" style={{ flex: 1, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {chart.chartName}
                    </div>
                    <div onClick={() => removeChart(chart.chartName)} className="minimised-close">
                        ✕
                    </div>
                </div>
            ))}
        </>
    );
};

export default MinimisedChartList;