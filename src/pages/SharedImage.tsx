import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface SharedImageData {
  title: string;
  image_url: string;
  user_id: string;
  is_public: boolean;
}

export function SharedImage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageData, setImageData] = useState<SharedImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const { data, error } = await supabase
          .from('shared_images')
          .select('title, image_url, user_id, is_public')
          .eq('public_url', id)
          .single();

        if (error) throw error;

        // Check if the image is private and the user is not the owner
        if (!data.is_public && (!user || user.id !== data.user_id)) {
          throw new Error('Unauthorized');
        }

        setImageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Image not found');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchImage();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-600">Loading shared image...</p>
        </div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'Unauthorized' ? 'Private Image' : 'Image Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === 'Unauthorized' 
              ? 'This image is private and can only be viewed by its owner'
              : 'The shared image you\'re looking for doesn\'t exist'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{imageData.title}</h1>
          </div>
          <div className="relative aspect-video">
            <img
              src={imageData.image_url}
              alt={imageData.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}