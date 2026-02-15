'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { Box } from 'lucide-react';
import * as THREE from 'three';

const DEFAULT_MODEL_URL = '/models/glasses.glb';

function PreviewModel({ 
  url, 
  scale = 100,
  positionX = 0,
  positionY = 0,
  positionZ = 0,
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
}: { 
  url: string;
  scale?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const [autoFitScale, setAutoFitScale] = useState(1);

  // Apply same autofit logic as landing page
  useEffect(() => {
    if (scene) {
      const isDefaultModel = url === DEFAULT_MODEL_URL;
      
      if (isDefaultModel) {
        setAutoFitScale(1);
      } else {
        // Same target size as landing page for custom models
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 8;
        
        if (maxDim > 0) {
          setAutoFitScale(targetSize / maxDim);
        }
      }
    }
  }, [scene, url]);

  // Base scale adjusted for closer camera (z=15) and narrower FOV (25)
  // Narrower FOV reduces distortion but makes objects appear larger
  const baseScale = 4.5;  // Increased from 3.5 to compensate for narrower FOV
  const userScale = (scale / 100) * baseScale * autoFitScale;
  const rxRad = rotationX * (Math.PI / 180);
  // Landing page starts at 90° (Math.PI / 2) on Y axis, flip 180° for preview orientation
  const ryRad = (-Math.PI / 2) + (rotationY * (Math.PI / 180));
  const rzRad = rotationZ * (Math.PI / 180);

  // Gentle idle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = ryRad + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={[
        positionX * 0.12,    // Scale for closer camera
        positionY * -0.3,    // Reduced from 0.08 - glasses need to be lower
        positionZ * 0.015    // Scale for closer camera
      ]} 
      rotation={[rxRad, ryRad, rzRad]}
    >
      <primitive 
        object={scene} 
        scale={[userScale, userScale, userScale]} 
      />
    </group>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
      <Box className="w-8 h-8 mb-1" />
      <span className="text-[9px]">Erreur de chargement</span>
    </div>
  );
}

interface Model3DPreviewProps {
  modelUrl?: string;
  scale?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  className?: string;
}

export default function Model3DPreview({ 
  modelUrl, 
  scale = 100,
  positionX = 0,
  positionY = 0,
  positionZ = 0,
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
  className = '',
}: Model3DPreviewProps) {
  const resolvedUrl = modelUrl && modelUrl.trim() !== '' ? modelUrl : DEFAULT_MODEL_URL;
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(resolvedUrl);

  // Reset error state when URL changes
  useEffect(() => {
    setHasError(false);
    setKey(resolvedUrl);
  }, [resolvedUrl]);

  if (hasError) {
    return (
      <div className={className}>
        <ErrorFallback />
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense fallback={<LoadingFallback />}>
        <ErrorBoundary onError={() => setHasError(true)} key={key}>
          <Canvas
            camera={{ position: [0, 0, 15], fov: 25 }}
            style={{ background: 'transparent' }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={1} />
            <directionalLight position={[3, 3, 3]} intensity={0.5} />
            <Environment preset="studio" />
            <PreviewModel 
              url={resolvedUrl} 
              scale={scale}
              positionX={positionX}
              positionY={positionY}
              positionZ={positionZ}
              rotationX={rotationX}
              rotationY={rotationY}
              rotationZ={rotationZ}
            />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate={false}
            />
          </Canvas>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

// Simple error boundary for catching useGLTF loading errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
