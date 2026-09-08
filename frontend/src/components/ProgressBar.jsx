import React from 'react';

const ProgressBar = ({ percentage = 0, showLabel = true, height = 10, color }) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track" style={{ height: `${height}px` }}>
        <div 
          className="progress-bar-fill"
          style={{ width: `${safePercentage}%`, ...(color ? { backgroundColor: color } : {}) }}
        />
      </div>
      {showLabel && (
        <div className="progress-bar-label">
          <span>{safePercentage}% Completed</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
