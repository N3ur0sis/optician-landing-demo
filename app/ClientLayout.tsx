"use client";

import { createContext, useEffect, ReactNode } from "react";
import { AnimatePresence, useMotionValue, MotionValue } from "framer-motion";
import { usePathname } from "next/navigation";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ApparenceProvider } from "@/lib/apparence-context";

// Scroll context for custom scroll logic
export type ScrollContextType = {
  scroll: MotionValue<number>;
  setScroll: (v: number) => void;
};
export const ScrollContext = createContext<ScrollContextType>({
  scroll: {} as unknown as MotionValue<number>,
  setScroll: () => {},
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const scroll = useMotionValue(0);
  const isMainPage = pathname === "/";
  const isAdminPage = pathname?.startsWith("/admin");

  const setScroll = (v: number) => {
    scroll.set(Math.max(0, Math.min(1, v)));
  };

  useEffect(() => {
    // Apply custom scroll behavior only on the main page
    if (!isMainPage) {
      // Reset body style for other pages to allow normal scrolling
      document.body.style.height = "auto";
      document.body.style.overflow = "auto";
      return;
    }

    // Apply custom scroll styles for main page
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";

    const getRevealContainer = () =>
      document.querySelector("[data-reveal-scroll]") as HTMLElement | null;

    const resolveScrollTarget = (delta: number) => {
      const current = scroll.get();
      const container = getRevealContainer();
      const isScrollingDown = delta > 0;
      const epsilon = 0.001;

      if (!container) {
        return "animation" as const;
      }

      const maxScroll = container.scrollHeight - container.clientHeight;

      if (isScrollingDown) {
        if (current < 1 - epsilon) {
          return "animation" as const;
        }
        if (container.scrollTop < maxScroll - 1) {
          return "content" as const;
        }
        return "content" as const;
      }

      // Scrolling up - once animation is complete (scroll >= 1), prevent reversing it
      if (current >= 1 - epsilon) {
        // Animation complete - only allow scrolling content
        if (container.scrollTop > 0) {
          return "content" as const;
        }
        // At top of content and animation complete - block scroll
        return "none" as const;
      }
      
      // Animation not complete - allow reversing
      if (container.scrollTop > 0) {
        return "content" as const;
      }
      if (current > 0 + epsilon) {
        return "animation" as const;
      }
      return "content" as const;
    };

    const handleWheel = (e: WheelEvent) => {
      // Ignore scroll when mobile menu is open
      if (document.body.classList.contains('mobile-menu-open')) {
        return;
      }

      // Allow normal interaction if clicking on content reveal cards
      const target = e.target as HTMLElement;
      if (
        target.closest(".content-reveal-card") ||
        target.closest("[data-reveal-scroll]")?.contains(target)
      ) {
        // If we're at scroll = 1 (content fully revealed), allow normal scrolling within content
        if (scroll.get() >= 0.99) {
          return; // Don't prevent default, allow normal wheel events
        }
      }

      const scrollTarget = resolveScrollTarget(e.deltaY);
      const container = getRevealContainer();

      // Block scroll when target is "none" (animation complete, at top of content)
      if (scrollTarget === "none") {
        e.preventDefault();
        return;
      }

      if (scrollTarget === "animation") {
        e.preventDefault();
        const delta = e.deltaY * 0.0008;
        setScroll(scroll.get() + delta);
        return;
      }

      if (container) {
        e.preventDefault();
        container.scrollBy({ top: e.deltaY, behavior: "auto" });
      }
    };

    let lastY = 0;
    let touchStartTime = 0;
    let lastVelocity = 0;

    const handleTouch = (e: TouchEvent) => {
      // Ignore touch when mobile menu is open
      if (document.body.classList.contains('mobile-menu-open')) {
        return;
      }

      // Allow normal interaction if touching content reveal cards
      const target = e.target as HTMLElement;
      if (
        target.closest(".content-reveal-card") ||
        target.closest("[data-reveal-scroll]")?.contains(target)
      ) {
        // If we're at scroll = 1 (content fully revealed), allow normal touch events
        if (scroll.get() >= 0.99) {
          return; // Don't prevent default, allow normal touch events
        }
      }

      if (e.touches.length === 1) {
        const y = e.touches[0].clientY;
        const now = Date.now();

        if (e.type === "touchstart") {
          touchStartTime = now;
          lastY = y;
          lastVelocity = 0;
          return;
        }

        if (lastY !== 0 && e.type === "touchmove") {
          const deltaY = y - lastY;
          const deltaTime = now - touchStartTime;

          // Enhanced touch sensitivity for luxury feel
          const sensitivity = 0.004; // Increased for better mobile control
          const momentum = Math.abs(deltaY) > 10 ? 1.2 : 1; // Add momentum for larger gestures

          const intendedScroll = -deltaY; // Positive when user scrolls down

          const target = resolveScrollTarget(intendedScroll);
          const container = getRevealContainer();

          // Block scroll when target is "none"
          if (target === "none") {
            e.preventDefault();
          } else if (target === "animation") {
            e.preventDefault();
            const scrollDelta = intendedScroll * sensitivity * momentum;
            setScroll(scroll.get() + scrollDelta);

            if (deltaTime > 0) {
              lastVelocity = deltaY / deltaTime;
            }
          } else if (container) {
            e.preventDefault();
            container.scrollTop += deltaY * -1;
            if (deltaTime > 0) {
              lastVelocity = deltaY / deltaTime;
            }
          }
        }
        lastY = y;
      }

      if (e.type === "touchend") {
        // Add momentum-based continuation for elegant feel
        const intendedScroll = -lastVelocity; // Align direction with wheel delta sign
        if (Math.abs(lastVelocity) > 0.5) {
          const target = resolveScrollTarget(intendedScroll);
          if (target === "animation") {
            const momentum = Math.min(Math.abs(lastVelocity) * 0.001, 0.05);
            const direction = intendedScroll > 0 ? 1 : -1;
            setScroll(scroll.get() + momentum * direction);
          }
        }
        lastY = 0;
        lastVelocity = 0;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouch, { passive: false });
    window.addEventListener("touchmove", handleTouch, { passive: false });
    window.addEventListener("touchend", handleTouch, { passive: false });

    // Add click event listener to ensure cards remain clickable
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".content-reveal-card")) {
        // Don't prevent click events on content reveal cards
        return;
      }
    };

    window.addEventListener("click", handleClick, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("touchend", handleTouch);
      window.removeEventListener("click", handleClick);
    };
  }, [scroll, isMainPage]);

  return (
    <ApparenceProvider>
      <ScrollContext.Provider value={{ scroll, setScroll }}>
        {/* Analytics tracker - only on public pages */}
        {!isAdminPage && <AnalyticsTracker />}
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </ScrollContext.Provider>
    </ApparenceProvider>
  );
}
