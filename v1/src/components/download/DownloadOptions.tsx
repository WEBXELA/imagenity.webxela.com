import React from 'react';
import { motion } from 'framer-motion';
import { downloadImage } from '../../utils/downloadUtils';

const resolutionOptions = [
  { label: 'Web (720p)', width: 1280, height: 720, quality: 0.8 },
  { label: 'HD (1080p)', width: 1920, height: 1080, quality: 0.9 },
  { label: '2K', width: 2560, height: 1440, quality: 0.95 },
  { label: '4K', width: 3840, height: 2160, quality: 1 },
];

interface DownloadOptionsProps {
  onClose: () => void;
}

export function DownloadOptions({ onClose }: DownloadOptionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full mt-2 right-0 w-64 bg-[#2d2d2d] rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
    >
      {resolutionOptions.map((option) => (
        <button
          key={option.label}
          onClick={() => {
            downloadImage(option);
            onClose();
          }}
          className="w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 flex items-center justify-between group"
        >
          <span>{option.label}</span>
          <span className="text-xs text-gray-400 group-hover:text-gray-200">
            {option.width}×{option.height}
          </span>
        </button>
      ))}
    </motion.div>
  );
}