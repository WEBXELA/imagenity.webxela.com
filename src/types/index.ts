export interface ProcessedImage {
  original: string;
  foreground: string | null;
}

export interface TextPosition {
  x: number;
  y: number;
}

export interface Layer {
  id: string;
  type: 'background' | 'text' | 'foreground' | 'image';
  isVisible: boolean;
  isAboveForeground?: boolean;
  data?: TextElement | ImageElement;
}

export interface TextElement extends TextPosition {
  id: string;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isVisible: boolean;
  effects?: TextEffects;
}

export interface ImageElement extends TextPosition {
  id: string;
  url: string;
  width: number;
  height: number;
  isVisible: boolean;
}

export interface TextEffects {
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  neon?: {
    color: string;
    blur: number;
    intensity: number;
  };
  outline?: {
    color: string;
    width: number;
  };
  gradient?: {
    colors: string[];
    angle: number;
  };
  echo?: {
    count: number;
    distance: number;
    opacity: number;
  };
}