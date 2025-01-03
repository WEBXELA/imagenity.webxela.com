import { TextElement } from '../../types';
import { generateTextEffectStyles } from '../textEffects';

export function createTextElement(text: TextElement): HTMLDivElement {
  const element = document.createElement('div');
  element.textContent = text.text;
  
  const styles = {
    position: 'absolute',
    transform: `translate(${text.x}px, ${text.y}px)`,
    fontFamily: `"${text.fontFamily}", sans-serif`,
    fontSize: `${text.fontSize}px`,
    color: text.color,
    fontWeight: text.isBold ? 'bold' : 'normal',
    fontStyle: text.isItalic ? 'italic' : 'normal',
    textDecoration: text.isUnderline ? 'underline' : 'none',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    zIndex: '1',
    userSelect: 'none',
    ...generateTextEffectStyles(text.effects || {})
  };

  Object.assign(element.style, styles);
  return element;
}