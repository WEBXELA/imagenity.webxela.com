import { TextElement } from '../../types';
import { generateTextEffectStyles } from '../textEffects';

export function setupTexts(element: HTMLElement, texts: TextElement[]): void {
  const textElements = element.querySelectorAll('[data-draggable="true"]');
  
  textElements.forEach(el => {
    if (!(el instanceof HTMLElement)) return;
    
    const textId = el.getAttribute('data-text-id');
    const text = texts.find(t => t.id === textId);
    
    if (text) {
      // Position
      el.style.position = 'absolute';
      el.style.left = `${text.x}px`;
      el.style.top = `${text.y}px`;
      el.style.transform = 'none';
      
      // Basic styles
      el.style.fontFamily = `"${text.fontFamily}", sans-serif`;
      el.style.fontSize = `${text.fontSize}px`;
      el.style.color = text.color;
      el.style.fontWeight = text.isBold ? 'bold' : 'normal';
      el.style.fontStyle = text.isItalic ? 'italic' : 'normal';
      el.style.textDecoration = text.isUnderline ? 'underline' : 'none';
      
      // Effects
      if (text.effects) {
        const effectStyles = generateTextEffectStyles(text.effects);
        Object.assign(el.style, effectStyles);
      }
      
      // Ensure text content
      el.textContent = text.text;
    }
  });
}