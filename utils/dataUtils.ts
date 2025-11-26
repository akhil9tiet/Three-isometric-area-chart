import * as d3 from 'd3';
import { CitySeries, DataPoint } from '../types';
import { COLORS } from '../constants';

export const processData = (data: DataPoint[]): CitySeries[] => {
  // Group by city
  const groups = d3.group(data, (d) => d.city);
  
  const series: CitySeries[] = [];
  let colorIndex = 0;

  groups.forEach((values, city) => {
    // Sort by year to ensure correct line drawing
    const sortedData = values.sort((a, b) => a.year - b.year)
      .map(d => ({ year: d.year, value: d.value }));

    series.push({
      city,
      data: sortedData,
      color: COLORS[colorIndex % COLORS.length]
    });
    colorIndex++;
  });

  return series;
};

// Dimensions for the 3D chart visualization
export const CHART_CONFIG = {
  width: 14,  // Increased width
  height: 8,  // Increased height
  depthGap: 3.5, // Increased gap
  extrusionDepth: 0.3 // Increased thickness
};

export const getScales = (data: DataPoint[]) => {
  const xDomain = d3.extent(data, (d) => d.year) as [number, number];
  // Calculate max value but ensure a minimum height
  const maxVal = d3.max(data, (d) => d.value) || 100;
  const yDomain = [0, maxVal * 1.1] as [number, number]; // Add 10% padding

  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([-CHART_CONFIG.width / 2, CHART_CONFIG.width / 2]);

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([0, CHART_CONFIG.height]);

  return { xScale, yScale, xDomain, yDomain };
};