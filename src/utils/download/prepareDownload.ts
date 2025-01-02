import { ProcessedImage, TextElement } from '../../types';
import WebFont from 'webfontloader';

export async function prepareDownload(container: HTMLElement, image: ProcessedImage | null, texts: TextElement[]) {
  // Load fonts
  const uniqueFonts = [...new Set(texts.map(text => text.fontFamily))];
  if (uniqueFonts.length > 0) {
    await new Promise((resolve) => {
      WebFont.load({
        google: { families: uniqueFonts },
        active: resolve,
        inactive: resolve,
        timeout: 3000
      });
    });
  }

  // Create and setup clone
  const clone = container.cloneNode(true) as HTMLElement;
  clone.style.position = 'relative';
  clone.style.width = `${container.offsetWidth}px`;
  clone.style.height = `${container.offsetHeight}px`;

  return clone;
}