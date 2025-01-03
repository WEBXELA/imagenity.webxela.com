export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function createDownloadLink(canvas: HTMLCanvasElement, filename: string, quality = 1.0) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', quality);
  return link;
}