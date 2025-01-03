import { useCallback } from 'react';
import { Layer } from '../../../types';
import { useCanvasStore } from '../../../stores/canvasStore';

export function useLayerDrag() {
  const { layers, reorderLayers } = useCanvasStore();

  const handleDragEnd = useCallback((from: number, to: number) => {
    // Prevent dragging background layer or dragging to background position
    if (from === 0 || to === 0) return;
    
    // Ensure valid indices
    const validTo = Math.max(1, Math.min(to, layers.length - 1));
    reorderLayers(from, validTo);
  }, [layers, reorderLayers]);

  return { handleDragEnd };
}