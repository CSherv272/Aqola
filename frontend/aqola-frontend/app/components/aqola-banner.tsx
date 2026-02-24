"use client";

interface BannerProps {
  lineGraphTrigger: () => void;
  barGraphTrigger: () => void;
  apiTrigger: () => void;
}

export default function Banner({
  lineGraphTrigger,
  barGraphTrigger,
  apiTrigger
}: BannerProps
) {
  // const test = () => {
  //     console.log("hi");
  // };

  return (
    <div className="flex items-center justify-center bg-gray-800">
      {/* <button onClick={test} className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950">Docs</button> */}
      <img src="/koala-no-bckgr.png" className="h-[200px] m-0 p-0" />
      <button
        onClick={lineGraphTrigger}
        className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950"
      >
        Line Graph
      </button>

      <button
        onClick={barGraphTrigger}
        className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950"
      >
        Bar Graph
      </button>
      <button
        onClick={apiTrigger}
        className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950"
      >
        Contact API 2
      </button>
    </div>
  );
}
