import { useCanvasStore } from '../stores/canvasStore';
import html2canvas from 'html2canvas';
import { adjustTextPosition } from './download/textPosition';

interface DownloadOptions {
  width?: number;
  height?: number;
  quality?: number;
  label?: string;
}

export async function downloadImage(options: DownloadOptions = {}) {
  try {
    const container = document.getElementById('canvas-container');
    if (!container) throw new Error('Canvas container not found');

    const { image, layers } = useCanvasStore.getState();
    if (!image?.original) throw new Error('No image to download');

    // Wait for fonts to load
    await document.fonts.ready;

    // Create canvas with proper dimensions
    const canvas = await html2canvas(container, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      width: container.offsetWidth,
      height: container.offsetHeight,
      scale: window.devicePixelRatio || 1,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.getElementById('canvas-container');
        if (!clonedContainer) return;

        // Process each layer in order
        layers.forEach((layer, index) => {
          if (!layer.isVisible) return;

          if (layer.type === 'text' && layer.data) {
            // Find the text elements
            const clonedElement = clonedContainer.querySelector(`[data-text-id="${layer.data.id}"]`);
            const originalElement = container.querySelector(`[data-text-id="${layer.data.id}"]`);
            
            if (clonedElement instanceof HTMLElement && originalElement instanceof HTMLElement) {
              // Get the original computed styles
              const computedStyle = window.getComputedStyle(originalElement);
              
              // Preserve position from the editor with vertical adjustment
              clonedElement.style.position = 'absolute';
              clonedElement.style.left = `${layer.data.x}px`;
              clonedElement.style.top = `${adjustTextPosition(layer.data.y)}px`;
              clonedElement.style.transform = 'none';
              clonedElement.style.margin = '0';
              clonedElement.style.zIndex = index.toString();
              
              // Copy text styles
              clonedElement.style.fontFamily = computedStyle.fontFamily;
              clonedElement.style.fontSize = computedStyle.fontSize;
              clonedElement.style.color = computedStyle.color;
              clonedElement.style.fontWeight = computedStyle.fontWeight;
              clonedElement.style.fontStyle = computedStyle.fontStyle;
              clonedElement.style.textDecoration = computedStyle.textDecoration;
              clonedElement.style.textShadow = computedStyle.textShadow;
              clonedElement.style.webkitTextStroke = computedStyle.webkitTextStroke;
              clonedElement.style.backgroundImage = computedStyle.backgroundImage;
              clonedElement.style.webkitBackgroundClip = computedStyle.webkitBackgroundClip;
              clonedElement.style.webkitTextFillColor = computedStyle.webkitTextFillColor;
            }
          } else if (layer.type === 'background' && image.original) {
            const img = clonedContainer.querySelector('img');
            if (img) {
              img.src = image.original;
              img.style.position = 'absolute';
              img.style.top = '0';
              img.style.left = '0';
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'contain';
              img.style.zIndex = index.toString();
            }
          } else if (layer.type === 'foreground' && image.foreground) {
            const fgImg = clonedContainer.querySelector('img:last-child');
            if (fgImg) {
              fgImg.src = image.foreground;
              fgImg.style.position = 'absolute';
              fgImg.style.top = '0';
              fgImg.style.left = '0';
              fgImg.style.width = '100%';
              fgImg.style.height = '100%';
              fgImg.style.objectFit = 'contain';
              fgImg.style.zIndex = index.toString();
            }
          }
        });
      }
    });

    // Create and trigger download
    const filename = `text-behind-image${options.label ? `-${options.label}` : ''}.png`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', options.quality || 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}