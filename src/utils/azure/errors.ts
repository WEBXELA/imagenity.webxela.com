export class AzureApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'AzureApiError';
  }
}