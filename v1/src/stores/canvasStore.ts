import { create } from 'zustand';
import { Layer, TextElement, ProcessedImage, ImageElement } from '../types';

interface CanvasState {
  image: ProcessedImage | null;
  layers: Layer[];
  setImage: (image: ProcessedImage | null) => void;
  addText: (text: TextElement) => void;
  updateText: (text: TextElement) => void;
  removeText: (id: string) => void;
  addImage: (image: ImageElement) => void;
  updateImage: (image: ImageElement) => void;
  removeImage: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerPosition: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  image: null,
  layers: [
    { id: 'background', type: 'background', isVisible: true },
    { id: 'foreground', type: 'foreground', isVisible: true }
  ],
  setImage: (image) => set({ image }),
  addText: (text) => set((state) => {
    const newLayers = [...state.layers];
    const foregroundIndex = newLayers.findIndex(layer => layer.type === 'foreground');
    newLayers.splice(foregroundIndex, 0, {
      id: text.id,
      type: 'text',
      isVisible: true,
      isAboveForeground: false,
      data: text
    });
    return { layers: newLayers };
  }),
  updateText: (text) => set((state) => ({
    layers: state.layers.map((layer) =>
      layer.type === 'text' && layer.data?.id === text.id
        ? { ...layer, data: text }
        : layer
    )
  })),
  removeText: (id) => set((state) => ({
    layers: state.layers.filter((layer) => layer.type !== 'text' || layer.data?.id !== id)
  })),
  addImage: (image) => set((state) => {
    const newLayers = [...state.layers];
    const foregroundIndex = newLayers.findIndex(layer => layer.type === 'foreground');
    newLayers.splice(foregroundIndex, 0, {
      id: image.id,
      type: 'image',
      isVisible: true,
      isAboveForeground: false,
      data: image
    });
    return { layers: newLayers };
  }),
  updateImage: (image) => set((state) => ({
    layers: state.layers.map((layer) =>
      layer.type === 'image' && layer.data?.id === image.id
        ? { ...layer, data: image }
        : layer
    )
  })),
  removeImage: (id) => set((state) => ({
    layers: state.layers.filter((layer) => layer.type !== 'image' || layer.data?.id !== id)
  })),
  reorderLayers: (fromIndex: number, toIndex: number) => set((state) => {
    if (state.layers[fromIndex]?.type === 'background') return state;
    
    const newLayers = [...state.layers];
    const [movedLayer] = newLayers.splice(fromIndex, 1);
    const adjustedToIndex = Math.max(1, toIndex);
    newLayers.splice(adjustedToIndex, 0, movedLayer);
    
    return { layers: newLayers };
  }),
  toggleLayerVisibility: (id) => set((state) => ({
    layers: state.layers.map((layer) =>
      layer.id === id ? { ...layer, isVisible: !layer.isVisible } : layer
    )
  })),
  toggleLayerPosition: (id) => set((state) => {
    const newLayers = [...state.layers];
    const layerIndex = newLayers.findIndex(layer => layer.id === id);
    const foregroundIndex = newLayers.findIndex(layer => layer.type === 'foreground');
    
    if (layerIndex === -1 || foregroundIndex === -1) return state;
    
    const layer = newLayers[layerIndex];
    
    newLayers.splice(layerIndex, 1);
    
    if (layer.isAboveForeground) {
      newLayers.splice(foregroundIndex, 0, {
        ...layer,
        isAboveForeground: false
      });
    } else {
      newLayers.splice(foregroundIndex + 1, 0, {
        ...layer,
        isAboveForeground: true
      });
    }
    
    return { layers: newLayers };
  })
}));