import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Environment, Grid } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import CityChart from './CityChart';
import { CitySeries } from '../types';
import { CHART_CONFIG } from '../utils/dataUtils';

interface SceneProps {
  data: CitySeries[];
  activeIndex: number;
  scales: {
    xScale: any;
    yScale: any;
    xDomain: [number, number];
    yDomain: [number, number];
  };
}

const AnimatedGroup: React.FC<{ 
  data: CitySeries[]; 
  activeIndex: number;
  scales: SceneProps['scales'];
}> = ({ data, activeIndex, scales }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Calculate target Z position.
      const targetZ = -activeIndex * CHART_CONFIG.depthGap;
      
      // We use a lower lerp factor to make the movement feel "heavier" and smoother
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        2 * delta
      );
    }
  });

  return (
    <group ref={groupRef}>
      {data.map((series, index) => (
        <CityChart
          key={series.city}
          series={series}
          positionZ={index * CHART_CONFIG.depthGap}
          isActive={Math.abs(activeIndex - index) < 0.5}
          xScale={scales.xScale}
          yScale={scales.yScale}
          xDomain={scales.xDomain}
        />
      ))}
    </group>
  );
};

const Scene: React.FC<SceneProps> = ({ data, activeIndex, scales }) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      {/* Isometric Camera View */}
      <OrthographicCamera
        makeDefault
        position={[20, 12, 20]}
        zoom={55}
        near={-50}
        far={200}
        onUpdate={(c) => c.lookAt(0, 3, 0)}
      />

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

      <AnimatedGroup data={data} activeIndex={activeIndex} scales={scales} />
      
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
      <Grid 
        position={[0, -0.1, 0]} 
        args={[40, 100]} 
        cellColor="#1e293b" 
        sectionColor="#334155" 
        fadeDistance={60}
        infiniteGrid
      />
    </Canvas>
  );
};

export default Scene;