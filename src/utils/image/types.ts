export interface ImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface ProcessingOptions {
  enhanceFaces?: boolean;
  detectFaces?: boolean;
  maxSize?: number;
  minFaceSize?: number;
  scaleFactor?: number;
  confidenceThreshold?: number;
}

export interface FaceDetectionResult {
  faces: DOMRect[];
  confidence: number;
}