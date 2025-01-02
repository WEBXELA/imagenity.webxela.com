import React from 'react';
import { Reorder } from 'framer-motion';
import { Layer, TextElement } from '../../types';
import { LayerItem } from './LayerItem';
import { useCanvasStore } from '../../stores/canvasStore';

interface LayersListProps {
  selectedText: TextElement | null;
  onSelectText: (text: TextElement | null) => void;
}

export function LayersList({ selectedText, onSelectText }: LayersListProps) {
  const { layers, toggleLayerVisibility, toggleLayerPosition, reorderLayers } = useCanvasStore();

  const handleReorder = (reorderedLayers: Layer[]) => {
    const movedLayer = reorderedLayers.find((layer, index) => layer.id !== layers[layers.length - 1 - index]?.id);
    if (!movedLayer) return;

    const oldIndex = layers.findIndex(layer => layer.id === movedLayer.id);
    const newIndex = layers.length - 1 - reorderedLayers.findIndex(layer => layer.id === movedLayer.id);

    if (oldIndex !== newIndex) {
      reorderLayers(oldIndex, newIndex);
    }
  };

  // Reverse layers for display so higher z-index appears at top
  const displayLayers = [...layers].reverse();

  return (
    <Reorder.Group
      axis="y"
      values={displayLayers}
      onReorder={handleReorder}
      className="space-y-1"
    >
      {displayLayers.map((layer) => (
        <LayerItem
          key={layer.id}
          layer={layer}
          name={layer.type === 'text' ? layer.data?.text || 'Text Layer' : layer.type}
          isSelected={layer.type === 'text' && layer.data?.id === selectedText?.id}
          onVisibilityToggle={toggleLayerVisibility}
          onPositionToggle={toggleLayerPosition}
          onClick={() => {
            if (layer.type === 'text' && layer.data) {
              onSelectText(layer.data);
            }
          }}
          isDraggable={layer.type !== 'background'}
        />
      ))}
    </Reorder.Group>
  );
}