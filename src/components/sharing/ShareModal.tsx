import React, { useState } from 'react';
import { X, Copy, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { shareImage } from '../../utils/imageSharing';
import { Toggle } from '../Toggle';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ShareModal({ isOpen, onClose, imageUrl }: ShareModalProps) {
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const shareId = await shareImage({
        title,
        userId: user.id,
        isPublic
      });
      const fullUrl = `${window.location.origin}/share/${shareId}`;
      setShareUrl(fullUrl);
    } catch (error) {
      setError(error instanceof Error 
        ? error.message 
        : 'Failed to share image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Share Image</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!shareUrl ? (
          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Make image public
              </label>
              <Toggle enabled={isPublic} onChange={setIsPublic} />
            </div>

            <p className="text-sm text-gray-500">
              {isPublic 
                ? "Anyone with the link can view this image" 
                : "Only you can view this image"}
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sharing...
                </>
              ) : (
                'Generate Share Link'
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent border-none focus:ring-0"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              {isPublic 
                ? "Anyone with this link can view the image"
                : "Only you can view this image"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}