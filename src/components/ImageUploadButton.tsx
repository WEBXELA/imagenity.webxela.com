import React from 'react';
import { ImagePlus } from 'lucide-react';

interface ImageUploadButtonProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploadButton({ onUpload, disabled }: ImageUploadButtonProps) {
  return (
    <button
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) onUpload(file);
        };
        input.click();
      }}
      className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      disabled={disabled}
    >
      <ImagePlus className="w-4 h-4" />
      <span>Add Image</span>
    </button>
  );
}