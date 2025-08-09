'use client';

/**
 * 🎯 QUICK POSITIONING CONTROLS:
 * 
 * To position the 3D glasses model, adjust these variables in the Glasses component:
 * - MODEL_POSITION_X: Move right (+) or left (-) - directly controls horizontal position
 * - MODEL_POSITION_Y: Move down (-) or up (+) - directly controls vertical position
 * 
 * 🔄 ROTATION BEHAVIOR:
 * - Initial position: -90° (glasses facing left side)
 * - Final position (after scroll): -270° (glasses facing right side)
 * - Smooth transition between these two states based on scroll progress
 * - Model rotates in place without affecting X/Y positioning
 * 
 * 📐 CONTAINER SIZE:
 * - Now uses full screen container to prevent cropping during rotation
 * - Canvas scales automatically while maintaining aspect ratio
 */

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Enhanced Glasses 3D Model Component with loading states
function Glasses({ onLoad, scrollProgress }: { onLoad?: () => void; scrollProgress?: number }) {
  const { scene } = useGLTF('/models/glasses.glb');
  const meshRef = useRef<THREE.Group>(null);
  
  // ✨ MANUAL POSITION ADJUSTMENT VARIABLES - Easy to modify for centering
  const MODEL_POSITION_X = 0.0; // Move right (+) or left (-)
  const MODEL_POSITION_Y = -8.5; // Move down (-) or up (+)
  
  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  useFrame((state) => {
    if (meshRef.current) {
      // Base position with manual adjustments
      const baseX = MODEL_POSITION_X;
      const baseY = MODEL_POSITION_Y;
      // Subtle floating animation
      const floatingY = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;

      // --- Two-phase animation ---
      // Phase 1: scroll 0-0.5 => rotation only
      // Phase 2: scroll 0.5-1 => camera z only
      let rotationY = Math.PI / 2; // Start at 90 degrees (side view)
      if (scrollProgress !== undefined) {
        const phaseSplit = 0.5;
        const startRotation = - Math.PI / 2; // 90 degrees - initial position
        const endRotation = -(3 * Math.PI) / 2; // 270 degrees - final position
        let phaseProgress = 0;
        if (scrollProgress < phaseSplit) {
          // Only rotation
          phaseProgress = scrollProgress / phaseSplit;
        } else {
          // Rotation done
          phaseProgress = 1;
        }
        const targetRotation = startRotation + (phaseProgress * (endRotation - startRotation));
        rotationY = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetRotation,
          0.15
        );
      } else {
        // Very subtle idle rotation when not scrolling (around 90°)
        rotationY = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.15) * 0.015;
      }
      meshRef.current.position.set(
        baseX,
        baseY + floatingY,
        0
      );
      meshRef.current.rotation.y = rotationY;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive 
        object={scene} 
        scale={[2.0, 2.0, 2.0]} 
        position={[0, 0, 0]} // Position handled by the group
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

// Main GlassesModel Canvas Component
import { MotionValue, useMotionValueEvent } from 'framer-motion';
type GlassesModelProps = {
  scrollProgress?: MotionValue<number>;
  onCameraZChange?: (z: number) => void;
};

const GlassesModel = ({ scrollProgress, onCameraZChange }: GlassesModelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currentScrollProgress, setCurrentScrollProgress] = useState(0);
  const scrollValue = useRef(0);

  // Listen to scroll progress and store in ref and state
  // Use useEffect with proper cleanup to avoid render loops
  useEffect(() => {
    if (!scrollProgress) return;
    
    const unsubscribe = scrollProgress.on('change', (latest: number) => {
      scrollValue.current = latest;
      // Use requestAnimationFrame to defer state update
      requestAnimationFrame(() => {
        setCurrentScrollProgress(latest);
      });
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [scrollProgress]);

  const handleModelLoad = () => {
    setModelLoaded(true);
    // Small delay to ensure smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  // Camera with fixed position for proper centering
  function CameraRig() {
    useFrame(({ camera }) => {
      // Two-phase: 0-0.5 = z=100, 0.5-1 = z=100 to z=0
      const zStart = 100;
      const zEnd = 0;
      const phaseSplit = 0.5;
      let cameraZ = zStart;
      if (currentScrollProgress > phaseSplit) {
        // Remap progress from 0.5-1 to 0-1
        const t = (currentScrollProgress - phaseSplit) / (1 - phaseSplit);
        cameraZ = zStart + (zEnd - zStart) * t;
      }
      camera.position.set(0, 0, cameraZ);
      camera.lookAt(0, 0, 0);
      
      // Notify parent component of camera z change
      if (onCameraZChange) {
        onCameraZChange(cameraZ);
      }
    });
    return null;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Loading skeleton for 3D model */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full border-4 border-gray-200 border-t-black"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Canvas with smooth entrance */}
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: modelLoaded ? 1 : 0, scale: modelLoaded ? 1 : 0.9 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Canvas
          camera={{ 
            position: [0, 0, 35], 
            fov: 35,
            near: 0.1,
            far: 1000 
          }}
          shadows
          style={{ 
            background: 'transparent', 
            width: '100%', 
            height: '100%',
            display: 'block'
          }}
          dpr={[1, 2]}
          resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
        >
          <CameraRig />
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[3, 3, 3]} 
            intensity={0.6} 
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-3, 2, 3]} intensity={0.3} />
          <Environment preset="studio" />
          <Glasses onLoad={handleModelLoad} scrollProgress={currentScrollProgress} />
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.15} 
            scale={6} 
            blur={4} 
            far={3} 
          />
        </Canvas>
      </motion.div>
    </div>
  );
};

// Preload the model
useGLTF.preload('/models/glasses.glb');

export default GlassesModel;
