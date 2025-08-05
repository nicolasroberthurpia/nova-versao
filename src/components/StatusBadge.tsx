import React from 'react';

interface StatusBadgeProps {
  text: string;
  color: string;
  backgroundColor: string;
  icon: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ text, color, backgroundColor, icon }) => {
  const style: React.CSSProperties = {
    backgroundColor,
    border: `1px solid ${color}`,
    color,
  };

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md" style={style}>
      <span className="material-symbols-rounded text-base" style={{ color }}>
        {icon}
      </span>
      <span className="font-medium text-xs whitespace-nowrap" style={{ color }}>
        {text}
      </span>
    </div>
  );
};

export default StatusBadge;
