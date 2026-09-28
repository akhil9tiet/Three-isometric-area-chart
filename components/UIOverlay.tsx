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
}

const UIOverlay: React.FC<UIOverlayProps> = ({ data, activeIndex, currentMode, onModeChange, tooltip, is2D, onViewChange }) => {
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
