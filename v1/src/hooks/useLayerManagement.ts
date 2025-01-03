import { useCallback } from 'react';
import { Layer, TextElement } from '../types';
import { useCanvasStore } from '../stores/canvasStore';

export function useLayerManagement() {
  const { layers, reorderLayers, toggleLayerVisibility } = useCanvasStore();

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    // Prevent background layer from being reordered
    if (layers[fromIndex]?.type === 'background') {
      return;
    }
    reorderLayers(fromIndex, toIndex);
  }, [layers, reorderLayers]);

  const handleVisibilityToggle = useCallback((id: string) => {
    toggleLayerVisibility(id);
  }, [toggleLayerVisibility]);

  const getLayerName = useCallback((layer: Layer) => {
    switch (layer.type) {
      case 'text':
        return layer.data?.text || 'Text Layer';
      case 'background':
        return 'Background';
      case 'foreground':
        return 'Foreground';
    }
  }, []);

  return {
    handleReorder,
    handleVisibilityToggle,
    getLayerName,
  };
}