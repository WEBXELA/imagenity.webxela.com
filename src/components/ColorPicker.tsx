import React, { useRef, useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Pipette } from 'lucide-react';
import { useEyeDropper } from '../hooks/useEyeDropper';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popover = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const { isSupported, pickColor, isPickingColor } = useEyeDropper();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popover.current &&
        button.current &&
        !popover.current.contains(event.target as Node) &&
        !button.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEyeDropper = async () => {
    const pickedColor = await pickColor();
    if (pickedColor) {
      onChange(pickedColor);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <button
          ref={button}
          className="w-8 h-8 rounded border shadow-sm"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        />
        {isSupported && (
          <button
            onClick={handleEyeDropper}
            disabled={isPickingColor}
            className={`p-1.5 rounded ${
              isPickingColor 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'bg-white hover:bg-gray-50 active:bg-gray-100'
            } border shadow-sm transition-colors`}
            title="Pick color from screen"
          >
            <Pipette size={16} className={isPickingColor ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        )}
      </div>
      {isOpen && (
        <div
          ref={popover}
          className="absolute z-50 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}