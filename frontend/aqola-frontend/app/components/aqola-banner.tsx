"use client";

import { ChartType } from "../lib/frontend_models";

type Props = {
  onChartSelect: (type: ChartType) => Promise<void>;
};

export default function Banner({ onChartSelect }: Props) {
  return (
    <div className="flex items-center justify-center bg-gray-800 flex-shrink-0">
      {/* <button onClick={test} className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950">Docs</button> */}
      <img src="/koala-no-bckgr.png" className="h-[200px] m-0 p-0" />
      <button
        onClick={() => onChartSelect("line_over_time")}
        className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950"
      >
        Crime By Type
      </button>

      <button
        onClick={() => onChartSelect("bar_frequency")}
        className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950"
      >
        Kent Crime Count
      </button>
      <button
        onClick={() => onChartSelect("line_over_time_by_lsoa")}
        className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950"
      >
        Crime By LSOA
      </button>
    </div>
  );
}
