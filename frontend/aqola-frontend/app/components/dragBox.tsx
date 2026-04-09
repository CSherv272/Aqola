import { Rnd } from 'react-rnd';
import { useState, ReactNode } from 'react';

interface WindowProps {
  children: ReactNode
  triggerChart: (chartId: string) => void;
  activeChartId: string;
}

export function Window({ children, triggerChart, activeChartId }: WindowProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 600, height: 380 }}
      bounds="parent"
      style={{
        zIndex: 1500,
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
    >
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
        <button onClick={() => triggerChart(activeChartId)} style={{
          background: "none", border: "none", color: "white", 
          cursor: "pointer", fontSize: "16px"
        }}>✕</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", zIndex: 2000, width:"99%", height:"95%", marginTop: "5%", position: "absolute" }}>
        {children}
      </div>
    </Rnd>
  );
}