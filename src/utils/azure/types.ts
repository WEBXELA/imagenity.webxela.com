export interface AzureError {
  error: {
    code: string;
    message: string;
  };
}

export interface SegmentationResponse {
  foregroundUrl: string;
}

export interface AzureConfig {
  endpoint: string;
  apiKey: string;
}