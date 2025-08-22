"use client";

import { createContext, useEffect, ReactNode } from 'react';
import { AnimatePresence, useMotionValue, MotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Scroll context for custom scroll logic
export type ScrollContextType = { scroll: MotionValue<number>; setScroll: (v: number) => void };
export const ScrollContext = createContext<ScrollContextType>({ scroll: ({} as unknown) as MotionValue<number>, setScroll: () => {} });

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const scroll = useMotionValue(0);
  const isMainPage = pathname === '/';
  
  const setScroll = (v: number) => {
    scroll.set(Math.max(0, Math.min(1, v)));
  };

  useEffect(() => {
    // Apply custom scroll behavior only on the main page
    if (!isMainPage) {
      // Reset body style for other pages to allow normal scrolling
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
      return;
    }

    // Apply custom scroll styles for main page
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Smoother desktop scroll with momentum
      const delta = e.deltaY * 0.0008; // Reduced for more refined control
      setScroll(scroll.get() + delta);
    };
    
    let lastY = 0;
    let touchStartTime = 0;
    let lastVelocity = 0;
    
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const y = e.touches[0].clientY;
        const now = Date.now();
        
        if (e.type === 'touchstart') {
          touchStartTime = now;
          lastY = y;
          lastVelocity = 0;
          return;
        }
        
        if (lastY !== 0 && e.type === 'touchmove') {
          e.preventDefault();
          const deltaY = y - lastY;
          const deltaTime = now - touchStartTime;
          
          // Enhanced touch sensitivity for luxury feel
          const sensitivity = 0.004; // Increased for better mobile control
          const momentum = Math.abs(deltaY) > 10 ? 1.2 : 1; // Add momentum for larger gestures
          
          const scrollDelta = -deltaY * sensitivity * momentum;
          setScroll(scroll.get() + scrollDelta);
          
          // Track velocity for momentum scrolling
          if (deltaTime > 0) {
            lastVelocity = deltaY / deltaTime;
          }
        }
        lastY = y;
      }
      
      if (e.type === 'touchend') {
        // Add momentum-based continuation for elegant feel
        if (Math.abs(lastVelocity) > 0.5) {
          const momentum = Math.min(Math.abs(lastVelocity) * 0.001, 0.05);
          const direction = lastVelocity > 0 ? -1 : 1;
          setScroll(scroll.get() + momentum * direction);
        }
        lastY = 0;
        lastVelocity = 0;
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouch, { passive: false });
    window.addEventListener('touchmove', handleTouch, { passive: false });
    window.addEventListener('touchend', handleTouch, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouch);
    };
  }, [scroll, isMainPage]);

  return (
    <ScrollContext.Provider value={{ scroll, setScroll }}>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </ScrollContext.Provider>
  );
}
