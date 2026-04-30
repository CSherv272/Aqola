import { Rnd } from 'react-rnd';
import { useState, ReactNode, memo } from 'react';

interface WindowProps {
  children: ReactNode
  closeChart: (chartId: string) => void;
  activeChartId: string;
  focusChart?: (chartId: string) => void;
  minimiseChart?: (chartId: string) => void;
  zIndex: number;
}

const Window = ({ children, closeChart, focusChart, minimiseChart, activeChartId, zIndex  }: WindowProps) => {

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 600, height: 380 }}
      bounds="parent"
      style={{ zIndex: zIndex }}
      className="rnd-window"
      onMouseDown={() => focusChart && focusChart(activeChartId)} // For focusing element on click
    >
      {/* Top bar of the window, includes close button */}
      <div className="window-titlebar">
        <button onClick={() => minimiseChart && minimiseChart(activeChartId)}> - </button>
        <button onClick={() => closeChart(activeChartId)}> ✕ </button>
      </div>

      {/* Window contents */}
      <div className="window-content"> { children } </div>
    </Rnd>
  );
};

export { Window };