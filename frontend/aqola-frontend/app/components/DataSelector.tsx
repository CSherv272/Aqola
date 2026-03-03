import { useAppStore } from "../store/appStore";

export default function DataSelector() {
  // Read the value from Zustand directly — no useState needed
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const setDataset = useAppStore((state) => state.setDataset);

  const datasetSelector = (e) => {
    console.log("Setting dataset to -> " + e.target.value);
    setDataset(e.target.value);
  };

  return (
    <div className="data-select-wrapper">
      <label htmlFor="data" className="data-label">
        Dataset:
      </label>
      <select
        name="data"
        id="data"
        value={selectedDataset}
        onChange={datasetSelector}
        className="data-select"
      >
        <option value="Crime">Crime</option>
        <option value="Schools">Schools</option>
        <option value="Flood">Flood Risk</option>
      </select>
    </div>
  );
}
