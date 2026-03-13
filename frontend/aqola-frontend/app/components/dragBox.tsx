import { Rnd } from 'react-rnd';
import { useState, ReactNode } from 'react';

interface WindowProps {
  children: ReactNode
}

export function Window({children} : WindowProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 600, height: 380 }}
      dragHandleClassName="window-titlebar"
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
        position:'absolute'
      }}
    >
      <div className="window-titlebar">
        <button onClick={() => setVisible(false)}>✕</button>
      </div>
      <div className={'window-content'}>
        {children}
      </div>
    </Rnd>
  );
}