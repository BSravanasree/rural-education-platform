import React, { createContext, useContext, useState, useEffect } from 'react';

const LowBandwidthContext = createContext();

export const LowBandwidthProvider = ({ children }) => {
  const [isLowBandwidth, setIsLowBandwidth] = useState(() => {
    const saved = localStorage.getItem('app_low_bandwidth');
    return saved ? JSON.parse(saved) : true; // Default ON for rural optimization
  });

  useEffect(() => {
    localStorage.setItem('app_low_bandwidth', JSON.stringify(isLowBandwidth));
  }, [isLowBandwidth]);

  const toggleLowBandwidth = () => setIsLowBandwidth(prev => !prev);

  return (
    <LowBandwidthContext.Provider value={{ isLowBandwidth, toggleLowBandwidth, setIsLowBandwidth }}>
      {children}
    </LowBandwidthContext.Provider>
  );
};

export const useLowBandwidth = () => useContext(LowBandwidthContext);
