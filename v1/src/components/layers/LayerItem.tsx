import React from 'react';
import { Type, GripVertical, EyeOff, Eye, Image, ArrowUp, ArrowDown } from 'lucide-react';
import { Layer } from '../../types';
import { Reorder } from 'framer-motion';

interface LayerItemProps {
  layer: Layer;
  name: string;
  isSelected: boolean;
  onVisibilityToggle: (id: string) => void;
  onPositionToggle?: (id: string) => void;
  onClick: () => void;
  isDraggable: boolean;
}

export function LayerItem({
  layer,
  name,
  isSelected,
  onVisibilityToggle,
  onPositionToggle,
  onClick,
  isDraggable
}: LayerItemProps) {
  const getIcon = () => {
    switch (layer.type) {
      case 'text':
        return <Type className="w-4 h-4 text-gray-500" />;
      case 'image':
        return <Image className="w-4 h-4 text-emerald-500" />;
      case 'background':
      case 'foreground':
        return <Image className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Reorder.Item
      value={layer}
      dragListener={isDraggable}
      className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50'
      } ${!isDraggable ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
    >
      {isDraggable && (
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      {!isDraggable && <div className="w-4" />}
      {getIcon()}
      <span className="text-sm text-gray-600 truncate flex-1">
        {name}
      </span>
      <div className="flex items-center gap-1">
        {(layer.type === 'text' || layer.type === 'image') && onPositionToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPositionToggle(layer.id);
            }}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            title={layer.isAboveForeground ? "Move below foreground" : "Move above foreground"}
          >
            {layer.isAboveForeground ? (
              <ArrowDown className="w-4 h-4 text-blue-500" />
            ) : (
              <ArrowUp className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVisibilityToggle(layer.id);
          }}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          title={layer.isVisible ? "Hide layer" : "Show layer"}
        >
          {!layer.isVisible ? (
            <EyeOff className="w-4 h-4 text-gray-400" />
          ) : (
            <Eye className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
    </Reorder.Item>
  );
}