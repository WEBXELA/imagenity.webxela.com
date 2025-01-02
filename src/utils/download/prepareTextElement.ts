import { TextElement } from '../../types';
import { generateTextEffectStyles } from '../textEffects';

export function prepareTextElement(
  textElement: HTMLElement,
  originalElement: HTMLElement,
  container: HTMLElement,
  text: TextElement,
  zIndex: number
): void {
  // Get container dimensions
  const containerRect = container.getBoundingClientRect();
  const elementRect = originalElement.getBoundingClientRect();

  // Calculate position relative to container
  const top = text.y;
  const left = text.x;

  // Apply all styles
  const styles: Partial<CSSStyleDeclaration> = {
    ...generateTextEffectStyles(text.effects || {}),
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    fontFamily: `"${text.fontFamily}", sans-serif`,
    fontSize: `${text.fontSize}px`,
    color: text.color,
    fontWeight: text.isBold ? 'bold' : 'normal',
    fontStyle: text.isItalic ? 'italic' : 'normal',
    textDecoration: text.isUnderline ? 'underline' : 'none',
    transform: 'none',
    zIndex: zIndex.toString(),
    userSelect: 'none',
    whiteSpace: 'nowrap',
    lineHeight: '1',
    margin: '0',
    padding: '0',
    display: 'block'
  };

  Object.assign(textElement.style, styles);
  
  // Ensure text content is set
  textElement.textContent = text.text;
  
  // Remove any unnecessary elements
  const dragHandle = textElement.querySelector('.drag-handle');
  if (dragHandle) {
    dragHandle.remove();
  }
}