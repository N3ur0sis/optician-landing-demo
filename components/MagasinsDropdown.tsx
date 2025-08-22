'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';

export default function MagasinsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const stores = [
    { name: 'Le Port', slug: 'le-port' },
    { name: 'Saint-Paul', slug: 'saint-paul' },
    { name: 'Saint-Denis', slug: 'saint-denis' },
    { name: 'Saint-André', slug: 'saint-andre' },
    { name: 'Bras-Panon', slug: 'bras-panon' },
    { name: 'Saint-Louis', slug: 'saint-louis' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        className="text-sm lg:text-base font-medium text-black hover:text-amber-700 transition-all duration-500 ease-out relative group cursor-pointer flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        MAGASINS
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <FaChevronDown className="text-xs" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-48 sm:w-52 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-100 py-2 z-30"
            initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
          >
            <Link 
              href="/magasins"
              className="block px-4 py-2.5 text-sm text-neutral-800 hover:bg-amber-50 hover:text-amber-800 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100"></span>
                <span>Tous nos magasins</span>
              </div>
            </Link>
            <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-1.5" />
            {stores.map((store, index) => (
              <motion.div
                key={store.slug}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Link
                  href={`/magasins/${store.slug}`}
                  className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-amber-50 hover:text-amber-800 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>ODB {store.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
