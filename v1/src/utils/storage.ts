import { supabase } from '../lib/supabase';

export class StorageError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function uploadToStorage(
  bucket: string,
  path: string,
  file: Blob,
  options?: {
    contentType?: string;
    cacheControl?: string;
  }
): Promise<string> {
  try {
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options?.contentType,
        cacheControl: options?.cacheControl
      });

    if (uploadError) {
      throw new StorageError(
        uploadError.message,
        uploadError.name
      );
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError(
      'Failed to upload file to storage',
      'UPLOAD_ERROR'
    );
  }
}