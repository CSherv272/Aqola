import { useChartOrchestrator } from "../lib/hooks/ChartOrchestrator";

const ChartControls = () => {
  const { availableCharts, activeChartId, triggerChart } = useChartOrchestrator();
  return (
    <div className="bottom-nav">
      {availableCharts.map((chart) => (
        <button
          key={chart.id}
          onClick={() => triggerChart(chart.id)}
          className={`nav-button ${activeChartId === chart.id ? "active" : ""}`}
          title={chart.id}
        >
          <i className={chart.icon} />
        </button>
      ))}
    </div>
  );
};

export { ChartControls };
