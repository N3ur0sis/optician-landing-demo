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

const DEFAULT_MODEL_URL = '/models/glasses.glb';

// Enhanced Glasses 3D Model Component with loading states and responsive scaling
function Glasses({ onLoad, scrollProgress, modelUrl, modelAdjustments }: { 
  onLoad?: () => void; 
  scrollProgress?: number; 
  modelUrl: string;
  modelAdjustments?: {
    scale: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
  };
}) {
  const { scene } = useGLTF(modelUrl);
  const meshRef = useRef<THREE.Group>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });
  const [autoFitScale, setAutoFitScale] = useState(1);
  
  const MODEL_POSITION_X = 0.0; // Keep X centered
  
  // Auto-fit for custom models to make them visible by default
  useEffect(() => {
    if (scene) {
      const isDefaultModel = modelUrl === DEFAULT_MODEL_URL;
      
      if (isDefaultModel) {
        // Default model keeps original scale
        setAutoFitScale(1);
      } else {
        // For custom models, calculate a reasonable base scale
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Target size that makes custom models appear at similar size to default
        // User can then fine-tune with sliders
        const targetSize = 8;
        
        if (maxDim > 0) {
          setAutoFitScale(targetSize / maxDim);
        }
      }
    }
  }, [scene, modelUrl]);
  
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
  
  // 📐 RESPONSIVE Z-DEPTH SCALE CALCULATION
  // Scale position Z based on viewport width to maintain consistent depth perception
  // Baseline: >1550px = 1.0 (reference), smaller screens need less depth
  const getResponsiveZScale = () => {
    const width = viewportSize.width;
    
    // For large screens, use full baseline (reference point)
    if (width > 1550) return 1.0;
    
    // For screens <= 1550, progressively reduce depth
    // User reported: Z=90 works at >1550px, Z=80 works at <1550px → ratio ~0.89
    if (width <= 375) return 0.45;     // iPhone: much less depth
    if (width <= 414) return 0.55;     // iPhone Plus/Pro: slightly more
    if (width <= 640) return 0.65;     // Mobile: reduced depth
    if (width <= 768) return 0.75;     // Small tablet: balanced
    if (width <= 1024) return 0.85;    // Tablet: approaching baseline
    if (width <= 1200) return 0.89;    // Small desktop: 80/90 ratio
    if (width <= 1550) return 0.89;    // Medium desktop: same ratio (80/90)
    
    return 1.0;
  };
  
  // 📐 RESPONSIVE Y-POSITION SCALE CALCULATION
  // Scale position Y based on viewport width to compensate for Z depth changes
  // When model is closer (smaller Z), it appears higher, so we reduce Y offset
  // Baseline: >1550px = 1.0 (reference Y=8), smaller screens need proportionally less Y
  const getResponsiveYScale = () => {
    const width = viewportSize.width;
    
    // For large screens, use full baseline (reference point)
    if (width > 1550) return 1.0;
    
    // For screens <= 1550, progressively reduce Y offset to compensate for closer model
    // Using similar ratios to Z scale for consistent visual positioning
    if (width <= 375) return 0.45;     // iPhone: much less Y offset
    if (width <= 414) return 0.55;     // iPhone Plus/Pro
    if (width <= 640) return 0.65;     // Mobile: Y=8 becomes ~5.2
    if (width <= 768) return 0.75;     // Small tablet
    if (width <= 1024) return 0.85;    // Tablet
    if (width <= 1200) return 0.89;    // Small desktop
    if (width <= 1550) return 0.89;    // Medium desktop
    
    return 1.0;
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
      
      // Default model needs centering offset (it's naturally positioned too high)
      const isDefaultModel = modelUrl === DEFAULT_MODEL_URL;
      const centeringOffset = isDefaultModel ? -3.0 : 0; // Lower the default model (more negative = down)
      const baseY = modelY + centeringOffset;
      
      // Responsive floating animation - less intense on smaller screens
      const floatingIntensity = viewportSize.width <= 768 ? 0.04 : 0.08;
      const floatingY = Math.sin(state.clock.elapsedTime * 0.6) * floatingIntensity;

      // --- SYNCHRONIZED two-phase animation with responsive timing ---
      // Custom Y rotation offset in radians
      const adjRotYOffset = (modelAdjustments?.rotationY ?? 0) * (Math.PI / 180);
      let rotationY = Math.PI / 2 + adjRotYOffset; // Start at 90 degrees (side view) + custom offset
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
        
        const startRotation = - Math.PI / 2 + adjRotYOffset; // 90 degrees - initial position + custom offset
        const endRotation = -(3 * Math.PI) / 2 + adjRotYOffset; // 270 degrees - final position + custom offset
        
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
        rotationY = Math.PI / 2 + adjRotYOffset + Math.sin(state.clock.elapsedTime * 0.15) * idleIntensity;
      }
      
      // Apply custom position adjustments with responsive scaling
      const adjustX = modelAdjustments?.positionX ?? 0;
      const adjustY = (modelAdjustments?.positionY ?? 0) * getResponsiveYScale();
      const adjustZ = (modelAdjustments?.positionZ ?? 0) * getResponsiveZScale();
      
      meshRef.current.position.set(
        baseX + adjustX,
        baseY + floatingY + adjustY,
        adjustZ
      );
      meshRef.current.rotation.y = rotationY;
      
      // Apply custom rotation adjustments (converted from degrees to radians)
      const adjRotX = (modelAdjustments?.rotationX ?? 0) * (Math.PI / 180);
      const adjRotZ = (modelAdjustments?.rotationZ ?? 0) * (Math.PI / 180);
      meshRef.current.rotation.x = adjRotX;
      meshRef.current.rotation.z = adjRotZ;
    }
  });

  // Apply custom scale adjustment (percentage of auto-calculated responsive scale)
  // Default model uses responsive scale only, custom models get autofit + responsive + user adjustment
  const scaleMultiplier = (modelAdjustments?.scale ?? 100) / 100;
  const responsiveScale = getResponsiveScale() * autoFitScale * scaleMultiplier;

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

type ModelAdjustments = {
  scale: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
};

type GlassesModelProps = {
  scrollProgress?: MotionValue<number>;
  onCameraZChange?: (z: number) => void;
  modelUrl?: string;
  modelAdjustments?: ModelAdjustments;
};

const GlassesModel = ({ scrollProgress, onCameraZChange, modelUrl, modelAdjustments }: GlassesModelProps) => {
  const resolvedModelUrl = modelUrl && modelUrl.trim() !== '' ? modelUrl : DEFAULT_MODEL_URL;
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
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: THREE.SRGBColorSpace
          }}
          style={{ 
            background: 'transparent', 
            width: '100%', 
            height: '100%',
            display: 'block'
          }}
          dpr={typeof window !== 'undefined' && window.devicePixelRatio > 2 ? [1.5, 2] : [1, 2]}
          resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
        >
          <CameraRig 
            cameraZStart={responsiveCameraPositions.cameraZStart} 
            cameraZEnd={responsiveCameraPositions.cameraZEnd} 
            currentScrollProgress={currentScrollProgress}
            onCameraZChange={onCameraZChange}
          />
          {/* Enhanced multi-point lighting for smooth edges and rich details */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.9} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
            shadow-radius={4}
          />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <pointLight position={[0, 5, 0]} intensity={0.4} />
          <pointLight position={[-3, 2, 3]} intensity={0.3} />
          <spotLight 
            position={[0, 10, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={0.6}
            castShadow
          />
          <Environment preset="studio" />
          <Glasses onLoad={handleModelLoad} scrollProgress={currentScrollProgress} modelUrl={resolvedModelUrl} modelAdjustments={modelAdjustments} />
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

// Preload the default model
useGLTF.preload(DEFAULT_MODEL_URL);

export default GlassesModel;
