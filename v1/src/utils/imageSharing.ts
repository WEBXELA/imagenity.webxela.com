import { supabase } from '../lib/supabase';
import { nanoid } from 'nanoid';
import html2canvas from 'html2canvas';
import { uploadToStorage } from './storage';

interface ShareImageOptions {
  title: string;
  userId: string;
  isPublic?: boolean;
}

async function captureCanvas(): Promise<Blob> {
  const container = document.getElementById('canvas-container');
  if (!container) {
    throw new Error('Canvas container not found');
  }

  const canvas = await html2canvas(container, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    scale: 2,
    logging: false
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to capture canvas'));
      }
    }, 'image/png', 1.0);
  });
}

export async function shareImage({
  title,
  userId,
  isPublic = true
}: ShareImageOptions): Promise<string> {
  try {
    // 1. Capture the canvas
    const imageBlob = await captureCanvas();

    // 2. Upload to storage
    const fileName = `${nanoid()}.png`;
    const filePath = `${userId}/${fileName}`;
    const publicUrl = await uploadToStorage('shared-images', filePath, imageBlob, {
      contentType: 'image/png',
      cacheControl: '3600'
    });

    // 3. Create share record
    const shareId = `share-${nanoid(10)}`;
    const { error: dbError } = await supabase
      .from('shared_images')
      .insert({
        user_id: userId,
        title,
        image_url: publicUrl,
        public_url: shareId,
        is_public: isPublic
      });

    if (dbError) {
      throw new Error(`Failed to create share record: ${dbError.message}`);
    }

    return shareId;
  } catch (error) {
    console.error('Share error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to share image');
  }
}

export async function getUserImages(userId: string) {
  const { data, error } = await supabase
    .from('shared_images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }

  return data;
}