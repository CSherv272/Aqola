type getAvailableChart = {
  id: string;
  label: string;
  chartComponent: string;
  dataset: string;
  apiCall: string;
  icon: string;
};

// ChartControls.tsx
type ChartControlsProps = {
  availableCharts: getAvailableChart[];
  activeChartId: string;
  triggerChart: (chartId: string) => void;
};

const ChartControls = ({
  availableCharts,
  activeChartId,
  triggerChart,
}: ChartControlsProps) => {
  // no hook call here anymore
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
          {/* <title>{chart.id}</title> */}
        </button>
      ))}
    </div>
  );
};

export { ChartControls };
