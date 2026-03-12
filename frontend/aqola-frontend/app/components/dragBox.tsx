import { Rnd } from 'react-rnd';
import { useState } from 'react';

export function Window({ title, children }) {
  const [visible, setVisible] = useState(true);
  
  if (!visible) return null;

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 400, height: 300 }}
    //   minWidth={200}
    //   minHeight={150}
      bounds="parent"
      className="rnd-window"
    >
      {/* Title bar */}
      <div className="window-titlebar">
        <span>{title}</span>
        <button onClick={() => setVisible(false)}>✕</button>
      </div>
      {/* Content */}
      <div className="window-content">
        {children}
      </div>
    </Rnd>
  );
}