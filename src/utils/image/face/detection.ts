import { ImageData } from '../types';

export interface FaceDetectionOptions {
  minFaceSize?: number;
  scaleFactor?: number;
  confidenceThreshold?: number;
}

export function detectFaces(imageData: ImageData, options: FaceDetectionOptions = {}): DOMRect[] {
  const {
    minFaceSize = 20,
    scaleFactor = 1.1,
    confidenceThreshold = 0.8
  } = options;

  // Create scaled versions of the image for better distant face detection
  const scales = generateImageScales(imageData, minFaceSize, scaleFactor);
  
  // Detect faces at each scale
  const faces: DOMRect[] = [];
  for (const scale of scales) {
    const detectedFaces = detectFacesAtScale(scale, confidenceThreshold);
    faces.push(...detectedFaces);
  }

  return mergeFaceDetections(faces);
}

function generateImageScales(
  imageData: ImageData, 
  minSize: number, 
  factor: number
): ImageData[] {
  const scales: ImageData[] = [imageData];
  let currentScale = 1;
  
  while (true) {
    currentScale *= factor;
    const newWidth = Math.round(imageData.width * currentScale);
    const newHeight = Math.round(imageData.height * currentScale);
    
    if (newWidth < minSize || newHeight < minSize) break;
    
    scales.push(scaleImageData(imageData, newWidth, newHeight));
  }
  
  return scales;
}

function scaleImageData(
  imageData: ImageData, 
  newWidth: number, 
  newHeight: number
): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  // Draw original image data
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  tempCtx.putImageData(imageData, 0, 0);
  
  // Scale it
  ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
  
  return ctx.getImageData(0, 0, newWidth, newHeight);
}

function detectFacesAtScale(imageData: ImageData, threshold: number): DOMRect[] {
  // Enhanced face detection at current scale
  const faces: DOMRect[] = [];
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Sliding window approach with optimized step size
  const windowSizes = [24, 36, 48, 64];
  
  for (const size of windowSizes) {
    const step = Math.max(1, Math.floor(size / 4));
    
    for (let y = 0; y < height - size; y += step) {
      for (let x = 0; x < width - size; x += step) {
        const confidence = evaluateWindow(data, width, x, y, size);
        
        if (confidence >= threshold) {
          faces.push(new DOMRect(x, y, size, size));
        }
      }
    }
  }
  
  return faces;
}

function evaluateWindow(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  size: number
): number {
  // Enhanced face pattern recognition
  let skinPixels = 0;
  let edgeStrength = 0;
  
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      const idx = ((y + dy) * width + (x + dx)) * 4;
      
      // Check for skin-like colors
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      if (isSkinColor(r, g, b)) {
        skinPixels++;
      }
      
      // Calculate edge strength
      if (dx > 0 && dy > 0) {
        edgeStrength += calculateEdgeStrength(data, width, x + dx, y + dy);
      }
    }
  }
  
  const skinRatio = skinPixels / (size * size);
  const normalizedEdgeStrength = edgeStrength / (size * size);
  
  return calculateConfidence(skinRatio, normalizedEdgeStrength);
}

function isSkinColor(r: number, g: number, b: number): boolean {
  // Enhanced skin color detection
  const rgb_max = Math.max(r, Math.max(g, b));
  const rgb_min = Math.min(r, Math.min(g, b));
  
  // Normalized RGB
  const nr = r / (r + g + b);
  const ng = g / (r + g + b);
  
  return (
    r > 95 && g > 40 && b > 20 &&
    r > g && r > b &&
    (r - g) > 15 &&
    (rgb_max - rgb_min) > 15 &&
    Math.abs(r - g) > 15 &&
    nr > 0.35 && ng < 0.36
  );
}

function calculateEdgeStrength(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number
): number {
  const idx = (y * width + x) * 4;
  const prevX = ((y) * width + (x - 1)) * 4;
  const prevY = ((y - 1) * width + x) * 4;
  
  const dx = Math.abs(data[idx] - data[prevX]);
  const dy = Math.abs(data[idx] - data[prevY]);
  
  return Math.sqrt(dx * dx + dy * dy);
}

function calculateConfidence(skinRatio: number, edgeStrength: number): number {
  // Weighted combination of factors
  const skinWeight = 0.7;
  const edgeWeight = 0.3;
  
  return (
    skinWeight * Math.min(1, skinRatio * 2) +
    edgeWeight * Math.min(1, edgeStrength / 30)
  );
}

function mergeFaceDetections(faces: DOMRect[]): DOMRect[] {
  // Merge overlapping detections
  const merged: DOMRect[] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < faces.length; i++) {
    if (used.has(i)) continue;
    
    let current = faces[i];
    used.add(i);
    
    for (let j = i + 1; j < faces.length; j++) {
      if (used.has(j)) continue;
      
      const overlap = calculateOverlap(current, faces[j]);
      if (overlap > 0.3) {
        current = mergeRects(current, faces[j]);
        used.add(j);
      }
    }
    
    merged.push(current);
  }
  
  return merged;
}

function calculateOverlap(a: DOMRect, b: DOMRect): number {
  const intersectArea = Math.max(0,
    Math.min(a.right, b.right) - Math.max(a.left, b.left)
  ) * Math.max(0,
    Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
  );
  
  const aArea = a.width * a.height;
  const bArea = b.width * b.height;
  
  return intersectArea / Math.min(aArea, bArea);
}

function mergeRects(a: DOMRect, b: DOMRect): DOMRect {
  const left = Math.min(a.left, b.left);
  const top = Math.min(a.top, b.top);
  const right = Math.max(a.right, b.right);
  const bottom = Math.max(a.bottom, b.bottom);
  
  return new DOMRect(
    left,
    top,
    right - left,
    bottom - top
  );
}