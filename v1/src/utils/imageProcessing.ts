import { API_KEYS } from '../config/constants';

export class ImageProcessingError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}

export interface RemoveBgOptions {
  size?: 'regular' | 'medium' | 'hd' | '4k';
}

export async function removeBackground(imageFile: File, options: RemoveBgOptions = {}): Promise<string> {
  const apiKey = API_KEYS.REMOVE_BG;
  
  const formData = new FormData();
  formData.append('image_file', imageFile);
  
  if (options.size) {
    formData.append('size', options.size);
  }

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.errors?.[0]?.title || response.statusText;
      throw new ImageProcessingError(
        `API Error: ${errorMessage}`,
        'API_ERROR'
      );
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
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