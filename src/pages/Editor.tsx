import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Canvas } from '../components/Canvas';
import { TextEditor } from '../components/TextEditor';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useGoogleFonts } from '../hooks/useGoogleFonts';
import { useCanvasStore } from '../stores/canvasStore';
import { TextElement, ImageElement } from '../types';
import { nanoid } from 'nanoid';
import { FONT_SIZES } from '../config/constants';
import { ErrorMessage } from '../components/ErrorMessage';
import { ImageUploadButton } from '../components/ImageUploadButton';

export function Editor() {
  const { processedImage, isProcessing, error, processImage, cleanup, setError } = useImageProcessing();
  const { fonts, loading: fontsLoading } = useGoogleFonts();
  const [selectedText, setSelectedText] = useState<TextElement | null>(null);
  const { addText, updateText, setImage, addImage } = useCanvasStore();

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    cleanup();
    try {
      const originalUrl = URL.createObjectURL(file);
      setImage({ original: originalUrl, foreground: null });
      await processImage(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    }
  };

  const handleAddText = () => {
    const newText: TextElement = {
      id: nanoid(),
      text: 'Double click to edit',
      x: 50,
      y: 50,
      fontSize: FONT_SIZES.defaultSize,
      color: '#000000',
      fontFamily: fonts[0] || 'Arial',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isVisible: true,
      effects: {}
    };
    addText(newText);
    setSelectedText(newText);
  };

  const handleAddImage = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const containerWidth = document.getElementById('canvas-container')?.offsetWidth || 800;
      const containerHeight = document.getElementById('canvas-container')?.offsetHeight || 600;
      
      let width = img.width;
      let height = img.height;
      const maxWidth = containerWidth * 0.8;
      const maxHeight = containerHeight * 0.8;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      const newImage: ImageElement = {
        id: nanoid(),
        url,
        width,
        height,
        x: (containerWidth - width) / 2,
        y: (containerHeight - height) / 2,
        isVisible: true
      };
      
      addImage(newImage);
    };
  };

  const handleTextUpdate = (updatedText: TextElement) => {
    updateText(updatedText);
    setSelectedText(updatedText);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-[280px] border-r border-gray-200 bg-white">
          <div className="p-4">
            <label className="block mb-4">
              <div className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <span className="text-sm text-gray-600">Upload background</span>
              </div>
            </label>

            <div className="space-y-2">
              <button
                onClick={handleAddText}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!processedImage?.original}
              >
                Add Text
              </button>

              <ImageUploadButton
                onUpload={handleAddImage}
                disabled={!processedImage?.original}
              />
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-50 p-8">
          <Canvas
            processedImage={processedImage}
            isProcessing={isProcessing}
            selectedText={selectedText}
            onTextSelect={setSelectedText}
            onTextUpdate={handleTextUpdate}
          />
        </div>

        {/* Right Properties Panel */}
        <div className="w-[320px] border-l border-gray-200 bg-white">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Properties</h3>
            {!fontsLoading && (
              <TextEditor
                selectedText={selectedText}
                onUpdate={handleTextUpdate}
                fonts={fonts}
              />
            )}
          </div>
        </div>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
}