'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over interactive elements
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.classList.contains('cursor-pointer') ||
          target.closest('a') ||
          target.closest('button')) {
        setIsHovering(true);
        setIsText(false);
      }
      // Check if hovering over text elements
      else if (target.tagName === 'P' || 
               target.tagName === 'H1' || 
               target.tagName === 'H2' || 
               target.tagName === 'H3' || 
               target.tagName === 'SPAN' ||
               target.classList.contains('cursor-text')) {
        setIsText(true);
        setIsHovering(false);
      }
      else {
        setIsHovering(false);
        setIsText(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Cursor dot - immediate response */}
      <motion.div
        className="custom-cursor"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 1.3 : isText ? 0.9 : 1,
          backgroundColor: isHovering ? '#666' : isText ? '#333' : '#000'
        }}
        transition={{
          type: "tween",
          duration: 0.05,
          ease: "linear"
        }}
      />
      
      {/* Cursor ring - more responsive and smaller offset */}
      <motion.div
        className="custom-cursor-ring"
        animate={{
          x: mousePosition.x - 14,
          y: mousePosition.y - 14,
          scale: isHovering ? 1.3 : isText ? 0.9 : 1,
          borderColor: isHovering ? 'rgba(0, 0, 0, 0.5)' : isText ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.3)'
        }}
        transition={{
          type: "tween",
          duration: 0.08,
          ease: "linear"
        }}
      />
    </>
  );
};

export default CustomCursor;
