import { Bounds } from './bounds';

interface ScaleFactors {
  scaleX: number;
  scaleY: number;
  targetWidth: number;
  targetHeight: number;
}

export function calculateScaleFactors(
  image: HTMLImageElement,
  bounds: Bounds,
  targetWidth: number,
  targetHeight: number
): ScaleFactors {
  const imageAspectRatio = image.naturalWidth / image.naturalHeight;
  const boundsAspectRatio = bounds.width / bounds.height;
  
  let finalWidth = targetWidth;
  let finalHeight = targetHeight;

  // Maintain aspect ratio while fitting within target dimensions
  if (boundsAspectRatio > imageAspectRatio) {
    finalWidth = Math.round(targetHeight * imageAspectRatio);
    finalHeight = targetHeight;
  } else {
    finalWidth = targetWidth;
    finalHeight = Math.round(targetWidth / imageAspectRatio);
  }

  return {
    scaleX: finalWidth / bounds.width,
    scaleY: finalHeight / bounds.height,
    targetWidth: finalWidth,
    targetHeight: finalHeight
  };
}