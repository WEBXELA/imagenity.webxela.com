import html2canvas from 'html2canvas';
import { CanvasOptions } from '../../types';
import { ProcessedImage, TextElement } from '../../types';

interface ExtendedCanvasOptions extends CanvasOptions {
  imageState?: ProcessedImage;
  texts?: TextElement[];
}

export async function captureCanvas(
  container: HTMLElement, 
  options: ExtendedCanvasOptions = {}
): Promise<HTMLCanvasElement> {
  const { 
    width,
    height,
    scale = window.devicePixelRatio || 1,
    preserveAspectRatio = true,
    imageState,
    texts
  } = options;

  // Calculate dimensions
  const containerRect = container.getBoundingClientRect();
  const targetWidth = width || containerRect.width;
  const targetHeight = height || containerRect.height;

  // Create canvas with proper dimensions
  const canvas = await html2canvas(container, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    width: targetWidth,
    height: targetHeight,
    scrollX: 0,
    scrollY: -window.scrollY,
    foreignObjectRendering: true,
    onclone: (clonedDoc) => {
      const clonedContainer = clonedDoc.getElementById(container.id);
      if (!clonedContainer) return;

      // Ensure original image is loaded
      if (imageState?.original) {
        const img = clonedContainer.querySelector('img');
        if (img) {
          img.src = imageState.original;
          img.crossOrigin = 'anonymous';
        }
      }

      // Ensure text elements maintain their styles and positions
      const textElements = clonedContainer.querySelectorAll('[data-draggable="true"]');
      textElements.forEach(element => {
        if (!(element instanceof HTMLElement)) return;
        
        const textId = element.getAttribute('data-text-id');
        const textData = texts?.find(t => t.id === textId);
        const original = container.querySelector(`[data-text-id="${textId}"]`);
        
        if (textData && original instanceof HTMLElement) {
          // Copy computed styles
          const computedStyle = window.getComputedStyle(original);
          element.style.cssText = computedStyle.cssText;
          
          // Apply text data
          element.style.fontFamily = textData.fontFamily;
          element.style.fontSize = `${textData.fontSize}px`;
          element.style.color = textData.color;
          element.style.fontWeight = textData.isBold ? 'bold' : 'normal';
          element.style.fontStyle = textData.isItalic ? 'italic' : 'normal';
          element.style.textDecoration = textData.isUnderline ? 'underline' : 'none';
          
          // Ensure effects are preserved
          element.style.textShadow = computedStyle.textShadow;
          element.style.webkitTextStroke = computedStyle.webkitTextStroke;
          element.style.backgroundImage = computedStyle.backgroundImage;
          element.style.webkitBackgroundClip = computedStyle.webkitBackgroundClip;
          element.style.webkitTextFillColor = computedStyle.webkitTextFillColor;
        }
      });

      // Add foreground image if it exists
      if (imageState?.foreground) {
        const fgImg = clonedContainer.querySelector('img:last-child');
        if (fgImg) {
          fgImg.src = imageState.foreground;
          fgImg.crossOrigin = 'anonymous';
        }
      }
    }
  });

  return canvas;
}