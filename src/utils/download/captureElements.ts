import html2canvas from 'html2canvas';
import { ProcessedImage, TextElement } from '../../types';

export async function captureElements(
  container: HTMLElement, 
  image: ProcessedImage, 
  texts: TextElement[]
): Promise<HTMLCanvasElement> {
  // Clone the container and its contents
  const clone = container.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '-9999px';
  clone.style.width = `${container.offsetWidth}px`;
  clone.style.height = `${container.offsetHeight}px`;
  document.body.appendChild(clone);

  try {
    // Wait for fonts to load
    await document.fonts.ready;

    // Wait for images to load
    const images = clone.getElementsByTagName('img');
    await Promise.all(
      Array.from(images).map(
        img => new Promise(resolve => {
          if (img.complete) resolve(null);
          else img.onload = () => resolve(null);
        })
      )
    );

    // Ensure text elements are properly positioned
    const textElements = clone.querySelectorAll('[data-draggable="true"]');
    textElements.forEach(el => {
      if (el instanceof HTMLElement) {
        const textId = el.getAttribute('data-text-id');
        const text = texts.find(t => t.id === textId);
        if (text) {
          el.style.transform = `translate(${text.x}px, ${text.y}px)`;
          el.style.position = 'absolute';
          el.style.left = '0';
          el.style.top = '0';
          el.style.zIndex = '1';
        }
      }
    });

    // Capture with html2canvas
    return await html2canvas(clone, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white',
      scale: 2,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.querySelector(`#${clone.id}`);
        if (clonedContainer) {
          const elements = clonedContainer.querySelectorAll('[data-draggable="true"]');
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              // Ensure visibility and correct positioning
              el.style.opacity = '1';
              el.style.visibility = 'visible';
            }
          });
        }
      }
    });
  } finally {
    document.body.removeChild(clone);
  }
}