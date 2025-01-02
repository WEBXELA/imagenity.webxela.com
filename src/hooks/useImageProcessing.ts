import { useState } from 'react';
import { removeBackground, revokeImageUrls, ImageProcessingError } from '../utils/imageProcessing';
import type { ProcessedImage } from '../types';
import { useCanvasStore } from '../stores/canvasStore';

export function useImageProcessing() {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setImage } = useCanvasStore();

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Create the original image URL
      const originalUrl = URL.createObjectURL(file);

      // Set initial state with just the original image
      const initialState = { original: originalUrl, foreground: null };
      setProcessedImage(initialState);
      setImage(initialState);

      // Process the background removal
      const foregroundUrl = await removeBackground(file, { size: 'regular' });

      // Update state with both images
      const finalState = { original: originalUrl, foreground: foregroundUrl };
      setProcessedImage(finalState);
      setImage(finalState);

    } catch (err) {
      if (err instanceof ImageProcessingError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      cleanup();
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = () => {
    if (processedImage) {
      revokeImageUrls([
        processedImage.original,
        ...(processedImage.foreground ? [processedImage.foreground] : [])
      ]);
      setProcessedImage(null);
      setImage(null);
    }
  };

  return {
    processedImage,
    isProcessing,
    error,
    processImage,
    cleanup,
    setError
  };
}