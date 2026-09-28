import React from 'react';
import { CitySeries, TooltipData } from '../types';

interface UIOverlayProps {
  data: CitySeries[];
  activeIndex: number;
  currentMode: 'cities' | 'stocks';
  onModeChange: (mode: 'cities' | 'stocks') => void;
  tooltip: TooltipData | null;
  is2D: boolean;
  onViewChange: (is2D: boolean) => void;
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ data, activeIndex, currentMode, onModeChange, tooltip, is2D, onViewChange, theme, onThemeChange }) => {
  const isCities = currentMode === 'cities';

  return (
    <div className="ui-overlay">
      <header className="app-header">
        <div className="heading-group">
          <div className="eyebrow">Interactive data atlas</div>
          <h1>{isCities ? 'Cost of living' : 'Technology stocks'}</h1>
        </div>
        <div className="header-controls">
          <div className="segmented-control" aria-label="Choose dataset">
            <button className={isCities ? 'selected' : ''} onClick={() => onModeChange('cities')}>Cities</button>
            <button className={!isCities ? 'selected' : ''} onClick={() => onModeChange('stocks')}>Stocks</button>
          </div>
          <label className="view-toggle">
            <span>2D view</span>
            <button type="button" role="switch" aria-checked={is2D} aria-label="Toggle 2D chart view" className={`switch ${is2D ? 'switch--on' : ''}`} onClick={() => onViewChange(!is2D)}>
              <span />
            </button>
          </label>
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.6" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.6 8.6 0 1 0 20.2 15.2Z" /></svg>
            )}
          </button>
        </div>
      </header>
      <aside className={`series-rail ${is2D ? 'series-rail--legend' : ''}`} aria-label={is2D ? 'Chart legend' : 'Series navigation'}>
        {data.map((item, index) => {
          const isActive = is2D || Math.abs(activeIndex - index) < 0.5;
          return <div className={`series-item ${isActive ? 'series-item--active' : ''}`} key={item.city}>
            <span>{item.city}</span><i style={{ backgroundColor: isActive ? item.color : undefined }} />
          </div>;
        })}
      </aside>
      {is2D && tooltip?.visible && <div className="chart-tooltip" style={{ left: tooltip.x, top: tooltip.y }}><strong>{tooltip.city}</strong><span>{tooltip.year} / {tooltip.value.toLocaleString()}</span></div>}
    </div>
  );
};

export default UIOverlay;
