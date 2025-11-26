import React, { useState, useEffect, useMemo } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { processData, getScales } from './utils/dataUtils';
import { COST_OF_LIVING_DATA, STOCK_DATA } from './constants';

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mode, setMode] = useState<'cities' | 'stocks'>('cities');
  
  // Select dataset based on mode
  const rawData = mode === 'cities' ? COST_OF_LIVING_DATA : STOCK_DATA;

  // Process data and scales when mode changes
  const data = useMemo(() => processData(rawData), [rawData]);
  const scales = useMemo(() => getScales(rawData), [rawData]);
  
  // Calculate the active index based on scroll
  const activeIndex = scrollProgress * (data.length - 1);

  // Setup Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      
      const totalScrollable = docHeight - winHeight;
      // Clamp between 0 and 1
      const progress = Math.max(0, Math.min(1, scrollTop / totalScrollable));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mode, data.length]); // Re-bind if data length changes significantly (though here mostly stylistic)

  // Reset scroll when switching modes
  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollProgress(0);
  }, [mode]);

  // Increased scroll height per item since charts are bigger and we want a luxurious scroll feel
  const scrollHeight = `${Math.max(100, data.length * 100)}vh`;

  return (
    <>
      {/* The invisible scrollable container */}
      <div style={{ height: scrollHeight, width: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }} />

      {/* The Fixed Viewport */}
      <div className="fixed inset-0 w-full h-full bg-slate-900 overflow-hidden">
        
        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <Scene data={data} activeIndex={activeIndex} scales={scales} />
        </div>

        {/* UI Overlay Layer */}
        <UIOverlay 
          data={data} 
          activeIndex={activeIndex} 
          currentMode={mode}
          onModeChange={setMode}
        />
        
      </div>
    </>
  );
};

export default App;