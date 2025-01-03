import { AzureApiError } from './azure/errors';
import { segmentForeground } from './azure/segmentation';
import { preprocessImage } from './imagePreprocessing';

export class ImageProcessingError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}

export interface RemoveBgOptions {
  size?: 'regular' | 'medium' | 'hd' | '4k';
  detectFaces?: boolean;
  enhanceFaces?: boolean;
}

export async function removeBackground(imageFile: File, options: RemoveBgOptions = {}): Promise<string> {
  try {
    // Validate file size (max 4MB for Azure's free tier)
    if (imageFile.size > 4 * 1024 * 1024) {
      throw new ImageProcessingError(
        'Image size must be less than 4MB',
        'FILE_TOO_LARGE'
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      throw new ImageProcessingError(
        'Invalid file type. Please upload an image.',
        'INVALID_FILE_TYPE'
      );
    }

    // Pre-process image to enhance face detection
    const processedFile = await preprocessImage(imageFile, {
      enhanceFaces: options.enhanceFaces ?? true,
      detectFaces: options.detectFaces ?? true
    });
    
    // Convert File to ArrayBuffer
    const imageData = await processedFile.arrayBuffer();
    
    // First attempt with face detection
    try {
      const foregroundBlob = await segmentForeground(imageData, { detectFaces: true });
      return URL.createObjectURL(foregroundBlob);
    } catch (error) {
      // If face detection fails, try without it
      if (error instanceof AzureApiError && error.code === 'FACE_DETECTION_FAILED') {
        console.warn('Face detection failed, falling back to general segmentation');
        const foregroundBlob = await segmentForeground(imageData, { detectFaces: false });
        return URL.createObjectURL(foregroundBlob);
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof AzureApiError) {
      throw new ImageProcessingError(
        `Azure API Error: ${error.message}`,
        error.code
      );
    }
    if (error instanceof ImageProcessingError) {
      throw error;
    }
    throw new ImageProcessingError(
      'Failed to process image. Please try again.',
      'UNKNOWN_ERROR'
    );
  }
}

export function revokeImageUrls(urls: string[]) {
  urls.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}