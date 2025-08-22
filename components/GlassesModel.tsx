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

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Enhanced Glasses 3D Model Component with loading states and responsive scaling
function Glasses({ onLoad, scrollProgress }: { onLoad?: () => void; scrollProgress?: number }) {
  const { scene } = useGLTF('/models/glasses.glb');
  const meshRef = useRef<THREE.Group>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });
  
  const MODEL_POSITION_X = 0.0; // Keep X centered
  
  // ✨ RESPONSIVE POSITION SYSTEM - Memoized for performance with mobile optimizations
  const responsivePositions = useMemo(() => {
    const width = viewportSize.width;
    const height = viewportSize.height;
    
        // Y Position: Adjust based on screen size with better mobile positioning
    let modelY;
    if (width <= 375) {
      modelY = -5.0;  // iPhone: higher position for smaller model
    } else if (width <= 414) {
      modelY = -5.5;  // iPhone Plus/Pro: slightly lower
    } else if (width <= 640) {
      modelY = -6.0;  // Mobile: balanced position
    } else if (width <= 768) {
      modelY = -7.0;  // Small tablet: balanced
    } else if (width <= 1024) {
      modelY = -7.5;  // Tablet: good balance
    } else if (width <= 1200) {
      modelY = -8.0;  // Small desktop: lower for better text alignment
    } else if (width <= 1550) {
      modelY = -8.5;  // Medium desktop: perfect for MacBook M3
    } else {
      modelY = -9.0;  // Large desktop: lowest for best proportions
    }
    
    // Camera Z positions adjusted for much smaller iPhone models
    let cameraZStart, cameraZEnd;
    if (width <= 375) {
      cameraZStart = 60;   // iPhone: much closer for very small model
      cameraZEnd = -40;    // Far back for disappearance
    } else if (width <= 414) {
      cameraZStart = 65;   // iPhone Plus: slightly further
      cameraZEnd = -45;    
    } else if (width <= 640) {
      cameraZStart = 70;   // Mobile: closer for smaller model visibility
      cameraZEnd = -50;    // Far back for disappearance
    } else if (width <= 1024) {
      cameraZStart = 90;   // Tablet: balanced distance
      cameraZEnd = -60;    // Far back
    } else if (width <= 1550) {
      cameraZStart = 100;  // Desktop: your perfect setup
      cameraZEnd = -80;    // Far back to ensure complete disappearance
    } else {
      cameraZStart = 110;  // Large desktop: further back for grand effect
      cameraZEnd = -100;   // Very far back for large screens
    }
    
    // Phase timing that matches text exit timing per screen size
    let rotationPhaseEnd, cameraPhaseStart;
    if (width <= 640) {
      rotationPhaseEnd = 0.6;
      cameraPhaseStart = 0.6;
    } else if (width <= 1024) {
      rotationPhaseEnd = 0.7;
      cameraPhaseStart = 0.7;
    } else if (width <= 1550) {
      rotationPhaseEnd = 0.75;
      cameraPhaseStart = 0.75;
    } else {
      rotationPhaseEnd = 0.8;
      cameraPhaseStart = 0.8;
    }
    
    return { modelY, cameraZStart, cameraZEnd, rotationPhaseEnd, cameraPhaseStart };
  }, [viewportSize.width, viewportSize.height]);

  const { modelY, cameraZStart, cameraZEnd, rotationPhaseEnd, cameraPhaseStart } = responsivePositions;
  
  // 📱 RESPONSIVE SCALE CALCULATION
  // Scale the model based on viewport width, with significantly reduced iPhone sizes
  const getResponsiveScale = () => {
    const width = viewportSize.width;
    
    if (width <= 375) return 0.7;      // iPhone: much smaller for better mobile layout
    if (width <= 414) return 0.8;      // iPhone Plus/Pro: slightly bigger but still compact
    if (width <= 640) return 0.95;     // Mobile: reduced size for better balance
    if (width <= 768) return 1.3;      // Small tablet: proportional reduction
    if (width <= 1024) return 1.8;     // Tablet: more prominent model
    if (width <= 1200) return 2.0;     // Small desktop: good balance
    if (width <= 1550) return 2.2;     // Medium desktop: perfect for MacBook M3 range
    return Math.min(2.8, 1.8 + (width - 1550) / 1500); // Large desktop: even bigger, better cap
  };
  
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    // Initial size
    updateSize();
    
    // Listen for resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  useFrame((state) => {
    if (meshRef.current) {
      // Base position with responsive adjustments
      const baseX = MODEL_POSITION_X;
      const baseY = modelY;
      
      // Responsive floating animation - less intense on smaller screens
      const floatingIntensity = viewportSize.width <= 768 ? 0.04 : 0.08;
      const floatingY = Math.sin(state.clock.elapsedTime * 0.6) * floatingIntensity;

      // --- SYNCHRONIZED two-phase animation with responsive timing ---
      let rotationY = Math.PI / 2; // Start at 90 degrees (side view)
      if (scrollProgress !== undefined) {
        // Clamp scroll progress to prevent flipping back
        const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
        
        // RESPONSIVE TIMING based on screen size to match text exit timing
        let rotationPhaseEnd, cameraPhaseStart;
        if (viewportSize.width <= 640) {
          // Mobile: faster text exit, shorter phases
          rotationPhaseEnd = 0.6;
          cameraPhaseStart = 0.6;
        } else if (viewportSize.width <= 1024) {
          // Tablet: balanced timing
          rotationPhaseEnd = 0.7;
          cameraPhaseStart = 0.7;
        } else if (viewportSize.width <= 1550) {
          // Desktop: slower text exit, longer phases
          rotationPhaseEnd = 0.75;
          cameraPhaseStart = 0.75;
        } else {
          // Large desktop: text takes longest to exit, extended phases
          rotationPhaseEnd = 0.8;
          cameraPhaseStart = 0.8;
        }
        
        const startRotation = - Math.PI / 2; // 90 degrees - initial position
        const endRotation = -(3 * Math.PI) / 2; // 270 degrees - final position
        
        let rotationProgress = 0;
        if (clampedProgress <= rotationPhaseEnd) {
          // Phase 1: Only rotation
          rotationProgress = clampedProgress / rotationPhaseEnd;
        } else {
          // Phase 2: Rotation completed, stay at final rotation
          rotationProgress = 1;
        }
        
        // Apply exponential easing to match text movement curves
        // Using screen-size responsive curve strength
        const curveStrength = viewportSize.width <= 768 ? 1.8 : 2.2;
        const easedRotationProgress = Math.pow(rotationProgress, curveStrength);
        const targetRotation = startRotation + (easedRotationProgress * (endRotation - startRotation));
        
        // Responsive rotation lerp - smoother on smaller screens
        const rotationSpeed = viewportSize.width <= 768 ? 0.08 : 0.12;
        rotationY = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetRotation,
          rotationSpeed
        );
      } else {
        // Very subtle idle rotation when not scrolling (around 90°)
        const idleIntensity = viewportSize.width <= 768 ? 0.01 : 0.015;
        rotationY = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.15) * idleIntensity;
      }
      
      meshRef.current.position.set(
        baseX,
        baseY + floatingY,
        0
      );
      meshRef.current.rotation.y = rotationY;
    }
  });

  const responsiveScale = getResponsiveScale();

  return (
    <group ref={meshRef}>
      <primitive 
        object={scene} 
        scale={[responsiveScale, responsiveScale, responsiveScale]} 
        position={[0, 0, 0]} // Position handled by the group
        rotation={[0, 0, 0]}
        // Responsive visibility threshold to match text exit timing per screen size
        visible={scrollProgress !== undefined ? (() => {
          const width = viewportSize.width;
          let threshold;
          if (width <= 640) {
            threshold = 0.9;    // Mobile: text exits faster
          } else if (width <= 1024) {
            threshold = 0.92;   // Tablet: balanced
          } else if (width <= 1550) {
            threshold = 0.94;   // Desktop: text takes longer
          } else {
            threshold = 0.96;   // Large desktop: text takes longest to exit
          }
          return scrollProgress < threshold;
        })() : true}
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
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });
  const scrollValue = useRef(0);

  // ✨ RESPONSIVE CAMERA SYSTEM - Screen-size aware timing with mobile optimizations
  const responsiveCameraPositions = useMemo(() => {
    const width = viewportSize.width;
    
    // Camera Z positions adjusted for much smaller iPhone models
    let cameraZStart, cameraZEnd;
    if (width <= 375) {
      cameraZStart = 60;    // iPhone: much closer for very small model
      cameraZEnd = -40;     // Far back for disappearance
    } else if (width <= 414) {
      cameraZStart = 65;    // iPhone Plus: slightly further
      cameraZEnd = -45;     
    } else if (width <= 640) {
      cameraZStart = 70;    // Mobile: closer for smaller model visibility
      cameraZEnd = -50;     // Far back enough to disappear completely
    } else if (width <= 1024) {
      cameraZStart = 90;    // Tablet: balanced distance
      cameraZEnd = -60;     // Even further back for tablets
    } else if (width <= 1550) {
      cameraZStart = 100;   // Desktop: your perfect setup
      cameraZEnd = -80;     // Far back to ensure complete disappearance
    } else {
      cameraZStart = 110;   // Large desktop: further back for grand effect
      cameraZEnd = -100;    // Very far back for large screens
    }
    
    // Phase timing that matches text exit timing per screen size
    let rotationPhaseEnd, cameraPhaseStart;
    if (width <= 640) {
      rotationPhaseEnd = 0.6;
      cameraPhaseStart = 0.6;
    } else if (width <= 1024) {
      rotationPhaseEnd = 0.7;
      cameraPhaseStart = 0.7;
    } else if (width <= 1550) {
      rotationPhaseEnd = 0.75;
      cameraPhaseStart = 0.75;
    } else {
      rotationPhaseEnd = 0.8;
      cameraPhaseStart = 0.8;
    }
    
    return { cameraZStart, cameraZEnd, rotationPhaseEnd, cameraPhaseStart };
  }, [viewportSize.width]);

  // Track viewport size
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

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

  // Camera with responsive positioning for proper scaling across all screen sizes
  function CameraRig({ 
    cameraZStart, 
    cameraZEnd, 
    currentScrollProgress, 
    onCameraZChange 
  }: {
    cameraZStart: number;
    cameraZEnd: number;
    currentScrollProgress: number;
    onCameraZChange?: (z: number) => void;
  }) {
    useFrame(({ camera }) => {
      // SYNCHRONIZED camera movement with responsive timing
      // Clamp scroll progress to prevent camera from coming back
      const clampedProgress = Math.min(Math.max(currentScrollProgress, 0), 1);
      
      // Use responsive phase timing from camera positions
      const { rotationPhaseEnd, cameraPhaseStart } = responsiveCameraPositions;
      
      let cameraZ = cameraZStart;
      
      if (clampedProgress > cameraPhaseStart) {
        // Phase 2: Camera movement (responsive timing)
        const cameraPhaseProgress = (clampedProgress - cameraPhaseStart) / (1 - cameraPhaseStart);
        
        // Apply exponential easing to match text movement
        // Stronger curve for larger screens where text takes longer to exit
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const curveStrength = viewportWidth <= 768 ? 2.0 : viewportWidth <= 1550 ? 2.5 : 3.0;
        const easedCameraProgress = Math.pow(cameraPhaseProgress, curveStrength);
        cameraZ = cameraZStart + (cameraZEnd - cameraZStart) * easedCameraProgress;
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
          <CameraRig 
            cameraZStart={responsiveCameraPositions.cameraZStart} 
            cameraZEnd={responsiveCameraPositions.cameraZEnd} 
            currentScrollProgress={currentScrollProgress}
            onCameraZChange={onCameraZChange}
          />
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
