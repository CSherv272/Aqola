import { useState } from 'react';

export default function DataSelector(){

    const [selectedDataset, setSelectedDataset] = useState('Crime');

    return (
    <div className="data-select-wrapper">
        <label htmlFor="data" className="data-label">Dataset:</label>
        <select 
        name="data" 
        id="data"
        value={selectedDataset}
        onChange={(e) => setSelectedDataset(e.target.value)}
        className="data-select"
        >
        <option value="Crime">Crime</option>
        <option value="Schools">Schools</option>
        <option value="Flood">Flood Risk</option>
        </select>
    </div>
    );

}