import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../../stores/canvasStore';
import { drawCanvas } from '../../utils/canvasUtils';

export function Canvas() {
  const { image, texts } = useCanvasStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCanvas(canvasRef.current, image, texts);
    }
  }, [image, texts]);

  return (
    <motion.div
      layout
      className="w-full aspect-video bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden"
    >
      <canvas 
        ref={canvasRef}
        id="main-canvas"
        className="w-full h-full"
      />
    </motion.div>
  );
}