import { ProcessedImage, TextElement } from '../types';

export function drawCanvas(
  canvas: HTMLCanvasElement,
  image: ProcessedImage | null,
  texts: TextElement[]
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size
  const container = canvas.parentElement;
  if (container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background image
  if (image?.original) {
    const img = new Image();
    img.src = image.original;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw texts
      texts.forEach(text => {
        ctx.save();
        
        // Apply text styles
        ctx.font = `${text.isBold ? 'bold' : ''} ${text.fontSize}px "${text.fontFamily}"`;
        ctx.fillStyle = text.color;
        
        // Apply effects
        if (text.effects) {
          if (text.effects.shadow) {
            ctx.shadowColor = text.effects.shadow.color;
            ctx.shadowBlur = text.effects.shadow.blur;
            ctx.shadowOffsetX = text.effects.shadow.offsetX;
            ctx.shadowOffsetY = text.effects.shadow.offsetY;
          }
          
          if (text.effects.outline) {
            ctx.strokeStyle = text.effects.outline.color;
            ctx.lineWidth = text.effects.outline.width;
            ctx.strokeText(text.text, text.x, text.y);
          }
        }
        
        ctx.fillText(text.text, text.x, text.y);
        ctx.restore();
      });

      // Draw foreground image
      if (image.foreground) {
        const fgImg = new Image();
        fgImg.src = image.foreground;
        fgImg.onload = () => {
          ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
        };
      }
    };
  }
}