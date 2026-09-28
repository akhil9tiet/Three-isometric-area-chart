import React, { useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Environment, Grid, Line, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import CityChart from './CityChart';
import { CitySeries, TooltipData } from '../types';
import { CHART_CONFIG } from '../utils/dataUtils';

const ISOMETRIC_CAMERA_POSITION = new THREE.Vector3(20, 16, 20);
const FRONT_CAMERA_TARGET = new THREE.Vector3(-0.4, CHART_CONFIG.height / 2 - 0.35, 0);
const FRONT_CAMERA_POSITION = new THREE.Vector3(FRONT_CAMERA_TARGET.x, FRONT_CAMERA_TARGET.y, 32);

interface SceneProps {
  data: CitySeries[];
  activeIndex: number;
  scales: {
    xScale: any;
    yScale: any;
    xDomain: [number, number];
    yDomain: [number, number];
  };
  onTooltip: (data: TooltipData | null) => void;
  isExpanded: boolean;
}

const AnimatedGroup: React.FC<{ 
  data: CitySeries[]; 
  activeIndex: number;
  scales: SceneProps['scales'];
  onTooltip: (data: TooltipData | null) => void;
  isExpanded: boolean;
}> = ({ data, activeIndex, scales, onTooltip, isExpanded }) => {
  const groupRef = useRef<THREE.Group>(null);
  const spread = useRef(isExpanded ? 1 : 0);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      spread.current = THREE.MathUtils.damp(spread.current, isExpanded ? 1 : 0, 2.8, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        -activeIndex * CHART_CONFIG.depthGap * spread.current,
        3.5,
        delta
      );
    }
  });

  return (
    <group ref={groupRef}>
      {data.map((series, index) => (
        <BurstLayer key={series.city} index={index} isExpanded={isExpanded}>
          <CityChart
            series={series}
            positionZ={0}
            is2D={!isExpanded}
            isActive={Math.abs(activeIndex - index) < 0.5}
            xScale={scales.xScale}
            yScale={scales.yScale}
            xDomain={scales.xDomain}
            onTooltip={onTooltip}
          />
        </BurstLayer>
      ))}
    </group>
  );
};

const BurstLayer: React.FC<{ index: number; isExpanded: boolean; children: React.ReactNode }> = ({ index, isExpanded, children }) => {
  const layerRef = useRef<THREE.Group>(null);
  const collapsedZ = index * 0.012;
  const initialZ = useRef(isExpanded ? index * CHART_CONFIG.depthGap : collapsedZ);

  useLayoutEffect(() => {
    if (layerRef.current) layerRef.current.position.z = initialZ.current;
  }, []);

  useFrame((_, delta) => {
    if (layerRef.current) {
      const targetZ = isExpanded ? index * CHART_CONFIG.depthGap : collapsedZ;
      layerRef.current.position.z = THREE.MathUtils.damp(layerRef.current.position.z, targetZ, 3.2, delta);
    }
  });

  return <group ref={layerRef}>{children}</group>;
};

const AnimatedCamera: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;

    const target = isExpanded ? ISOMETRIC_CAMERA_POSITION : FRONT_CAMERA_POSITION;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.x, 3.1, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.y, 3.1, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.z, 3.1, delta);
    const targetZoom = isExpanded ? 55 : 67;
    const nextZoom = THREE.MathUtils.damp(camera.zoom, targetZoom, 3.1, delta);
    if (Math.abs(nextZoom - camera.zoom) > 0.001) {
      camera.zoom = nextZoom;
      camera.updateProjectionMatrix();
    }
    lookTarget.current.x = THREE.MathUtils.damp(lookTarget.current.x, isExpanded ? 0 : FRONT_CAMERA_TARGET.x, 3.1, delta);
    lookTarget.current.y = THREE.MathUtils.damp(lookTarget.current.y, isExpanded ? 0 : FRONT_CAMERA_TARGET.y, 3.1, delta);
    camera.up.set(0, 1, 0);
    camera.lookAt(lookTarget.current);
  });

  return <OrthographicCamera
    ref={cameraRef}
    makeDefault
    position={[20, 16, 20]}
    zoom={55}
    near={-50}
    far={200}
  />;
};

const Scene: React.FC<SceneProps> = ({ data, activeIndex, scales, onTooltip, isExpanded }) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <AnimatedCamera isExpanded={isExpanded} />

      <color attach="background" args={['#0f172a']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={0.8} 
        castShadow 
      />
      <pointLight position={[-10, 5, 10]} intensity={0.5} color="#ffffff" />

      {/* Environment reflections */}
      <Environment preset="city" />

      <AnimatedGroup 
        data={data} 
        activeIndex={activeIndex} 
        scales={scales} 
        onTooltip={onTooltip} 
        isExpanded={isExpanded}
      />

      {!isExpanded && <FrontAxes scales={scales} />}
      
      {/* Post Processing for Glow */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={1.2}
          mipmapBlur 
          intensity={1.0}
          radius={0.6}
        />
      </EffectComposer>

      {/* Floor Grid */}
      {isExpanded && <Grid
        position={[0, -0.1, 0]} 
        args={[40, 100]} 
        cellColor="#1e293b" 
        sectionColor="#334155" 
        fadeDistance={60}
        infiniteGrid
      />}
    </Canvas>
  );
};

const FrontAxes: React.FC<{ scales: SceneProps['scales'] }> = ({ scales }) => {
  const xStart = scales.xDomain[0];
  const xEnd = scales.xDomain[1];
  const yMax = scales.yDomain[1];
  const xTicks = scales.xScale.ticks(6) as number[];
  const yTicks = scales.yScale.ticks(5) as number[];
  const left = scales.xScale(xStart);
  const right = scales.xScale(xEnd);
  const baseline = scales.yScale(0);
  const front = 0.8;

  return <group>
    {yTicks.map(value => <group key={`y-${value}`}>
      <Line points={[[left, scales.yScale(value), front], [right, scales.yScale(value), front]]} color={value === 0 ? '#8b9ab0' : '#344258'} lineWidth={value === 0 ? 1.4 : 0.8} />
      <Text position={[left - 0.28, scales.yScale(value), front]} fontSize={0.22} color="#a3b0c2" anchorX="right" anchorY="middle">{value}</Text>
    </group>)}
    {xTicks.map(year => <group key={`x-${year}`}>
      <Line points={[[scales.xScale(year), baseline, front], [scales.xScale(year), baseline - 0.12, front]]} color="#8b9ab0" lineWidth={1} />
      <Text position={[scales.xScale(year), baseline - 0.36, front]} fontSize={0.22} color="#a3b0c2" anchorX="center" anchorY="top">{year}</Text>
    </group>)}
    <Line points={[[left, baseline, front], [left, scales.yScale(yMax), front]]} color="#8b9ab0" lineWidth={1.4} />
    <Text position={[(left + right) / 2, baseline - 0.7, front]} fontSize={0.25} color="#c0cada" anchorX="center" anchorY="middle">Year</Text>
    <Text position={[left - 0.78, scales.yScale(yMax) / 2, front]} rotation={[0, 0, Math.PI / 2]} fontSize={0.25} color="#c0cada" anchorX="center" anchorY="middle">Value</Text>
  </group>;
};

export default Scene;
