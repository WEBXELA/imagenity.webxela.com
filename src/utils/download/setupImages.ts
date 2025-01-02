import { ProcessedImage } from '../../types';

export async function setupImages(element: HTMLElement, image: ProcessedImage | null): Promise<void> {
  if (!image?.original) return;

  // Setup background image
  const bgImg = element.querySelector('img');
  if (bgImg) {
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = image.original;
    await new Promise((resolve) => {
      bgImg.onload = resolve;
      bgImg.onerror = resolve;
    });
  }

  // Setup foreground image
  if (image.foreground) {
    const fgImg = element.querySelector('img:last-child');
    if (fgImg) {
      fgImg.crossOrigin = 'anonymous';
      fgImg.src = image.foreground;
      await new Promise((resolve) => {
        fgImg.onload = resolve;
        fgImg.onerror = resolve;
      });
    }
  }
}