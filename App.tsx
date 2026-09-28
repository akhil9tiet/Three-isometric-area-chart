import React, { useState, useEffect, useMemo } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { processData, getScales } from './utils/dataUtils';
import { COST_OF_LIVING_DATA, STOCK_DATA } from './constants';
import { TooltipData } from './types';

const App: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<'cities' | 'stocks'>('cities');
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [is2D, setIs2D] = useState(false);
  
  // Select dataset based on mode
  const rawData = mode === 'cities' ? COST_OF_LIVING_DATA : STOCK_DATA;

  // Process data and scales when mode changes
  const data = useMemo(() => processData(rawData), [rawData]);
  const scales = useMemo(() => getScales(rawData), [rawData]);
  
  // Handle Wheel Scroll (Desktop)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (is2D) return;
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
  }, [data.length, is2D]);

  // Handle Touch Scroll (Mobile)
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (is2D) return;
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
  }, [data.length, is2D]);

  // Reset navigation when switching datasets.
  useEffect(() => {
    setActiveIndex(0);
  }, [mode]);

  return (
      <div className={`app-shell ${is2D ? 'app-shell--2d' : ''}`}>
        
        {/* Keep both layers mounted so their crossfade and depth animation share one timeline. */}
        <div className="scene-layer">
          <Scene 
            data={data} 
            activeIndex={activeIndex} 
            scales={scales} 
            onTooltip={setTooltipData}
            isExpanded={!is2D}
          />
        </div>

        {/* UI Overlay Layer */}
        <UIOverlay 
          data={data} 
          activeIndex={activeIndex} 
          currentMode={mode}
          onModeChange={setMode}
          tooltip={tooltipData}
          is2D={is2D}
          onViewChange={setIs2D}
        />
        
      </div>
  );
};

export default App;
