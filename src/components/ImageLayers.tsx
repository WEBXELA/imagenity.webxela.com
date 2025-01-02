import React from 'react';
import { ProcessedImage } from '../types';

interface ImageLayersProps {
  processedImage: ProcessedImage;
}

export function ImageLayers({ processedImage }: ImageLayersProps) {
  return (
    <>
      {/* Bottom layer - Original background */}
      <div className="absolute inset-0">
        <img
          src={processedImage.original}
          alt="Background"
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Top layer - Foreground without background */}
      {processedImage.foreground && (
        <div className="absolute inset-0">
          <img
            src={processedImage.foreground}
            alt="Foreground"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </>
  );
}