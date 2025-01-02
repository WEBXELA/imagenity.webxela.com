import React, { useState } from 'react';
import { Download, ChevronDown, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadImage } from '../../utils/downloadUtils';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';
import { ShareModal } from '../sharing/ShareModal';

const resolutionOptions = [
  { label: 'HD (720p)', width: 1280, height: 720, quality: 0.8 },
  { label: 'Full HD (1080p)', width: 1920, height: 1080, quality: 0.9 },
  { label: '2K', width: 2560, height: 1440, quality: 0.95 },
  { label: '4K', width: 3840, height: 2160, quality: 1.0 }
];

export function DownloadButton() {
  const [showOptions, setShowOptions] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { user } = useAuth();

  const handleDownload = async (option = resolutionOptions[1]) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await downloadImage(option);
      setShowOptions(false);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowShareModal(true);
  };

  return (
    <>
      <div className="relative flex">
        <button
          onClick={() => handleDownload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white border-l border-blue-500"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-r-lg border-l border-emerald-500 flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              {resolutionOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleDownload(option)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  <span className="text-xs text-gray-500">
                    {option.width}×{option.height}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setShowShareModal(true);
        }}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        imageUrl={window.location.href}
      />
    </>
  );
}