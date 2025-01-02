import { TextPosition } from '../../types';

export function calculateElementPosition(
  element: HTMLElement,
  containerRect: DOMRect
): TextPosition {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  
  // Get the transform values
  const transform = new DOMMatrix(computedStyle.transform);
  
  // Calculate absolute position
  return {
    x: transform.m41,
    y: transform.m42
  };
}