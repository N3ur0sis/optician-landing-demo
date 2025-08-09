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
      setScroll(scroll.get() + e.deltaY * 0.001);
    };
    
    let lastY = 0;
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const y = e.touches[0].clientY;
        if (lastY !== 0) {
          e.preventDefault();
          setScroll(scroll.get() - (y - lastY) * 0.003);
        }
        lastY = y;
      }
      if (e.type === 'touchend') lastY = 0;
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouch, { passive: false });
    window.addEventListener('touchend', handleTouch, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
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
