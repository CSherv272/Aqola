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
  availableGraphs: getAvailableChart[];
  activeChartId: string;
  triggerChart: (chartId: string) => void;
};

const ChartControls = ({
  availableGraphs,
  activeChartId,
  triggerChart,
}: ChartControlsProps) => {
  // no hook call here anymore
  return (
    <div className="bottom-nav">
      {availableGraphs.map((graph) => (
        <button
          key={graph.id}
          onClick={() => triggerChart(graph.id)}
          className={`nav-button ${activeChartId === graph.id ? "active" : ""}`}
        >
          <i className={graph.icon} />
        </button>
      ))}
    </div>
  );
};

export { ChartControls };
