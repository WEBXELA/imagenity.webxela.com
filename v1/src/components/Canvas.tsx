import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ProcessedImage, TextElement, ImageElement } from '../types';
import { DraggableText } from './DraggableText';
import { DraggableImage } from './DraggableImage';
import { useCanvasStore } from '../stores/canvasStore';

interface CanvasProps {
  processedImage: ProcessedImage | null;
  isProcessing: boolean;
  selectedText: TextElement | null;
  onTextSelect: (text: TextElement | null) => void;
  onTextUpdate: (text: TextElement) => void;
}

export function Canvas({
  processedImage,
  isProcessing,
  selectedText,
  onTextSelect,
  onTextUpdate
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { layers, updateImage } = useCanvasStore();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Update canvas size based on original image
  useEffect(() => {
    if (processedImage?.original) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = processedImage.original;
      img.onload = () => {
        if (!containerRef.current) return;
        
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        // Calculate aspect ratio
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;
        
        let width, height;
        
        if (containerAspectRatio > imageAspectRatio) {
          // Container is wider than image
          height = containerHeight;
          width = height * imageAspectRatio;
        } else {
          // Container is taller than image
          width = containerWidth;
          height = width / imageAspectRatio;
        }
        
        setCanvasSize({ width, height });
      };
    }
  }, [processedImage?.original]);

  const handleTextMove = useCallback((id: string, x: number, y: number) => {
    const textLayer = layers.find(
      layer => layer.type === 'text' && layer.data?.id === id
    );
    if (textLayer?.data) {
      onTextUpdate({ ...textLayer.data as TextElement, x, y });
    }
  }, [layers, onTextUpdate]);

  const handleImageMove = useCallback((id: string, x: number, y: number) => {
    const imageLayer = layers.find(
      layer => layer.type === 'image' && layer.data?.id === id
    );
    if (imageLayer?.data) {
      updateImage({ ...imageLayer.data as ImageElement, x, y });
    }
  }, [layers, updateImage]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onTextSelect(null);
    }
  }, [onTextSelect]);

  if (!processedImage?.original && !isProcessing) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">Upload an image to get started</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-gray-100 p-4 overflow-auto"
      onClick={handleCanvasClick}
    >
      <div 
        ref={containerRef}
        id="canvas-container"
        className="relative bg-white rounded-lg shadow-sm"
        style={{ 
          width: canvasSize.width || '100%',
          height: canvasSize.height || '100%',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {layers.map((layer, index) => {
          if (!layer.isVisible) return null;

          switch (layer.type) {
            case 'background':
              return processedImage?.original && (
                <img
                  key={layer.id}
                  src={processedImage.original}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ zIndex: index }}
                  crossOrigin="anonymous"
                />
              );
            case 'text':
              return layer.data && (
                <DraggableText
                  key={layer.id}
                  text={layer.data as TextElement}
                  onSelect={onTextSelect}
                  onMove={handleTextMove}
                  containerRef={containerRef}
                  isSelected={selectedText?.id === layer.data.id}
                  style={{ zIndex: index }}
                />
              );
            case 'image':
              return layer.data && (
                <DraggableImage
                  key={layer.id}
                  image={layer.data as ImageElement}
                  onMove={handleImageMove}
                  containerRef={containerRef}
                  style={{ zIndex: index }}
                />
              );
            case 'foreground':
              return processedImage?.foreground && (
                <img
                  key={layer.id}
                  src={processedImage.foreground}
                  alt="Foreground"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ zIndex: index }}
                  crossOrigin="anonymous"
                />
              );
            default:
              return null;
          }
        })}

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center" style={{ zIndex: 9999 }}>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-600">Processing image...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}