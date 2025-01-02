import React from 'react';
import { Layers } from 'lucide-react';
import { TextElement } from '../../types';
import { LayersList } from './LayersList';
import { useCanvasStore } from '../../stores/canvasStore';

interface LayersPanelProps {
  selectedText: TextElement | null;
  onSelectText: (text: TextElement | null) => void;
}

export function LayersPanel({ selectedText, onSelectText }: LayersPanelProps) {
  const { layers } = useCanvasStore();

  return (
    <div className="border-t border-gray-200 mt-4 pt-4">
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Layers</h3>
        </div>
        <span className="text-xs text-gray-500">{layers.length} layers</span>
      </div>

      <LayersList
        layers={layers}
        selectedText={selectedText}
        onSelectText={onSelectText}
      />
    </div>
  );
}