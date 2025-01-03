import { AzureApiError } from './errors';
import { azureConfig } from './config';
import { AzureError } from './types';

interface SegmentationOptions {
  detectFaces?: boolean;
  enhanceDetail?: boolean;
}

export async function segmentForeground(
  imageData: ArrayBuffer, 
  options: SegmentationOptions = {}
): Promise<Blob> {
  const { detectFaces = true, enhanceDetail = true } = options;

  // Build the API endpoint URL with appropriate parameters
  const params = new URLSearchParams({
    'api-version': '2023-02-01-preview',
    'mode': 'backgroundRemoval',
    'detectFaces': detectFaces.toString(),
    'enhanceDetail': enhanceDetail.toString()
  });

  const endpoint = `${azureConfig.endpoint}/computervision/imageanalysis:segment?${params}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': azureConfig.apiKey
      },
      body: imageData
    });

    if (!response.ok) {
      const errorData = await response.json() as AzureError;
      
      // Handle specific error cases
      if (errorData.error?.message?.includes('face')) {
        throw new AzureApiError(
          'Face detection failed, trying alternative method',
          'FACE_DETECTION_FAILED',
          response.status
        );
      }
      
      throw new AzureApiError(
        errorData.error?.message || 'Segmentation failed',
        errorData.error?.code || 'SEGMENTATION_ERROR',
        response.status
      );
    }

    // The response is directly the image blob
    return await response.blob();
  } catch (error) {
    if (error instanceof AzureApiError) {
      throw error;
    }
    throw new AzureApiError(
      'Failed to segment image',
      'UNKNOWN_ERROR'
    );
  }
}