import { useState, useCallback } from 'react';

interface EyeDropperResult {
  sRGBHex: string;
}

export function useEyeDropper() {
  const [isSupported] = useState(() => 'EyeDropper' in window);
  const [isPickingColor, setIsPickingColor] = useState(false);

  const pickColor = useCallback(async () => {
    if (!isSupported) return null;
    
    try {
      setIsPickingColor(true);
      // @ts-ignore - EyeDropper API is not in TypeScript yet
      const eyeDropper = new window.EyeDropper();
      const result: EyeDropperResult = await eyeDropper.open();
      return result.sRGBHex;
    } catch (error) {
      // User canceled or browser doesn't support
      return null;
    } finally {
      setIsPickingColor(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    pickColor,
    isPickingColor
  };
}