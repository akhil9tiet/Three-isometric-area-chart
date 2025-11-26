import React from 'react';
import { CitySeries } from '../types';

interface UIOverlayProps {
  data: CitySeries[];
  activeIndex: number;
  currentMode: 'cities' | 'stocks';
  onModeChange: (mode: 'cities' | 'stocks') => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ data, activeIndex, currentMode, onModeChange }) => {
  const isCities = currentMode === 'cities';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      {/* Header and Nav */}
      <div className="flex flex-col gap-6 max-w-md pointer-events-auto">
        <div className="flex gap-2">
          <button 
            onClick={() => onModeChange('cities')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
              isCities 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Cost of Living
          </button>
          <button 
            onClick={() => onModeChange('stocks')}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
              !isCities 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Tech Stocks
          </button>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg">
            {isCities ? 'Cost of Living Index' : 'Tech Stock Growth'}
          </h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">
            {isCities ? 'Historical Trends (1970 - 2025)' : 'Market Price (2016 - 2024)'}
          </p>
          <p className="text-slate-500 text-xs mt-2 max-w-xs">
            {isCities 
              ? 'Scroll to explore city data history across the US.' 
              : 'Scroll to view stock price performance for major tech companies.'}
          </p>
        </div>
      </div>

      {/* Right Indicator Sidebar */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-end pointer-events-auto">
        {data.map((item, index) => {
          // Determine visual state based on proximity to active index
          const distance = Math.abs(activeIndex - index);
          const isActive = distance < 0.5;
          
          return (
            <div 
              key={item.city} 
              className={`flex items-center gap-4 transition-all duration-300 ${
                isActive ? 'scale-110 translate-x-0' : 'translate-x-4 opacity-50'
              }`}
            >
              <span 
                className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              >
                {item.city}
              </span>
              <div 
                className={`h-2 transition-all duration-300 rounded-full shadow-lg ${
                  isActive ? 'w-12' : 'w-4'
                }`}
                style={{ 
                  backgroundColor: isActive ? item.color : '#334155',
                  boxShadow: isActive ? `0 0 10px ${item.color}` : 'none'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Footer / Legend */}
      <div className="text-slate-500 text-xs">
        <p>Data Source: {isCities ? 'Historical Index Analysis' : 'Split-Adjusted Market Close'}</p>
        <p>Visualization: WebGL / React Three Fiber</p>
      </div>
    </div>
  );
};

export default UIOverlay;