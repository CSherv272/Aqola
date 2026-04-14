import { useAppStore } from "../store/AppStore2";

export default function DataSelector() {
  // Read the value from Zustand directly — no useState needed
  const selectedDataset = useAppStore((state) => state.selectedDataset);
  const setDataset = useAppStore((state) => state.setDataset);

  const datasetSelector = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        value={selectedDataset ?? "crime"} // Maybe not default to "" ???
        onChange={datasetSelector}
        className="data-select"
      >
        {/* These options should be set from the keys in the datasetConfig json */}
        <option value="crime">Crime</option>
        <option value="schools">Schools</option>
        <option value="flood">Flood Risk</option>
      </select>
    </div>
  );
}
