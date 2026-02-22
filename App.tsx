import React, { useState, useEffect, useMemo, useRef } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { processData, getScales } from './utils/dataUtils';
import { COST_OF_LIVING_DATA, STOCK_DATA } from './constants';
import { TooltipData } from './types';

const App: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<'cities' | 'stocks'>('cities');
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  
  // Select dataset based on mode
  const rawData = mode === 'cities' ? COST_OF_LIVING_DATA : STOCK_DATA;

  // Process data and scales when mode changes
  const data = useMemo(() => processData(rawData), [rawData]);
  const scales = useMemo(() => getScales(rawData), [rawData]);
  
  // Handle Wheel Scroll (Desktop)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If Ctrl is pressed, let the browser handle it (zoom or vertical page scroll)
      if (e.ctrlKey) return;

      // Otherwise, hijack the scroll for our isometric navigation
      e.preventDefault();
      
      setActiveIndex(prev => {
        // Adjust sensitivity as needed
        const delta = e.deltaY * 0.002;
        return Math.max(0, Math.min(data.length - 1, prev + delta));
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [data.length]);

  // Handle Touch Scroll (Mobile)
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // We prevent default to stop page scrolling and handle series navigation
      if (e.cancelable) e.preventDefault();

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      setActiveIndex(prev => {
        const delta = deltaY * 0.005;
        return Math.max(0, Math.min(data.length - 1, prev + delta));
      });
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [data.length]);

  // Reset scroll when switching modes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveIndex(0);
  }, [mode]);

  // Keep the scroll height for the "page scroll" feeling if user Ctrl+Scrolls
  const scrollHeight = `${Math.max(100, data.length * 100)}vh`;

  return (
    <>
      {/* The invisible scrollable container - kept for Ctrl+Scroll context */}
      <div style={{ height: scrollHeight, width: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }} />

      {/* The Fixed Viewport */}
      <div className="fixed inset-0 w-full h-full bg-slate-900 overflow-hidden touch-pan-y">
        
        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0 touch-pan-y">
          <Scene 
            data={data} 
            activeIndex={activeIndex} 
            scales={scales} 
            onTooltip={setTooltipData}
          />
        </div>

        {/* UI Overlay Layer */}
        <UIOverlay 
          data={data} 
          activeIndex={activeIndex} 
          currentMode={mode}
          onModeChange={setMode}
          tooltip={tooltipData}
        />
        
      </div>
    </>
  );
};

export default App;