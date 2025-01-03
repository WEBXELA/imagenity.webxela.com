import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 max-w-md bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 transition-colors"
        >
          <span className="sr-only">Dismiss</span>
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}