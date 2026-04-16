import { Rnd } from 'react-rnd';
import { useState, ReactNode, memo } from 'react';

interface WindowProps {
  children: ReactNode
  closeChart: (chartId: string) => void;
  activeChartId: string;
  focusChart?: (chartId: string) => void;
  zIndex: number;
}

const Window = ({ children, closeChart, focusChart, activeChartId, zIndex  }: WindowProps) => {

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 600, height: 380 }}
      bounds="parent"
      style={{
        zIndex: zIndex,
        display: "flex",
        flexDirection: "column",
        background: "rgba(15, 30, 40, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
        width: "100%",
        height: "100%"
      }}
      onMouseDown={() => focusChart && focusChart(activeChartId)} // For focusing element on click
    >
      {/* Top bar of the window, includes close button */}
      <div style={{ 
        flexShrink: 0, 
        height: "36px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "flex-end",
        padding: "0 8px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        cursor: "grab",
        width: "100%",
        }}>
        <button
          onClick={() => closeChart(activeChartId)} 
          style={{
            background: "none",
            border: "none",
            color: "white", 
            cursor: "pointer", 
            fontSize: "16px" 
          }}
        >
          ✕
        </button>
      </div>
      {/* Window contents */}
      <div 
        style={{ 
          flex: 1, 
          overflow: "auto", 
          zIndex: 2000, 
          width:"99%", 
          height:"95%", 
          marginTop: "5%", 
          position: "absolute" 
        }}
      >
        {children}
      </div>
    </Rnd>
  );
};

export { Window };