import { useAppStore } from "../store/appStore";

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
        value={selectedDataset ?? ""} // Maybe not default to "" ???
        onChange={datasetSelector}
        className="data-select"
      >
        {/* These options should be set from the keys in the datasetConfig json */}
        <option value="Crime">Crime</option>
        <option value="Schools">Schools</option>
        <option value="Flood">Flood Risk</option>
      </select>
    </div>
  );
}
