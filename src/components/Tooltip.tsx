import React from 'react';
import { TooltipProps } from '../types';

const Tooltip: React.FC<TooltipProps> = ({ x, y, content, visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="tooltip"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip;
