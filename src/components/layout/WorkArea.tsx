import React from 'react';
import { Canvas } from '../canvas/Canvas';
import { motion } from 'framer-motion';

export function WorkArea() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 bg-[#2d2d2d] p-8 overflow-auto"
    >
      <div className="max-w-6xl mx-auto">
        <Canvas />
      </div>
    </motion.div>
  );
}