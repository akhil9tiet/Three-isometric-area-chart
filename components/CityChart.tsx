import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { CitySeries, TooltipData } from '../types';
import { CHART_CONFIG } from '../utils/dataUtils';
import * as d3 from 'd3';

interface CityChartProps {
  series: CitySeries;
  positionZ: number;
  isActive: boolean;
  xScale: any;
  yScale: any;
  xDomain: [number, number];
  onTooltip: (data: TooltipData | null) => void;
}

const CityChart: React.FC<CityChartProps> = ({ series, positionZ, isActive, xScale, yScale, xDomain, onTooltip }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  // Entrance Animation
  useEffect(() => {
    setProgress(0);
  }, [series]);

  useFrame((state, delta) => {
    if (progress < 1) {
      // Animate progress from 0 to 1
      setProgress(prev => Math.min(prev + delta * 1.5, 1));
    }
    
    if (meshRef.current) {
      // Cubic bezier ease out
      const scaleY = d3.easeCubicOut(progress);
      meshRef.current.scale.set(1, scaleY, 1);
    }
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Start at bottom-left
    const firstPoint = series.data[0];
    const startX = xScale(firstPoint.year);
    const startY = yScale(firstPoint.value);

    // Move to start point on baseline
    shape.moveTo(startX, 0);
    // Line up to the first data point
    shape.lineTo(startX, startY);

    // Collect all points for the spline
    const points = series.data.map(d => new THREE.Vector2(xScale(d.year), yScale(d.value)));
    
    // Use splineThru to create a smooth curve through the points
    if (points.length > 1) {
      shape.splineThru(points.slice(1));
    }

    // Draw down to bottom-right
    const lastPoint = series.data[series.data.length - 1];
    shape.lineTo(xScale(lastPoint.year), 0);

    // Close shape back to start
    shape.closePath();

    const extrudeSettings = {
      depth: CHART_CONFIG.extrusionDepth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 4,
      steps: 2,
      curveSegments: 32
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [series.data, xScale, yScale]);

  // Generate tick markers based on domain
  const ticks = useMemo(() => {
    const [start, end] = xDomain;
    const ticks = [];
    // Just pick 4 evenly spaced years or specific ones
    const step = Math.ceil((end - start) / 4);
    for (let y = start; y <= end; y += step) {
      ticks.push(y);
    }
    // Always include end year if missed
    if (ticks[ticks.length - 1] !== end) ticks.push(end);
    return [...new Set(ticks)]; // unique
  }, [xDomain]);

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    // Get the intersection point in local coordinates
    // However, the mesh is scaled, so we need to be careful.
    // The event point is in world coordinates.
    // We can use the world point.
    
    // Convert world X to year
    // The chart is centered at x=0 (via xScale range)
    // xScale maps year -> x
    // So we can invert: year = xScale.invert(x)
    
    // Since the group is at positionZ, and the camera is isometric,
    // the x coordinate of the intersection point should be correct relative to the world origin.
    // The group position is [0, 0, positionZ].
    
    const worldX = e.point.x;
    const year = Math.round(xScale.invert(worldX));
    
    // Find the closest data point
    const dataPoint = series.data.reduce((prev, curr) => {
      return (Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev);
    });

    onTooltip({
      x: e.clientX,
      y: e.clientY,
      value: dataPoint.value,
      year: dataPoint.year,
      city: series.city,
      visible: true
    });
  };

  const handlePointerOut = () => {
    onTooltip(null);
  };

  return (
    <group position={[0, 0, positionZ]}>
      {/* The Area Chart Mesh */}
      <mesh 
        ref={meshRef}
        geometry={geometry}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <meshPhysicalMaterial
          color={series.color}
          transparent={true}
          opacity={0.6}
          metalness={0.1}
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive={series.color}
          emissiveIntensity={isActive ? 2.5 : 0.0}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grid line at the bottom for reference */}
      <mesh position={[0, -0.05, CHART_CONFIG.extrusionDepth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CHART_CONFIG.width + 4, 0.1]} />
        <meshBasicMaterial color="#334155" opacity={0.3} transparent />
      </mesh>

      {/* City/Company Label floating in 3D space */}
      <Text
        position={[-CHART_CONFIG.width / 2 - 1.5, 1, 0]}
        rotation={[0, Math.PI / 6, 0]}
        fontSize={0.8}
        color={isActive ? "white" : "#64748b"}
        anchorX="right"
        anchorY="middle"
        outlineWidth={isActive ? 0.05 : 0}
        outlineColor={series.color}
      >
        {series.city}
      </Text>
      
      {/* Year markers on the chart floor */}
      {isActive && (
        <group position={[0, -0.5, CHART_CONFIG.extrusionDepth]}>
          {ticks.map(year => (
            <Text
              key={year}
              position={[xScale(year), 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.3}
              color="#cbd5e1"
              anchorX="center"
              anchorY="top"
            >
              {year}
            </Text>
          ))}
        </group>
      )}
    </group>
  );
};

export default CityChart;