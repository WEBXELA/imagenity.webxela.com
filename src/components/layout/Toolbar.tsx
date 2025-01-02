import React, { useState } from 'react';
import { Upload, Download, Plus, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DownloadButton } from '../download/DownloadButton';
import { ShareModal } from '../sharing/ShareModal';
import { useCanvasStore } from '../../stores/canvasStore';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';

export function Toolbar() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { image } = useCanvasStore();
  const { user } = useAuth();

  const handleShareClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <>
      <div className="h-14 border-b border-gray-800 bg-[#2d2d2d] flex items-center px-4 gap-2">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload size={20} />
          </motion.button>
          <DownloadButton />
          
          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleShareClick}
            disabled={!image?.original}
            title={!image?.original ? 'Upload an image first' : 'Share image'}
          >
            <Share2 size={20} />
          </motion.button>
        </div>
        
        <div className="h-8 w-px bg-gray-700 mx-2" />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Share Modal */}
      {image?.original && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          imageUrl={image.original}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setShowShareModal(true);
        }}
      />
    </>
  );
}